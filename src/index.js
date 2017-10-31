/**
 * vue日志打印器
 *
 * 基于'@~lisfan/logger'模块，但只包装了3个方法:log,warn,
 *
 * @version 2.0.0
 */

import Logger from '@~lisfan/logger'

// 私有方法
const _actions = {
  xx() {
    this[logType] = (vm, ...args) => {
      // 不存在vue实例时，且存在打印内容时，进行打印
      if (!vm && args.length > 0) {
        return logger[logType].call(logger, ...args
        )
      }

      // 不存在vue实例时，且可打印内容不存在，则不打印
      if (!vm && args.length === 0) {
        return false
      }

      if (vm._isVue !== true) {
        return logger[logType].call(logger, vm, ...args
        )
      }

      // 获取当前组件名称
      // vue组件实例会有两种存在方式，1.是游离独立的（直接通过new Vue创建的），2.一种是作为某个vue实例的子组件实例创在的
      // 1. vm.$options.__file
      // 2. vm.$options._parentVnode.componentOptions.Ctor.options.__file
      const filename = vm.$options.__file || (vm.$options._parentVnode && vm.$options._parentVnode.componentOptions.Ctor.options.__file) || 'unknow'

      const index = filename.lastIndexOf('/')
      const componentName = filename.slice(index + 1, -4)

      // 获取当前路由名称
      // vue组件实例会有两种存在方式，1.是游离独立的（直接通过new Vue创建的），2.一种是作为某个vue实例的子组件实例创在的
      // 1. global.$router && global.$router.currentRoute.name
      // 1. vm.$route && vm.$route.name
      const routeName = (vm.$route && vm.$route.name) || (global.$router && global.$router.currentRoute.name) || 'unknow'
      logger[logType].call(logger, ...args, '@' + componentName.toString(), '#' + routeName.toString())
    }
  }
}

/**
 * Vue日志打印类，打印内容的同时，显示打印方法调用所在的路由和组件名
 *
 * @class
 */
class VueLogger extends Logger {
  /**
   * 默认配置选项
   *
   * @since 1.0.0
   * @static
   * @override
   * @memberOf VueLogger
   * @property {number} maxAge=-1 - 数据可存活时间，默认永久缓存
   */
  static options = {
    name: 'vue-logger',
    debug: true
  }

  /**
   * 构造函数
   *
   * @param {string} options - 配置选项
   * @param {string} options.namespace - 命名空间
   */
  constructor(options) {
    console.log('222')
    super(options)
  }

  /**
   * 覆盖log方法的调用
   * @override
   */
  log() {
    console.log(1111)
  }

  warn() {
    console.log(2222)
  }

  error() {
    console.log(3333)
  }
}

export default VueLogger