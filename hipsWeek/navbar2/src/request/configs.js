import axios from 'axios'
import { noAuthHttp } from './index'
import { toast, storage, isEmpty } from '@/utils'

axios.defaults.timeout = process.env.VUE_APP_TIMEOUT

const noAuthAxios = axios.create()
const authedAxios = axios.create()
authedAxios.defaults.baseURL = process.env.VUE_APP_BASE_URL
noAuthAxios.defaults.baseURL = process.env.VUE_APP_NO_AUTH_BASE_URL

// 添加请求拦截器
authedAxios.interceptors.request.use((request) => {
    let res = checkSession()
    // 添加自定义请求头 - TODO
    const extraHeader = {}
    Object.keys(extraHeader).map((item) => {
        request.headers[item] = extraHeader[item]
    })
    if (res.code === '-1' || res.code === '0') {  // 没有token或者token失效，需要重新获取token
        console.log('未获取到token,先获取token')
        return noAuthHttp.login().then(() => {
            let token = storage.get('user-token')
            request.headers['userId'] = token.userId
            return request
        })
    } 
        let token = storage.get('user-token')
        request.headers['userId'] = token.userId
        return request
    
})

// 添加响应拦截器
authedAxios.interceptors.response.use((response) => {
    // 只将请求结果的data字段返回
    let result = response.data
    if (result.success) {
        return Promise.resolve(result)
    } 
        toast.show(result.message)
        return Promise.reject(result)
    
}, (err) => {
    // 发生网络错误后会走到这里
    if (err) {
        console.log(err)
        // utils.showAlert(err.message)
        toast.show(err.message)
        return Promise.reject(err)
    }
})

noAuthAxios.interceptors.request.use((request) => {
    // 添加自定义请求头 - TODO
    const extraHeader = {}
    Object.keys(extraHeader).map((item) => {
        request.headers[item] = extraHeader[item]
    })
    return request
})

// 添加响应拦截器
noAuthAxios.interceptors.response.use((response) => {
    // 只将请求结果的data字段返回
    let result = response.data
    if (result.success) {
        return Promise.resolve(result)
    } 
        toast.show(result.message)
        return Promise.reject(result)
    
}, (err) => {
    // 发生网络错误后会走到这里
    if (err) {
        console.log(err)
        // utils.showAlert(err.message)
        toast.show(err.message)
        return Promise.reject(err)
    }
})


/**
 * 查询当前session有效
 * resolve 0 没有登录,-1 登录失效,1 登录有效
 * */
const checkSession = () => {
    let token = storage.get('user-token')
    if (isEmpty(token)) {
        return {
            code: '0',
        }
    }
    let tokenExpireTimeRemaining = (new Date() - new Date(token.requestTime))
    if (tokenExpireTimeRemaining > (23 * 60 * 60 * 1000)) {  // token已使用时间大于23个小时后，准备开始重新获取token
        return {
            code: '-1',
        }
    } 
        return {
            code: '1',
        }
    
}

export { noAuthAxios, authedAxios, checkSession }
