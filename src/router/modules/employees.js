// 导出属于员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/employees', // 路由地址
  name: 'employees',
  component: Layout,
  //  '': 默认路由
  children: [{
    path: '', // 不写表示/employees不但有布局layout => 员工主页
    components: () => import('@/views/employees'),
    name: 'employees',
    // 路由原信息，其实就是一个存储数据的对象
    meta: {
      title: '员工管理',
      icon: 'people'
    }
  },
  {
    path: 'detail/:id?', // query传参 动态路由参数
    component: () => import('@/views/employees/detail'),
    hidden: true, // 表示该内容不在左侧菜单显示
    meta: {
      title: '员工详情'
    }
  },
  {
    path: 'print/:id?',
    component: () => import('@/views/employees/print'),
    hidden: true,
    meta: {
      title: '员工打印'
    }
  }
  ]
}

// import Layout from '@/layout'
// //  {  path: '', component: '' }
// // 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
// export default {
//   path: '/employees', // 路径
//   name: 'employees', // 给路由规则加一个name
//   component: Layout, // 组件
//   // 配置二级路的路由表
//   children: [{
//     path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
//     component: () => import('@/views/employees'),
//     // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
//     meta: {
//       title: '员工管理' // meta属性的里面的属性 随意定义 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
//     }
//   }]
// }

// // 当你的访问地址 是 /employees的时候 layout组件会显示 此时 你的二级路由的默认组件  也会显示
