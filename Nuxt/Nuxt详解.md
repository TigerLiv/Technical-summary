## Nuxt.js
通过对服务端客户端基础架构的抽象组织，Nuxt主要关注的是应用的UI渲染  


SSR：服务器端渲染成html  返回浏览器

用途：新闻、博客、电影  便于SEO


优点：基于Vue、自动代码分层、集成ESlint、ES6支持等



创建项目
```
vue init nuxt\starter
```

页面配置 nuxt.config.js

### 路由

通过文件的目录结构来自动配置

可以在.next文件夹下router.js查看路由  

全局页面动画(使用nuxt-link包裹才有效)
```css
.page-enter-active,.page-leave-avtive{

}
.page-enter{

}
.page-leave{

}

```
### 请求数据

```js
asyncData(){
    return   //Promise
}

async asyncData(){
    let data= await //Promise

}
```

### 放置静态资源

线上环境  

将资源文件 放到static文件夹下
使用```~/static/xxx.png```来访问
