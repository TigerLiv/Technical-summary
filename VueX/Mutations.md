## Mutations

The only way to actually change state in a Vuex store is by committing a mutation. Vuex mutations are very similar to events: each mutation has a string type and a handler. The handler function is where we perform actual state modifications, and it will receive the state as the first argument:

```
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // mutate state
      state.count++
    }
  }
})
```

You cannot directly call a mutation handler. Think of it more like event registration: "When a mutation with type increment is triggered, call this handler." To invoke a mutation handler, you need to call store.commit with its type:  
`store.commit('increment')`  


You can pass an additional argument to store.commit, which is called the payload for the mutation:


In most cases, the payload should be an object so that it can contain multiple fields
```
// ...
mutations: {
  increment (state, n) {
    state.count += n
  }
}

store.commit('increment', 10) 

//payload is object
store.commit('increment', {
  amount: 10
})
```  

```
store.commit({
  type: 'increment',
  amount: 10
})
```

### Mutations Follow Vue's Reactivity Rules

Prefer initializing your store's initial state with all desired fields upfront.

When adding new properties to an Object, you should either:

Use Vue.set(obj, 'newProp', 123), or

Replace that Object with a fresh one. For example, using the object spread syntax we can write it like this:

`state.obj = { ...state.obj, newProp: 123 }`

### Using Constants for Mutation Types

It is a commonly seen pattern to use constants for mutation types in various Flux implementations. This allows the code to take advantage of tooling like linters, and putting all constants in a single file allows your collaborators to get an at-a-glance view of what mutations are possible in the entire application:


```
// mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'
```
```
// store.js
import Vuex from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = new Vuex.Store({
  state: { ... },
  mutations: {
    // we can use the ES2015 computed property name feature
    // to use a constant as the function name
    [SOME_MUTATION] (state) {
      // mutate state
    }
  }
})
```

### Mutations Must Be Synchronous

the callback is not called yet when the mutation is committed, and there's no way for the devtool to know when the callback will actually be called - any state mutation performed in the callback is essentially un-trackable

### Committing Mutations in Components

You can commit mutations in components with `this.$store.commit('xxx')`, or use the mapMutations helper which maps component methods to `store.commit` calls (requires root store injection):



```
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    ...mapMutations([
      'increment', // map `this.increment()` to `this.$store.commit('increment')`

      // `mapMutations` also supports payloads:
      'incrementBy' // map `this.incrementBy(amount)` to `this.$store.commit('incrementBy', amount)`
    ]),
    ...mapMutations({
      add: 'increment' // map `this.add()` to `this.$store.commit('increment')`
    })
  }
}
```

### On to Actions

 For example, when you call two methods both with async callbacks that mutate the state, how do you know when they are called and which callback was called first? This is exactly why we want to separate the two concepts. In Vuex, ** mutations are synchronous transactions: **