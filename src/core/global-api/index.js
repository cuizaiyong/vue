/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  // 拦截Vue.config，不要试图去修改Vue.config的值
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }
  // Vue.set 设置属性为响应式的  Vue实例的$set一致
  Vue.set = set
  // Vue.delete 删除响应式的属性  Vue实例的$delete一致
  Vue.delete = del
  // Vue.nextTick 下一个事件循环来的时候触发的回调函数，这跟Vue的异步更新机制有关系 Vue实例的$nextTick一致
  Vue.nextTick = nextTick

  // 2.6 explicit observable API
  // 注册Vue.observable，实现对象的监听
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }
  // 初始化Vue.options
  Vue.options = Object.create(null)
  // 初始化Vue.options.components、Vue.options.directives和Vue.options.filters
  // 所有通过Vue.component注册的组件会放在全局的Vue.options.components
  // 所有通过Vue.filter注册的过滤器会放在全局的Vue.options.filters
  // 所有通过Vue.directive注册的指令会放在全局的Vue.options.directives
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue
  // 挂在keep-alive内置组件到全局组件对象上面
  extend(Vue.options.components, builtInComponents)
  // 注册Vue.use()用来注册插件
  initUse(Vue)
  // 注册Vue.mixin() 实现混入
  initMixin(Vue)
  // 注册Vue.extend() 通过传入options返回组件的构造函数
  initExtend(Vue)
  // 注册Vue.component、Vue.directive、Vue.filter
  initAssetRegisters(Vue)
}
