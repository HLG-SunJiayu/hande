import Vue from 'vue'
import Router from './router'

let routes = []
if (process.env.VUE_APP_BUILD === 'dev') {
    const mainRoute = {
        path: '/applications',
        name: 'applications',
        component: require('../applications').default,
    }
    routes.push(mainRoute)
    routes.push(
        ...require('@/modules/module-a/router').default,
    )
} else {
    routes.push(...require(`@/modules/${process.env.VUE_APP_TARGET}/router`).default)
}

routes.unshift({
    path: '*',
    redirect: routes[0].path,
})

Vue.use(Router)

export default new Router({
    routes,
})
