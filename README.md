# Typescript enhanced for VUEX 4.x
Better provide perceptive tips and TS checks, enhance state, geters infinite hierarchical property hints, and support read-only checks without affecting functions already supported by TS; Enhanced commit, dispache methods sense all operational type names and check payload parameters, and type names support name stitching of namespaced configurations.

Vuex PR: https://github.com/vuejs/vuex/pull/2054

## Installing
```bash
$ yarn add vuex-ts-enhanced
```

## Usage
```ts
import { createStore} from 'vuex'
import { ExCreateStore } from 'vuex-ts-enhanced'

class State {
  count: number = 1
}

export const store = (createStore as ExCreateStore)({
  state: new State()
  ...
})
```
Or to do so, adding a declaration file in your project folder:
```ts
// vuex.d.ts
declare module 'vuex' {
  export { createStore } from 'vuex-ts-enhanced'
}
```
Then you can use vuex without any change!

## Notes
**Unsupported actions:**
1. does not support object-style commit or dispatch because there is no limit to the payload must be object type.
2. does not support the Accessing Global Assets in Namespaced Modules, this usage is not recommended.
3. does not support dynamic registration of the module, need to use `(store.dispatch any)('doSomething')` way to skip detection.

*Incompatible usage `createStore<State>({...})`*  
Instead of manually specifying `<State>`, the default will automatically infer from the state option; When you need a custom type, use `class` to define and set the initial value, and then create an instance in the state configuration item;

  ```ts
  class State {
    name = ''
    count = 1
    list?:string[] = []
  }
  const store = createStore({
    state: new State(),
    ...
  }
  ```

## global type supplement
When you install a store into a Vue app, you mount the 'this.$store' property and inject the store into an app-level dependency, using "store" as the default key when `InjectionKey` is not specified, so we can use `inject('store')` in the combined API to get the store instance, but we can't sense the type of data returned, so we can give it the following way Store for type addition:
``` ts
import { store } from '.. /src/store'

interface InjectionMap {
  'store': typeof store
}

declare module '@vue/runtime-core' {

  interface ComponentCustomProperties {
    $store: InjectionMap['store']
  }
  export function inject<S extends keyof InjectionMap>(key:S):InjectionMap[S]
}
```
## vuex 4.x TS增强
更好的支持智能提示及TS检查，在不影响已有TS支持的功能情况下， 增强 state, getters 无限层级属性提示，并支持只读校验； 增强commit、dispache方法感知所有操作类型名称并对载荷参数检查，类型名称支持namespaced配置进行拼接。

不支持的操作：
1. 不支持对象方式分法或提交，因为没有限制载荷必须为对象类型
2. 不支持	在带命名空间的模块注册全局 action，不推荐这种用法
3. 不支持动态注册的模块， 需要使用 `(store.dispatch as any)('doSomething')` 的方式来跳过检查，


*不兼容的使用方法 `createStore<State>({...})`*  
> 无需手动指定`<State>`，默认将会自动从 state 选项中推断；当需要自定义类型时，请使用 `class` 进行定义并设置初始值，然后在state配置项中创建一个实例；

```ts
class State {
  name = ''
  count = 1
  list:string[] = []
}
const store = createStore({
  state: new State(),
  ...
}
```

*全局类型补充*  
将 store 安装到 Vue 应用时，会挂载`this.$store`属性，同时将 store 注入为应用级依赖，在未指定 `InjectionKey` 时将使用 "store" 作为默认 key, 因此我们可以在组合式 API 中使用`inject('store')`来拿到 store 实例，但是却无法感知返回的数据类型，为此我们可以使用下面的方式给 store 进行类型补充：

``` ts
import { store } from '.. /src/store'

interface InjectionMap {
  'store': typeof store
}

declare module '@vue/runtime-core' {

  interface ComponentCustomProperties {
    $store: InjectionMap['store']
  }
  export function inject<S extends keyof InjectionMap>(key:S):InjectionMap[S]
}
```

## Effect
![image](https://github.com/nicefan/vuex-ts-enhanced/raw/master/vuex-types.jpg)