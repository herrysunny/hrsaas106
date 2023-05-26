import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
import { getTimeStamp } from './auth'
// import { Date } from 'core-js/shim'
const TimeOut = 3600 // 定义超时时间:s
const service = axios.create({
  // 当执行npm run dev => .env.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 设置超时时间
})
// 请求拦截器
service.interceptors.request.use((config => {
  // config是请求的配置信息
  // 注入token
  if (store.getters.token) {
    // 只有在有token的情况下才有必要去检查时间戳是否超时
    if (IsCheckTimeOut) {
      // 如果为true,表示过期了，应该退出登录
      // token没用了 因为超时了
      store.dispatch('user/logout') // 登出操作
      // 跳转到登录页
      router.push('/login')
      return Promise.reject(new Error('token超时'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config // 必须要返回的
}, error => {
  return Promise.reject(error)
}))
// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  //   要根据success的成功与否觉得下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了，还能进then?不能，应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
//   失败
}, error => {
  // error信息里面response的对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002时，表示后端告诉我超时了，
    store.dispatch('user/logout') // 登出action
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息，reject
  }
  return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，直接进入catch
})
// 是否超时
// 超时逻辑 (当前时间-缓存中的时间)> 3600秒?
function IsCheckTimeOut() {
  var currentTime = Date.now() // 当前时间戳
  var timestamp = getTimeStamp() // 缓存时间
  return (currentTime - timestamp) / 1000 > TimeOut
}
export default service
