<template>
  <el-dialog title="新增员工" :visible="showDialog">
    <!-- 表单 -->
    <el-form :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <!-- 遍历只能遍历组件的数据 -->
          <el-option v-for="item in EmployeeEnum.hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-model="formData.departmentName" style="width:50%" placeholder="请选择部门" />
        <!-- 放置一个tree组件 -->
        <el-tree
          v-if="showTree"
          v-loading="loading"
          :data="treeData"
          default-expand-all=""
          :props="{label:'name'}"
          @node-click="selectNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择日期" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small">取消</el-button>
          <el-button type="primary" size="small">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { getDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表单数据
      treeData: [], // 定义数组接收树形数据
      showTree: false, // 控制树形的显示或者隐藏
      loading: false // 控制树的显示或者隐藏进度条
    }
  },
  methods: {
    async getDepartments() {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      // depts是数组 但不是树形
      this.treeData = transListToTreeData(depts, '')
      this.loading = false
    },
    selectNode(node) {
      this.formData.departmentName = node.departmentName
      this.showTree = false
    },
    async btnOK() {
      try {
        await this.$refs.addEmployee.validate()
        // 调用新增接口
        await addEmployee(this.formData) // 新增员工
        // 告诉父组件更新数据
        this.$parent.getEmployeeList()
        this.$parent.showDialog = false
      } catch (error) {
        console.log(error)
      }
    },
    btnCancel() {
      // 重置原来的数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields() // 重置校验结果
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

<style>

</style>
