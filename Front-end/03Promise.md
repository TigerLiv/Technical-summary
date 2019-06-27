## Promise

promise是异步编程的一种解决方案，比传统的解决方案--回调函数和事件--更合理更强大

所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件的结果，从语法上说，Promise是一个对象，他可以获取异步操作的消息，promise提供统一的API，各种异步操作都可以用同样的方法进行处理。

Promise对象有以下两个特点：  
1.对象状态不受外界影响。Promise对象代表一个异步操作，有三种状态，pending，fulfilled和rejected，只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字由来，承诺 ，表示其他手段无法改变。  
2.一旦状态改变，就不会再变，任何时候都可以得到这个结果，Promise状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保存这个结果，这时候就称为resolved。如果改变已经发生了，你再对promise对象添加回调函数，也会立即得到这个结果。这与event事件不同，如果你错过了它，再去监听，是得不到结果的。

Promise也有一些缺点，首先，无法取消promise，一旦新建它就会立即执行，无法中途取消，其次，如果不设置回调函数，promise内部抛出的错误，不会反映到外部，第三，当处于pending状态时，无法得知目前进展到哪一个阶段。  

```
const promise= new Promise(function (resolve,reject){
    if('异步成功'){
        resolve()
    }else {
        reject()
    }
})
```

Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject，他们是两个函数。

resolve函数的作用，将Promise对象的状态从未完成变为成功，在异步操作成功时调用，并将异步操作的结果，作为参数传递出去。reject同理。

Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数。
```
promise.then(function (value){
//success
},function (error){

})
```

then方法可以接受两个回调函数作为参数，第一个回调函数是promise对象的状态变为resolved时调用，第二个回调函数是promise对象状态变为rejected时调用。其中第二个函数是可以选的，不一定要提供，这两个函数都接受promise对象传出的值作为参数。


Promise新建后就会立即执行。
```
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```

```
const getJSON = function(url) {
  const promise = new Promise(function(resolve, reject){
    const handler = function() {
      if (this.readyState !== 4) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
    const client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

  });

  return promise;
};

getJSON("/posts.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
```

注意，这时p1的状态就会传递给p2，也就是说，p1的状态决定了p2的状态。如果p1的状态是pending，那么p2的回调函数就会等待p1的状态改变；如果p1的状态已经是resolved或者rejected，那么p2的回调函数将会立刻执
```
const p1 = new Promise(function (resolve, reject) {
  // ...
});

const p2 = new Promise(function (resolve, reject) {
  // ...
  resolve(p1);
})
```
```
const p1 = new Promise(function (resolve, reject) {
  setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
  setTimeout(() => resolve(p1), 1000)
})

p2
  .then(result => console.log(result))
  .catch(error => console.log(error))
// Error: fail
```

```
new Promise((resolve, reject) => {
  resolve(1);
  console.log(2);
}).then(r => {
  console.log(r);
});
// 2
// 1
```
调用resolve(1)以后，后面的console.log(2)还是会执行，并且会首先打印出来。这是因为立即 resolved 的 Promise 是在本轮事件循环的末尾执行，总是晚于本轮循环的同步任务