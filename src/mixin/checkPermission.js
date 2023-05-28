import store from '@/store'
// 做一个混入对象
export default {
  // 混入对象是
  methods: {
    // 检查权限 Key:要检查的点
    checkPermission(key) {
      // 去用户信息里找points中有没key
      // store.state.user.userInfo.roles.points
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.some(item => item === key)
      }
      return false
    }
  }
}
