<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async  success({ header, results }) {
      // header results中的数据是中文
      // 新增员工的属性是一致的
      //   username: '姓名',
      //   mobile: '手机号',
      //   formOfEmployment: '',
      //   workNumber: '工号',
      //   departmentName: '',
      //   timeOfEntry: '入职日期',
      //   correctionTime: '转正日期'
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // var arr=[]
      // results.forEach(item => {
      //   var userInfo = {}
      //   Object.keys(item).forEach(key => {
      //     // 现在Key是中文
      //     userInfo[userRelations[key]] = item[key]
      //     arr.push(userInfo)
      //   })
      // })
      var newArr = results.map(item => {
        var userInfo = []
        Object.keys(item).forEach(key => {
          //     userInfo[userRelations[key]] = item[key]
          if (userInfo[userRelations[key]] === 'timeOfEntry' || userInfo[userRelations[key]] === 'correctionTime') {
            // 后端接口 限制了不能是字符串 要求转化时间类型
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/'))
          } else {
            userInfo[userRelations[key]] = item[key] // 将原理中文对应的值 赋值给原来英文对应的值
          }
        })
        return userInfo
      })
      await importEmployee(newArr) // 接收一个数组
      this.$message.success('导入excel成功')
      this.$router.back() // 回到上一个页面
    },
    // 转化excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }

}
</script>

<style>

</style>
