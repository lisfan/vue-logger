# vue-logger

## vue 日志打印器

[API documentation](https://lisfan.github.io/vue-logger/)

## Feature 特性

- 输出内容的同时，输出调用日志打印器实例方法所在的组件文件名称(完整理的路径)和路由名称

## Detail 详情

- 该模块的的作用与[@~lisfan/logger](https://www.npmjs.com/package/@~lisfan/logger)在使用场景上有所不同，该模块作为vue生态系统中的一环，依赖vue框架
- 未传入vue实例配置参数时时，则进行常规打印，表现与Logger实例一致

## Install 安装

```bash
npm install -S @~lisfan/vue-logger
```

## Usage 起步

```js
// 使用场景：当前是一个自定义的vue指令，在./views/start.vue组件调用该指令，且当前路由路径对应的name属性值为order
// ./vue-directive.js

import VueLogger from '@~lisfan/vue-logger'

let vueLogger

Vue.directive('image-loader', {
    bind ($el, binding, vnode) {
      vueLogger= new VueLogger({
        name: 'vue-logger'
        vm: vnode.context // vnode.context 是一个vue实例
      })

      vueLogger.log('指令已绑定') // [vue-logger]: 指令已绑定 @client/views/start.vue #order
    }
  })
```
