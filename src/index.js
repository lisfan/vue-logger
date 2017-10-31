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
  /**
   * 代理运行打印方法
   * @param {function} superMethod - 要调用Logger的方法
   * @param {VueLogger} self - VueLogger 实例
   * @param {Vue} vm - vue 实例
   * @param {...*} args - 其他参数
   * @returns {VueLogger}
   */
  proxyRun(superMethod, self, vm, ...args) {
    // 若不存在vue实例时，则直接打印内容
    if (vm._isVue !== true) {
      return superMethod.call(self, vm, ...args)
    }

    // 获取当前组件名称
    // vue组件实例[文件名]会有两种存在方式
    // 1.一种是游离独立的（通过new Vue创建的独立片断）：取vm.$options.__file
    // 2.另一种是作为某个vue实例的子组件实例存在：取vm.$options._parentVnode.componentOptions.Ctor.options.__file
    // 2.
    let componentName = 'unknow'

    try {
      let filename = vm.$options.__file || (vm.$options._parentVnode && vm.$options._parentVnode.componentOptions.Ctor.options.__file)
      componentName = filename.slice(filename.lastIndexOf('/') + 1, -4)
    } catch (e) {
      // 错误捕获
    }

    // 获取路由名称
    // vue组件实例[路由名]会有两种存在方式
    // 1. 一种是游离独立的（通过new Vue创建的独立片断），游离在外的无法
    // 2. 另一种是作为某个vue实例的子组件实例存在：vm.$route && vm.$route.name
    const routeName = (vm.$route && vm.$route.name) || 'unknow'
    superMethod.call(self, ...args, '@' + componentName.toString(), '#' + routeName.toString())

    return self
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
   * @since 2.0.0
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
    super(options)
  }

  /**
   * 针对vue实例的log打印
   *
   * @since 2.0.0
   * @override
   * @param {Vue} vm - vue实例
   * @param {...*} args - 其他参数
   * @return {VueLogger}
   */
  log(...args) {
    return _actions.proxyRun(super.log, this, ...args)
  }

  /**
   * 针对vue实例的warn打印
   *
   * @since 2.0.0
   * @override
   * @param {Vue} vm - vue实例
   * @param {...*} args - 其他参数
   * @return {VueLogger}
   */
  warn(...args) {
    return _actions.proxyRun(super.warn, this, ...args)
  }

  /**
   * 针对vue实例的error打印
   *
   * @since 2.0.0
   * @override
   * @param {Vue} vm - vue实例
   * @param {...*} args - 其他参数
   * @return {VueLogger}
   */
  error(...args) {
    return _actions.proxyRun(super.error, this, ...args)
  }

  /**
   * 针对vue实例的trace打印
   *
   * @since 2.0.0
   * @override
   * @param {Vue} vm - vue实例
   * @param {...*} args - 其他参数
   * @return {VueLogger}
   */
  trace(...args) {
    return _actions.proxyRun(super.trace, this, ...args)
  }
}

export default VueLogger