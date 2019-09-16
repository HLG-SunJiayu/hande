2019/8/20

# vue

## 一、vue全家桶

### 1.Vue Router

Vue Router是[Vue.js](http://vuejs.org/)的官方路由器。它与Vue.js核心深度集成，使用Vue.js构建单页应用程序变得轻而易举。功能包括：

- 嵌套路由/视图映射
- 模块化，基于组件的路由器配置
- 路线参数，查询，通配符
- 查看由Vue.js过渡系统提供支持的过渡效果
- 细粒度的导航控制
- 与自动活动CSS类的链接
- HTML5历史模式或散列模式，在IE9中具有自动回退功能
- 可自定义的滚动行为



其中 <router-view> 是用来渲染通过路由映射过来的组件，当路径更改时，<router-view> 中的内容也会发生更改



当点击导航菜单的时候，会切换 tab.vue 中 <router-view> 中的内容这种只需要跳转页面，不需要添加验证方法的情况，可以使用 <router-link> 来实现导航的功能



vue 路由传参 params 与 query两种方式的区别：

​     query更加类似于我们ajax中get传参，params则类似于post，前者在浏览器地址栏中显示参数，后者则不显示



vue2.0之后，就不再对vue-resource更新，而是推荐使用axios。基于 Promise 的 HTTP 请求客户端，可同时在浏览器和 Node.js 中使用。

功能特性
         1、在浏览器中发送 XMLHttpRequests 请求

​         2、在 node.js 中发送 http请求

​         3、支持 Promise API

​         4、拦截请求和响应       

​         5、转换请求和响应数据        

​         6、取消请求        

​         7、自动转换 JSON 数据        

​         8、客户端支持保护安全免受 CSRF/XSRF 攻击

### 2.Vuex

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。

每一个 Vuex 应用的核心就是 store（仓库）。"store" 基本上就是一个容器，它包含着应用中大部分的状态(state)。

Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。

你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交(commit) mutations。这样使得我们可以方便地跟踪每一个状态的变化。



State
单一状态树，保存项目状态唯一数据源
通过 this.$store.state 直接访问
mapState 辅助函数

Getter
定义 getter 方法
暴露出 store.getters 对象供访问
mapGetters 辅助函数

Mutation
更改 store 数据
定义 mutations 方法，通过 this.$store.commit() 调用
Mutation 必须是同步函数
mapMutations 辅助函数

Action
通过调用 mutation 函数实现更新状态，但不能直接更新状态
可以包含异步操作
通过 this.$store.dispatch() 调用
结合 Promise 使用，实现组合 action
mapActions 辅助函数

Module
模块化状态，对每个模块添加命名空间
通过辅助函数调用，调用getter,mutation,action方法前添加命名空间