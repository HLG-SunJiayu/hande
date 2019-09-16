# route 设计

## 紧跟 vue-router 步伐

## keep-alive 使用

> 使用 keep-alive 组件帮助我们保存页面组件的数据和当前状态，可以减少不必要的渲染和网络开销，实例创建则不会销毁。

> 同时，使用 keep-alive 使同一个vue页面实例的 beforeCreate、created、beforeMount、mounted 生命周期函数仅执行一次；
beforeDestroy、destroy生命周期函数不再执行。

> 新增 activated、deactivated 两个生命周期函数，分别在组件激活和组件停用时调用。

### 问题1

#### 描述

> 假设三个页面(列表A，摘要B，详情C)，遵循 A-B-C 的路由流向。

> 点击 A 项目1，进入B-C，数据加载渲染完毕，再依次回退，发现数据并不会重新刷新和渲染，不能满足当数据发生修改时重新刷新数据的情况

> 点击 A 项目2，进入B-C，发现数据均依旧显示项目1的数据内容

#### 解决

> 使用 activated 钩子函数，在 mounted 钩子中初始化页面，在 activated 函数中刷新数据。但是如此会出现问题2

### 问题2

#### 描述

> 当进行正向路由流向(A-B-C)时，页面没有问题。未发生任何操作(不引起数据改变)返回(C-B-A)时，发现B，A页面数据重新获取，引起无意义的网络请求和数据渲染。

#### 解决

> 使用全局变量或者使用store保存返回状态(Boolean)变量，如果需要刷新数据，则设定变量为true，在 activated 钩子中判断该变量并对于不同值做处理。

### 问题1、问题2在本项目中的解决

#### 使用 beforeRouteEnter 导航守卫及 路由 meta 控制

> beforeRouteEnter 提供三个参数 from、to、next，分别获取跳转前路由对象、跳转后路由对象、next函数。

> 在 to 路由的 meta 中添加数据 pageInit 来控制跳转完毕后页面是否需要刷新

> 配置在 mixin 中，简化页面js

查看 `/src/mixin/beforeRouteEnter.js`

#### 给 Router 对象添加 pushPage、backPage、replacePage

> pushPage 替换 push
 
> backPage 替换 back

> replacePage 替换 replace

> 并在方法中传递参数控制 pageInit

查看 `/src/router/router.js`
 
## 路由配置

### 添加 applications.vue 实例原因

> 多子应用的项目开发时，需要一个应用列表来显示并子应用，并可以直达子应用，用来模拟应用列表跳转到子应用的操作。

> 在打包部署时，不需要应用列表

### 使用 cross-env 给打包添加参数

`VUE_APP_BUILD` - 区分模式是开发还是部署

`VUE_APP_TARGET` - 判断当前打包子应用

### 配置

> 根据 process.env.VUE_APP_BUILD 值控制是否需要添加 application 路由

> 根据 process.env.VUE_APP_TARGET 值控制动态引入打包所需的子应用路由

> 查看 `src/router/index.js` 及 各子应用 `modules/module-a/router/index.js`

