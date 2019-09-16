import { noAuthAxios, authedAxios } from './configs'

// 需要授权信息的http请求
const http = {
  get(url, data) {
    return new Promise((resolve, reject) => {
      authedAxios.get(url, data).then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  },
  post(url, data) {
    return new Promise((resolve, reject) => {
      authedAxios.post(url, data).then((response) => {
        resolve(response)
      }).catch((error) => {
        reject(error)
      })
    })
  },
}

// 无需授权的http请求
const noAuthHttp = {
  get(url, data) {
    return new Promise((resolve, reject) => {
      noAuthAxios.get(url, data).then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
    })
  },
  post(url, data) {
    return new Promise((resolve, reject) => {
      noAuthAxios.post(url, data).then((response) => {
        resolve(response.data)
      }).catch((error) => {
        reject(error)
      })
    })
  },
  login(searchObj) {
    // TODO
    console.log('searchObj = ', searchObj)
    return new Promise((resolve, reject) => {
      noAuthAxios.post(``, {}).then((res) => {
        console.log('res = ', res)
        resolve()
      }).catch((err) => {
        console.log(err)
        reject({
          msg: '网络链接失败，请稍后再试',
        })
      })
    })
  },
}

export { noAuthHttp }

export default http
