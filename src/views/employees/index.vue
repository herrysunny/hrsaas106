<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示记录条数 -->
        <span slot="before">共{{ page.total }}条记录</span>
        <!-- 右侧显示按钮 excel导入 excel导出 新增员工 -->
        <template slot="after">
          <el-button size="small" type="success" @click="$router.push('/import')">excel导入</el-button>
          <el-button size="small" type="danger" @click="exportData">excel导出</el-button>
          <el-button :disabled="!checkPermission('POINT-USER-ADD')" type="primary" size="small" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 表格组件 -->
      <el-card v-loading="loading" :data="list">
        <!-- 表格中如何显示序号 -->
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" align="center" sortable="">
            <!-- 插槽 -->
            <template v-slot="{row}">
              <img
                v-imagerror="reueire('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable :formatter="formOfEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" align="center">
            <!-- 作用域插槽 将时间进行格式化-->
            <template slot-scope="{row}">{{ row.timeOfEntry | formatDate }} </template>
          </el-table-column>
          <el-table-column label="账户状态" align="center" sortable="" prop="enableState">
            <!--  -->
            <template slot-scope="{row}">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState===1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template slot="{row}">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/$(row.id)`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- 放置组件弹层 -->
    <!-- sync修饰符：是子组件 去改吧父组件的数据的一个语法糖 -->
    <add-employee :show-dialog.sync="showDialog" />
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
    >
      <el-row :type="flex" :justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 放置分配组件 .sync:子组件可以更新父组件的值-->
    <assign-role :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入员工枚举对象
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './coomponent/assign-role'

export default {
  components: {
    AddEmployee
  },
  data() {
    AssignRole
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      loading: false, // 显示遮罩层
      showDialog: false, // 默认是关闭的弹层
      showCodeDialog: false, // 显示二维码弹层
      showRoleDialog: false, // 显示分配角色的弹层
      userId: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    formatEmployment(row, column, cellValue, index) {
      // 要去找1所对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工？')
        await this.deleteEmployee(id)
        this.$message.success('删除员工成功')
        this.getEmployeeList() // 重新拉取数据
      } catch (error) {
        console.log(error)
      }
    },
    exportData() {
      // 表头中英文对应关系
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // 导出excel
      import('@/vender/Export2Excel').then(async excel => {
        // excel是引入文件的导出对象
        // 导出表头header 从哪里来？
        // data从哪里来？
        // 获取员工的接口 页码 每页条数
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows) // 返回的data就是要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merge = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: data,
          filename: '员工资料表',
          multiHeader, // 复杂表头
          merge // 合并选项
        })
        // 要求转出的标题是中文
      })
    },
    // 将表头数据和数据进行对应
    // [[]]
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是一个对象 {mobile:1321111,user:''}
        // ["手机号","姓名","入职日期",...]
        return Object.keys(headers).map(key => {
          // 需要判断 字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            debugger
            const obj = EmployeeEnum.hireType.find(obj => obj.id === obj[headers[key]])
            return obj || '未知'
          }

          return item[headers[key]]
        })
      })
      // return rows.map(item => Object.keys(headers).map(key => item[headers[key]]))
      // 需要处理时间格式问题
    },
    showQrCode(url) {
      // url存在的情况才弹出层
      if (url) {
        this.showCodeDialog = true
        // 可以等到上次数据更新完毕 页面渲染完毕之后
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    editRole(id) {
      // 弹出层
      this.userId = id
      this.showRoleDialog = true
    }
  }
}
</script>

<style>

</style>
