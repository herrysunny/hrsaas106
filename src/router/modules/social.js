// 导出属于员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/social', // 路由地址
  name: 'social',
  component: Layout,
  //  '': 默认路由
  children: [{
    path: '', // 不写表示/employees不但有布局layout => 员工主页
    components: () => import('@/views/social'),
    // 路由原信息，其实就是一个存储数据的对象
    meta: {
      title: '社保',
      icon: 'table'
    }
  }]
}
