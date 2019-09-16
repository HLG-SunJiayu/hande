import Vue from 'vue'
import FastClick from 'fastclick'

import App from './App.vue'
import store from './store'
import router from './router'

import 'x-photoswipe/dist/photoswipe.css'
import 'x-photoswipe/dist/default-skin/default-skin.css'
import './style/reset.css'
import './style/normalize.css'
import './style/normalize.css'

import { Toast, Indicator, Dialog } from 'hips'

if (process.env.VUE_APP_MOCK === 'yes') {
    require('../mocks')
}

if (process.env.VUE_APP_BUILD === 'dev') {
    const VConsole = require('vconsole')
    new VConsole() // eslint-disable-line
}

Vue.use(Toast).use(Indicator).use(Dialog)

Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app')

FastClick.attach(document.body)
