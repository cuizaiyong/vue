/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  /**
   * 注册Vue.directive Vue.component Vue.filter，如果没有传递definition，就通过id获取相应的
   * 指令、组件或者过滤器
   * @param {id} 指令、组件或者过滤器的名字
   * @param {definiton} 对象或者函数
   */
  
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      // 如果没有传递definition，表示获取相应的组件、指令或者过滤器
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          // 这儿在调用Vue.extend，这儿看出可以直接给Vue.component(componentName, Vue.extend(/**/))
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          // 如果是指令，并且definition是函数，则将definition重置为对象{bind: definiton, update: definition}
          definition = { bind: definition, update: definition }
        }
        // 将相应的组件、指令和函数挂在到全局的options上
        // Vue.options['components']['MyComponent']=definition
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
