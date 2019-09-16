# hips-multi-module-vue-develop

## 多子应用集成于同一个项目

## 适用范围

> 单个项目包含一个或者多个子应用(请勿跨项目使用，建议一个项目clone一次)

> 整个项目使用 hips-ui 作为前端展示框架 (若需使用其他ui组件库，请认真考虑)

## 项目初始化

```
yarn install
```

## 根目录文档结构
| 目录 | 描述 |
|--|--|
| docs | 文档 |
| public | 静态资源 |
| src | 项目src |
| src/components | 共有化组件 |
| src/modules | 子应用目录 |
| src/router | 路由配置 |
| src/store | store配置 |
| src/style | 共有样式 |
| src/utils | 共有工具 |
| src/App.vue | 整体项目根实例 |
| src/main.js | 整体项目根实例 |
| src/applications.vue | 项目子应用列表(请将多子应用配置在实例的data属性中。打部署包不会带有该页面) |
| .env(.*) | 环境配置文件 |
| .postcssrc | post css 配置文件 |
| babel.config | babel配置文件 |
| vue.config | vue 及 webpack 配置文件 |

## [新建子应用](./docs/新建子应用.md)

## [环境配置](./docs/环境配置.md)

## [route设计](./docs/route设计.md)

## [store设计](./docs/store设计.md)

## [request设计](./docs/request设计.md)

## [mock使用](./docs/mock使用.md)

## 已有命令解释

```

serve   // 开启开发并使用热更新

build:module-a // 构建生产环境工作流

build   // 构建生产环境已有子应用

lint    //eslint检验

```

## 项目暂缺

> utils 目录下工具方法累积
