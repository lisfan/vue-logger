# logger 日志打印器

[API documentation](https://lisfan.github.io/logger/)

## Feature 特性

- 解决提交时因eslint提示console的语句无法通过问题
- 仅在开发环境打印日志，生产环境不打印日志

## Detail 详情

- 在console上包装了一层，支持console的所有的方法（包含部分非标准APi，但不包含未被废弃的API），部分API做了变化和新增加，未提及的保原效果不变，只是在原api上封装了一层进行代理运行，API使用方法可以参考[console API](https://developer.mozilla.org/en-US/docs/Web/API/Console/group)
  - 新增的isActivated、color、enable、disable方法
  - 调整error方法的作用：打印时会抛出错误，阻止脚本执行
  - 调整table方法的作用：如果数据非array或object类型，则使用this.log打印
- 若需要在生产环境下调式日志，可以更改或设置LS离线存储的值
   - localStorage设置`IS_DEV`为true
   - localStorage设置`LOGGER_RULES`配置命名空间规则
- 支持配置整个命名空间是否输出日志
- 支持配置命名空间下某个实例方法是否输出日志

## Install 安装

```bash
npm install -S @~lisfan/logger
```

## Usage 起步

``` js
import Logger from '@~lisfan/logger'

// 配置规则
Logger.configRules({
   request:true, // 该命名空间支持打印输出
   request.error:false, // 该命名空间下的error方法不支持打印输出
   response:false // 该命名空间不支持打印输出
})

const logger = new Logger() // 默认打印器，命名空间为`logger`
const loggerRequest = new Logger('request') // 创建命名空间为`request`的打印器
const loggerResponse = new Logger('response')

// 创建打印器，但关闭调试功能
const loggerDebug = new Logger({
   name: 'debug',
   debug: false
})

loggerRequest.log('请求url')    =>    [request]: 请求url
loggerRequest.error('请求url')    =>    // 无内容打印
loggerResponse.error('响应数据')    =>    // 无内容打印
loggerDebug.log('请求url')    =>     // 无内容打印
```
* 模块性质：vue相关
 * 作用范围：pc、mobile
 * 依赖模块：utils/logger
 * 来源项目：扫码点单H5
 * 初始发布日期：2017-05-24 20:00
 * 最后更新日期：2017-05-25 20:00
 *
 * ## 特性
 * - 该工具的作用与utils/logger在使用场景不同，该工具主要在vue相关的工具中使用
 * - 第一个参数如果传入的是vue实例，则会打印出当前实例的组件名称(具体到子组件)和路由name
 * - 未传入vue实例时，则常规打印
 * - [兼容的]某些情况下创建的vue实例未绑定$route属性时的路由名称取值 ，所以在vue-router实例创建时在全局对象上暴露了$router这个实例
 * ## Todo
 *
 * ## Changelog
 * ### 2017.05.23
 * - 更改获取组件名的方式，保证必定能打印出组件名
 *
 * ### 2017.05.28
 * - 某些情况下创建的vue实例未绑定$route属性时的路由名称取值
 *
 * ### 2017.05.31
 * - [fix] 修复this不存在，但有打印内容时不打印的问题
 *
 * ### 2017-06-19
 * - [refactor] 优化logger模块获取继续方法的方式
 *
 * ### 2017-08-29
 * - [fix] 日志打印器调用的组件名不从取commentTag字段
 *
 * ## Usage
 * ``` js
 *
 * ./start.vue  当前路由路径对应的name属性值为order
 *
 * import VueLogger from 'plugins/vue-logger'
 *
 * VueLogger.config({
 *    request:true,
 *    response:false // 该命名空间禁止打印
 * })
 *
 * const loggerRequest = new VueLogger('request')
 * const loggerResponse = new VueLogger('response')
 *
 * new Vue({
 *  created() {
 *    loggerRequest.log(this,'请求url')    =>    [request]: 请求url @start #order
 *    loggerResponse.error(this,'响应数据')    =>    // 无内容打印
 *  }
 * })
 * ```