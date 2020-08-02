/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  /**
   * 注册插件，通过Vue.use来使用
   * @param {Function | Object} plugin 
   */
  Vue.use = function (plugin: Function | Object) {
    // 如果插件已经注册过了，则直接返回
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    // Vue.use(MyPlugin, options)  args = [options]
    const args = toArray(arguments, 1)
    // args = [Vue, options]
    args.unshift(this)
    // 如果MyPlugin具有install函数，执行install(Vue, options)其中，install的this指向了plugin本身
    // 因此可以往plugin里面传递一些参数供使用
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      // 如果plugin是函数并且没有install函数，直接执行plugin函数
      plugin.apply(null, args)
    }
    // 存储已经注册过得plugin
    installedPlugins.push(plugin)
    return this
  }
}
