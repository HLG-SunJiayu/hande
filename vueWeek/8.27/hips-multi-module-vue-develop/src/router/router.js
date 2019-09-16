import Router from 'vue-router'

/**
 * 页面前进
 * */
Router.prototype.pushPage = function (param) {
    this.currentRoute.meta.pageInit = true
    this.currentRoute.meta.routerTransition = 'router-slide-left'
    this.push(param)
}

/**
 * 页面返回
 * @param nextReload 返回的页面是否需要刷新，默认false
 * @param pages 需要返回的页面数量(正数)
 * */
Router.prototype.backPage = function (nextReload = false, pages = 1) {
    this.currentRoute.meta.pageInit = nextReload
    this.currentRoute.meta.routerTransition = 'router-slide-right'
    this.go(0 - pages)
    // let firstRoute = this.options.routes[0]
    // let currentRoute = this.currentRoute
    //
    // if (firstRoute.name === currentRoute.name) {
    //     let _cordova = window.cordova || cordova
    //     if (_cordova) {
    //         _cordova.exec(null, null, 'BridgePlugin', 'closeWebView', [])
    //     } else {
    //         console.log('cordova is not defined')
    //     }
    // } else {
    //     this.go(0 - pages)
    // }
}

/**
 * 页面替换
 * */
Router.prototype.replacePage = function (param) {
    this.currentRoute.meta.pageInit = true
    this.currentRoute.meta.routerTransition = 'router-slide-left'
    this.replace(param)
}


export default Router
