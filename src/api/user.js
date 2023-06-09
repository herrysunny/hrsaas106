import request from '@/utils/request'
/*
* 登录接口封装
*/
export function login(data) {
  // 返回一个axios对象 => promise  // 返回了一个promise对象
  return request({
    url: '/sys/login', // 因为所有的接口都要跨域 表示所有的接口要带 /api
    method: 'post',
    data // post请求参数
  })
}
/*
 * 获取用户资料接口
 */
export function getUserInfo(token) {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export function logout() {

}

/**
 *  根据用户id获取用户的详情
 *
 * **/
export function getUserDetailId() {
  return request({
    url: `/sys/role/{id}`
    // method: 'get' //默认类型为get
  })
}
