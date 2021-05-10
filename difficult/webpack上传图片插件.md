# webpack实现上传图片插件

### 1.首先到webpack官网找到打包完毕的钩子，让后在钩子里做点事

```js
class OssPlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync('done', (compilation, callback) => {
      // 此处通过node api读取打包文件列表
      fs.readdir('build/images', (err, files) => {
        if (err) {
          console.error(err)
        } else {
          uploadImg(files)
        }
      })
      // 记得调用callback避免webpack后续动作不执行
      callback()
    })
  
```

### 2.编写图片上传函数，此处demo为阿里云oss

```js
async function uploadImg(files) {
  let OSS = require('ali-oss')

  let client = new OSS({
    region: 'oss-cn-shenzhen', // cdn节点位置
    accessKeyId: '',
    accessKeySecret: '',
    bucket: '', // oss bucket目录
  });

  // 此处为循环上传，用for循环相信各位大佬都了解（避免并行上传出错）
  // 同时方便统计是否上传完毕
  for (let i = 0, len = files.length; i < len; i++) {
    // common/${files[i]}为上传后路径，阿里云支持指定上传后文件名
    // 指定文件名是必须的，因为生成的网络路径是拼接好的，不知道其他平台支不支持，这一步尤为关键，不支持就做不了下一步
    await client.put(`common/${files[i]}`, `build/images/${files[i]}`);
  }

  // 图片上传完毕后删除图片
  for (let i = 0, len = files.length; i < len; i++) {
    fs.unlinkSync(`dist/common/${files[i]}`)
  }

  console.log('\x1B[44m%s\x1B[49m', 'upload img fished>>>>>>>>>>>>>>>')
}
```

### 3.最重要的步骤来了，配置图片路径

```js
{
  test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
  loader: require.resolve('url-loader'),
  options: {
    // 正式环境一律不使用base64，全部打包为文件
    limit: isEnvProduction ? imageInlineSizeLimit : 0,
    // 此处两个配置尤为重要，路径会拼接为：http://movie.xmwhs88.com/images/[name].[hash:8].[ext]
    // images一定要和上传后生成的路径一至
    name: 'images/[name].[hash:8].[ext]',
    // publicPath记得加上http:（https：）避免转换成绝对路径
    publicPath: isEnvDevelopment ? '' : 'http://movie.xmwhs88.com/'
  },
},
```
