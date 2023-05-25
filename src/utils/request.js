import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
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
  Message.error(error.message) // 提示错误信息，reject
  return Promise.reject(error) // 返回执行错误，让当前的执行链跳出成功，直接进入catch
})
export default service
