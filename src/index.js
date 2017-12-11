/**
 * @file vue日志打印器
 * @author lisfan <goolisfan@gmail.com>
 * @version 2.0.0
 * @licence MIT
 */

/**
 * VueLogger继承自Logger模块，API请参考[Logger文档](https://lisfan.github.io/logger/)
 *
 * @external Logger
 * @see {@link https://lisfan.github.io/logger/|Logger}
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
   * @return {VueLogger}
   */
  proxyRun(superMethod, self, vm, ...args) {
    // 若不存在vue实例时，则直接打印内容
    if (vm._isVue !== true) {
      return superMethod.call(self, vm, ...args)
    }

    // 获取当的组件文件名称
    // vue组件实例[文件名]会有两种存在方式
    // 1.一种是游离独立的（通过new Vue创建的独立片断）：取vm.$options.__file
    // 2.另一种是作为某个vue实例的子组件实例存在：取vm.$options._parentVnode.componentOptions.Ctor.options.__file
    // 2.
    let filename = 'unknow'

    try {
      if (vm.$options.__file) {
        filename = vm.$options.__file
      } else if (vm.$options.$vnode) {
        filename = vm.$options.$vnode.componentOptions.Ctor.options.__file
      } else if (vm.$options._parentVnode) {
        filename = vm.$options._parentVnode.componentOptions.Ctor.options.__file
      }
    } catch (e) {
      // 错误捕获
    }

    // 获取路由名称
    // vue组件实例[路由名]会有两种存在方式
    // 1. 一种是游离独立的（通过new Vue创建的独立片断），游离在外的无法
    // 2. 另一种是作为某个vue实例的子组件实例存在：vm.$route && vm.$route.name
    const routeName = (vm.$route && vm.$route.name) || 'unknow'
    superMethod.call(self, ...args, '@' + filename.toString(), '#' + routeName.toString())

    return self
  }
}

/**
 * @classdesc
 *
 * Vue日志打印类，继承自[Logger类]{@link https://lisfan.github.io/logger/}：针对于vue实例，支持打印内容的同时再打印出调用打印方法的组件文件名称(具体到子组件)和路由名称
 * 该文档只展示了覆盖的四个实例方法（`log`、`warn`、`error`、`trace`），且仅这四个方法支持打印输出，
 * 其他方法功能与Logger实例方法一致，API请参考[Logger文档]{@link https://lisfan.github.io/logger/}
 *
 * @class
 * @extends external:Logger
 */
class VueLogger extends Logger {
  /**
   * 打印器命名空间规则配置项
   * - 可以配置整个命名空间是否输出日志
   * - 也可以配置命名空间下某个实例方法是否输出日志
   *
   * [注]：内部始终读取Logger.rules
   *
   * @since 2.0.0
   * @memberOf VueLogger
   * @static
   * @getter
   * @readonly
   * @property {object} rules - 打印器命名空间规则配置集合
   */
  static get rules() {
    return Logger.rules
  }

  /**
   * 更改命名空间规则配置项
   * [注]从`localStorage`的`LOGGER_RULES`键中读取规则配置优先级最高，始终会覆盖其他规则
   *
   * [注]：内部始终调用Logger.configRules
   * @since 2.0.0
   * @static
   * @param {object} rules - 配置参数
   * @param {string} [rules.name] - 日志器命名空间
   * @param {boolean} [rules.debug] - 调试模式是否开启
   * @return {VueLogger}
   */
  static configRules(rules) {
    Logger.configRules(rules)

    return this
  }

  /**
   * 默认配置选项
   *
   * [注]：内部始终读取Logger.options
   *
   * @since 2.0.0
   * @static
   * @getter
   * @readonly
   * @memberOf VueLogger
   * @property {string} name - 日志器命名空间
   * @property {boolean} debug - 调试模式是否开启
   */
  static get options() {
    return {
      ...Logger.options,
      name: Logger.options.name === 'logger' ? 'vue-logger' : Logger.options.name
    }
  }

  /**
   * 更新默认配置选项
   *
   * [注]：内部始终调用Logger.config
   *
   * @since 2.0.0
   * @static
   * @param {object} options - 配置参数
   * @param {string} [options.name] - 日志器命名空间
   * @param {boolean} [options.debug] - 调试模式是否开启
   * @return {VueLogger}
   */
  static config(options) {
    Logger.config(options)

    return this
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