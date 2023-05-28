// 导出属于员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/setting', // 路由地址
  name: 'settings',
  component: Layout,
  //  '': 默认路由
  children: [{
    path: '', // 不写表示/employees不但有布局layout => 员工主页
    components: () => import('@/views/setting'),
    name: 'settings',
    // 路由原信息，其实就是一个存储数据的对象
    meta: {
      title: '公司设置',
      icon: 'setting'
    }
  }]
}
