### bind实现

1.
```javascript
Function.prototype.bind= function (context){
    var self = this;
    var args=Array.prototype.slice.call(arguments,1);
    return function (){
        var bindArgs = Array.prototype.slice.call(arguments);
        self.apply(context,args.concat(bindArgs));
    }

}
```

2. 
```javascript
Function.prototype.bind = function(context){
    var self = this;
    var args = Array.prototype.slice.call(arguments,1);
    var fbound=function(){
        var bindArgs = Array.prototype.slice.call(arguments);
        // 当作为构造函数时，this 指向实例，self 指向绑定函数，因为下面一句 `fbound.prototype = this.prototype;`，已经修改了 fbound.prototype 为 绑定函数的 prototype，此时结果为 true，当结果为 true 的时候，this 指向实例。
        // 当作为普通函数时，this 指向 window，self 指向绑定函数，此时结果为 false，当结果为 false 的时候，this 指向绑定的 context。

        self.apply(this instanceof self?this:context,args.concat(bindArgs));
    }

    fbound.prototype=this.prototype
    return fbound;
}
```

### 构造函数效果的优化实现

直接将 fbound.prototype = this.prototype，我们直接修改 fbound.prototype 的时候，也会直接修改函数的 prototype。这个时候，我们可以通过一个空函数来进行中转：
```javascript
// 第四版
Function.prototype.bind2 = function (context) {

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);

    var fNOP = function () {};

    var fbound = function () {
        var bindArgs = Array.prototype.slice.call(arguments);
        self.apply(this instanceof self ? this : context, args.concat(bindArgs));
    }
    fNOP.prototype = this.prototype;
    fbound.prototype = new fNOP();
    return fbound;

}
```


```javascript
Function.prototype.bind2 = function (context) {

    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);
    var fNOP = function () {};

    var fbound = function () {
        self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)));
    }

    fNOP.prototype = this.prototype;
    fbound.prototype = new fNOP();

    return fbound;

}
```


call,apply模拟实现

https://github.com/mqyqingfeng/Blog/issues/11

```javascript
Function.prototype.call=function (context){
    //获取调用call的函数
     context.fn=this;
    context.fn();
    delete context.fn
}
```

```javascript
Function.prototype.call=function (context) {
    var context=context||this;
    context.fn=this;

    var args=[];
    //不定长参数
    for( var i = 0,len=arguments.length; i < len; i++){
        args.push('arguments['+i+']');
    }

    var result=eval('context.fn('+args+')');

    delete context.fn;
    return result;
}

```

```javascript
Function.prototype.apply = function (context, arr) {
    var context = Object(context) || window;
    context.fn = this;

    var result;
    if (!arr) {
        result = context.fn();
    }
    else {
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```