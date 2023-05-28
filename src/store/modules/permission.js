// 专门处理权限路由表的权限
import { constantRoutes, asyncRoutes } from '@/router'

const state = {
  routes: constantRoutes // 路由表 表示当前用户所拥有的所有路由的数组
}
const mutations = {
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, newRoutes]
  }
}
const actions = {
  filterRoutes(context, menus) {
    const routes = []
    menus.array.forEach(key => {
      //  asyncRoutes object.name===key
      // item指对象
      routes.push(...asyncRoutes.filter(item => item.name === key))
      context.commit('setRoutes', routes)
      return routes
    })
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions

}
