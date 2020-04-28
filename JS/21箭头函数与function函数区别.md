> 箭头函数是普通函数的简写，可以更优雅的定义一个函数，和普通函数相比，有以下几点差异：
> 
> 1、函数体内的 this 对象，就是定义时所在的对象，而不是使用时所在的对象。
> 
> 2、不可以使用 arguments 对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
> 
> 3、不可以使用 yield 命令，因此箭头函数不能用作 Generator 函数。
> 
> 4、不可以使用 new 命令，因为：
> 
> * 没有自己的 this，无法调用 call，apply。
> * 没有 prototype 属性 ，而 new 命令在执行时需要将构造函数的 prototype 赋值给新的对象的 __proto__
> 
> new 过程大致是这样的：
> 
> ```js
> function newFunc(father, ...rest) {
>   var result = {};
>   result.__proto__ = father.prototype;
>   var result2 = father.apply(result, rest);
>   if (
>     (typeof result2 === 'object' || typeof result2 === 'function') &&
>     result2 !== null
>   ) {
>     return result2;
>   }
>   return result;
> }
> ```

