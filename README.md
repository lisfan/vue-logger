# vue-logger

## vue 日志打印器

[API documentation](https://lisfan.github.io/vue-logger/)

## Feature 特性

- 输出内容的同时，输出调用打印方法所在的组件名(具体到子组件)和路由名称

## Detail 详情

- 该模块的的作用与[@~lisfan/logger](https://www.npmjs.com/package/@~lisfan/logger)在使用场景上有所不同，该模块作为vue生态系统中的一环，依赖vue框架
- 第一个参数必须是vue实例，才会打印出调用该打印的组件名称(具体到子组件)和路由名称
- 未传入vue实例时，则进行常规打印

## Install 安装

```bash
npm install -S @~lisfan/vue-logger
```

## Usage 起步

```js
// 使用场景：当前是一个自定义的vue指令，在start.vue组件调用该指令，且当前路由路径对应的name属性值为order
// ./vue-directive.js

import VueLogger from '@~lisfan/vue-logger'

const vueLogger = new VueLogger('image-loader')

Vue.directive('image-loader', {
    bind ($el, binding, vnode) {
      // vnode.context 是一个vue实例
      vueLogger.log(vnode.context, '指令已绑定') // [image-loader]: 指令已绑定 @start #order
    }
  })
```
