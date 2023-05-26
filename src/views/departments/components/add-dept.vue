<template>
  <!-- 放置弹层组件 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单数据 label-width设置标题的宽度 -->
    <el-form :model="FormData" rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="FormData.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="FormData.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <!-- native 可以找到原生元素的事件 -->
        <el-select v-model="FormData.manager" style="width:80%" placeholder="请选择" @focus="getEmployeeSimple" />
        <!-- 遍历选项 -->
        <el-option
          v-for="item in peoples"
          :key="item.id"
          :label="item.username"
          :value="item.username"
        />

      </el-form-item>
      <el-form-item label="部门名称" prop="introduce">
        <el-input v-model="introduce" style="width:80%" placeholder="1-300个字符" type="textarea" rows="3" />
      </el-form-item>
    </el-form>
    <!-- 确定和消息 -->
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="btnCancel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { addDepartments, getDepartments, getDepartmentDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      // value是部门名称 要去和同级部门下的部门去比较，有相同的不能过/不相同就能过
      const { depts } = await getDepartments()
      // 去找统计部门下 有没有和value相同的部门
      // 找到所有的子部门
      let isRepeat = false
      if (this.FormData.id) {
        // 有id就是编辑模式
        // 编辑的数据 在数据库里有！！！我的名字不能和其他的统计部门的名字进行重复
        // 首先找到我的同级部门 this.FormData.id就是我的id,this.FormData.pid
        // depts.filter(item => item.pid === this.FormData.pid)
        // 找到了同级部门数据
        depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      } else {
        // 没id就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`同级部门下已经存在${value}这个部门了`)) : callback()
    }
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      // 要求编码 和所有的部门编码都不能重复 由于历史数据有可能 value不为空
      let isRepeat = false
      if (this.FormData.id) {
        // 编辑模式
        isRepeat = depts.filter(item => item.id !== this.treeNode.id).some(item => item.code === value && value)
      } else {
        // 新增模式下
        isRepeat = depts.some(item => item.code === value && value)
      }
      isRepeat ? callback(new Error(`同级部门下已经存在${value}这个部门了`)) : callback()
    }
    return {
      FormData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门名称长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur',
            validator: checkNameRepeat
          }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门编码长度为1-50个字符', trigger: 'blur' },
          { trigger: 'blur',
            validator: checkCodeRepeat
          }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 50, message: '部门介绍要求1-50个字符', trigger: 'blur' }]
      },
      peoples: []// 校验规则，Key:value
    }
  },
  computed: {
    showTitle() {
      return this.FormData.id ? '编辑部门' : '新增子部门'
    }
  },
  methods: {
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    // 获取详情方法
    async getDepartDetail(id) {
      this.FormData = await this.getDepartDetail(id)
      //  因为我们是父组件调用子组件方法 先设置了node数据 直接调用方法
      // props传值是异步的
    },
    btnOK() {
      // 手动校验表单
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.FormData.id) {
            // 编辑
            await updateDepartments(this.FormData)
          } else {
            // 这里将ID设成了我的pid
            await addDepartments({ ...this.FormData, pid: this.treeNode.id })
          }
          // 表单校验通过了

          // 告诉父组件
          this.$emit('addDepts') // 触发一个自定义事件
          // 此时应该去修改showDialog
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCancel() {
      // el-from中的resetField不能重置表单种的id
      this.FormData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 关闭弹层
      this.$emit('update:showDialog', false)
      // 清除之前的校验
      this.$refs.deptForm.resetFields()
    }
  }

}
</script>
