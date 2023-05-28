// 负责管理所有的自定义指令

export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // options:指令中变量的解释 其中有一个属性叫做value
    // dom表示当前指令的作用位置(dom对象，此处为图片)
    dom.src = dom.src || options.value // 初始化时 如果有值则赋值，没值则进行默认值赋值
    // 当图片由地址但是没有加载成功时会报错，会触发图片的一个事件 ——》onerror
    dom.onerror = function() {
      // dom可以注册error事件
      dom.src = options.value // 不能写死,value:当图片出现异常时 会将指令配置的图片设置为该图片的内容
    }
  },
  // 该钩子函数会在当前hi指令作用的组件 更新数据完毕之后 执行
  componentUpdated(dom, options) {
    // 组件初始化 一旦更新就会再进入 inserted函数 会进去componentUpdated
    dom.src = dom.src || options.value
  }
}

// <img v-imagerror="默认图片变量"/>
