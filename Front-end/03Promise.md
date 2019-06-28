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
上面代码中，p1是一个 Promise，3 秒之后变为rejected。p2的状态在 1 秒之后改变，resolve方法返回的是p1。由于p2返回的是另一个 Promise，导致p2自己的状态无效了，由p1的状态决定p2的状态。所以，后面的then语句都变成针对后者（p1）。又过了 2 秒，p1变为rejected，导致触发catch方法指定的回调函数。
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

Promise.prototype.then()  

then方法是定义在原型对象promise.prototype上的，他的作用是为Promise实例添加状态改变时的回调函数。

Promise.prototype.catch()  
是then方法的别名，用于指定发生错误时的回调函数。如果异步操作抛出错误，状态就会变为rejecte，就会调用catch方法中指定的回调函数，处理这个错误，另外，then方法指定的回调函数，如果运行中抛出错误，也会被catch方法捕获。  

resolve语句后面在抛出错误，不会被捕获，等于没抛出，因为promise的状态一旦改变，就永久保持该状态，不会再改变了  

```
// bad
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  });

// good
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });
```
above 代码中，第二种写法好于第一种写法，理由是第二种写法可以捕获前面then方法中执行的错误，也更接近同步的写法，因此，建议总是使用catch方法，而不使用then方法的第二个参数。

```
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
});

setTimeout(() => { console.log(123) }, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```  

#### catch能捕获then中的错误，建议总是使用catch
上面代码中，someAsyncThing函数产生的 Promise 对象，内部有语法错误。浏览器运行到这一行，会打印出错误提示ReferenceError: x is not defined，但是不会退出进程、终止脚本执行，2 秒之后还是会输出123。这就是说， 
  #### Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”
#### Promise 对象后面要跟catch方法，这样可以处理 Promise 内部发生的错误。catch方法返回的还是一个 Promise 对象，因此后面还可以接着调用then方法。

```
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing()
.catch(function(error) {
  console.log('oh no', error);
})
.then(function() {
  console.log('carry on');
});
```
运行完catch方法指定的回调函数，会接着运行后面那个then方法指定的回调函数。如果没有报错，则会跳过catch方法。

### Promise.prototype.finally()

finally方法用于指定不管promise对象最后状态如何，都会执行操作。  
finally方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是fulfilled还是rejected。这表明，finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果  
finally本质上是then方法的特例。

```
promise
.finally(() => {
  // 语句
});

// 等同于
promise
.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);
```
```
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```

### Promise.all()

promise.all方法用于将多个promise实例，包装成一个新的promise实例  

`const p = Promise.all([p1, p2, p3]);`  

Promise.all方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。  

p的状态由p1、p2、p3决定，分成两种情况。
1）只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。

2）只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数

### Promise.race()
promise.race方法同样是将多个promise实例，包装成一个新的promise实例。
`const p = Promise.race([p1, p2, p3]);`  
  #### 只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。


### Promise.resolve()

将现有的对象转为promise对象，promise.resolve()方法就起到这个作用。
```
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

1）参数是一个 Promise 实例
如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例。  

2）参数是一个thenable对象
```
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function(value) {
  console.log(value);  // 42
});
```  
3）参数不是具有then方法的对象，或根本就不是对象    

如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。
```
const p = Promise.resolve('Hello');

p.then(function (s){
  console.log(s)
});
// Hello
```
上面代码生成一个新的 Promise 对象的实例p。由于字符串Hello不属于异步操作（判断方法是字符串对象不具有 then 方法），返回 Promise 实例的状态从一生成就是resolved，所以回调函数会立即执行。Promise.resolve方法的参数，会同时传给回调函数  

### 4）不带有任何参数
Promise.resolve()方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。   
所以，如果希望得到一个 Promise 对象，比较方便的方法就是直接调用Promise.resolve()方法。  

需要注意的是，立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。

```
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
```

### Promise.reject()  
Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。  
```
const p = Promise.reject('出错了');
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s) {
  console.log(s)
});
// 出错了
```

```
const thenable = {
  then(resolve, reject) {
    reject('出错了');
  }
};

Promise.reject(thenable)
.catch(e => {
  console.log(e === thenable)
})
// true
```
Promise.reject方法的参数是一个thenable对象，执行以后，后面catch方法的参数不是reject抛出的“出错了”这个字符串，而是thenable对象 

## 应用

### 加载图片
```
const preloadImage = function (path) {
  return new Promise(function (resolve, reject) {
    const image = new Image();
    image.onload  = resolve;
    image.onerror = reject;
    image.src = path;
  });
};
```