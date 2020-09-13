## PM2

pm2是个进程管理工具，维护一个进程列表，可以用它来管理node进程，负责所有正在运行的进程，并查看node进程的状态，支持性能监控，负载均衡等。

## 使用pm2管理node程序的好处

1.监听文件变化，自动重启程序  
2.支持性能监控  
3.负载均衡  
4.程序崩溃自动重启  
5.服务器重新启动时自动重新启动  
6.自动化部署项目  

## 常用命令

```js
pm2 start app.js

//指定应用程序名
pm2 start app.js --name application1

//集群模式启动  i表示实例的数量  max可用CPU的数量
pm2 start app.js -i max


//列出所有进程
pm2 list 

pm2 delete

pm2 delete all  

//查看某个进程具体情况
pm2 describe app 

//查看进程的资源消耗情况
pm2 monit

pm2 restart

//查看app的日志
pm2 logs app

//设置pm2开机自启
pm2 startup centos

//保存设置

pm2 save
```