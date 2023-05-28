<template>
  <div>
    <!-- action="#" 就不会报错 -->
    <!-- fileList:上传文件的列表，包括图片和地址，可以绑定到上传组件上 来显示 -->
    <!--  -->
    <el-upload
      list-type="picture-card"
      :limit="1"
      action="#"
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{disabled:fileComputed}"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-progress v-if="showPercent" style="width:180px" :percentage="percent" />
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width:100%" alt="">
    </el-dialog>
  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5' // 引入腾讯云cos包
// 需要实例化 上传自己的腾讯云秘钥和Key
const cos = new COS({
  SecretId: 'AKID0mqfEWqlUzIbeSkGRL6c7ML6c0B93To9', // 身份识别
  SecretKey: 'JFwNZdeRF2iOp03FFsGNDm44vWFitmNF' //
}) // 实例化的包 已经具有了上传的能力 可以上传到该账号里面的存储桶了
export default {
  data() {
    return {
      fileList: [],
      showDialog: false,
      imgUrl: '',
      currentFileUid: null, // 记录当前正在上传的uid
      percent: 0, // 当前的百分比
      showPercent: false
    }
  },
  computed: {
    // 如果它为true,表示就不应该显示+号上传了
    fileComputed() {
      return this.fileList.length === 1
    }
  },
  methods: {
    // 点击预览事件
    preview(file) {
      console.log(file.url)
      this.imgUrl = file.url
      this.showDialog = true
    },
    // file:要删除的文件
    // fileList:删过之后的文件
    handleRemove(file, fileList) {
    //   console.log(file)
    //   console.log(fileList)
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    //   this.fileList = fileList
    },
    // 不能用push 这个钩子会执行多次
    changeFile(file, fileList) {
      // file:当前文件 fileList:当前最新的数组 this.file
      this.fileList = fileList.map(item => item)
    //   上传成功，数据才能进来 =》腾讯云cos
    },
    beforeUpload(file) {
      // 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.some(item => item === file.type)) {
        // 如果不存在
        if (!types.includes(file.type)) {
          this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
          return false
        }
        //  检查大小
        const maxSize = 5 * 1024 * 1024
        if (maxSize < file.size) {
          this.$message.error('图片大小最大不能超过5M')
          return false
        }
        // 已经确定当前上传的就是当前的这个file了
        this.currentFileUid = file.uid
        this.showPercent = true
        return true // 最后一定要return true
      }
    },
    // 覆盖默认的上传行为，可以自定义上传的实现
    // params.file
    upload(params) {
    //   console.log(params.file)
      if (params.file) {
        // 执行上传操作
        cos.putObject({
          // 上传到腾讯云
          Bucket: 'examplebucket-1250000000', /* 填入您自己的存储桶，必须字段 */
          Region: 'ap-shagnhai', /* 存储桶所在地域,例如ap-beijing,必须字段 */
          Key: params.file.name, /* 文件名，存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          Body: params.file, // 要上传的文件对象
          StorageClass: 'STANDARD', // 上传的模式类型 直接默认标准模式即可
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
        // data返回数据后如何处理
        //   console.log(err || data)
          //   data中有status===200 说明上传成功
          if (!err && data.statusCode === 200) {
            // 此时说明文件上传成功 哟啊获取成功的返回地址
            // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成现在成功的地址
            // fileList是一个数组
            // 需要知道上传成功的是哪一张图片
            this.fileList = this.fileList.map(item => {
              if (item.id === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
                // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
              }
              return item
            })
            // 关闭进度条
            // 重置百分比
            setTimeout(() => {
              this.showPercent = false
              this.percent = 0
            }, 1000)
            // 将上传成功的地址 回显到了List
          }
        })
      }
    }
  }

}
</script>

<style>
.disabled.el-upload-pciture-card{
    display: none;
}
</style>
