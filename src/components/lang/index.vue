<template>
  <!-- 点击菜单项事件 -->
  <el-dropdown @command="changeLanguage">
    <!-- 显示一个图标 -->
    <svg-icon icon-class="language">
      <!-- 这里必须加一个div -->
      <div>
        <svg-icon style="color:#fff;font-size:20px" icon-class="language" />
      </div>
      <!-- 下拉图标 -->
      <el-dropdown-menu slot="dropdown">
        <del-dropdown-item :disabled="this.$i18n.locale==='zh'" command="zh">中文</del-dropdown-item>
        <del-dropdown-item :disabled="this.$i18n.locale==='cn'" command="cn">en</del-dropdown-item>
      </el-dropdown-menu>

    </svg-icon>
  </el-dropdown>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  methods: {
    changeLanguage(type) {
      // 设置类型 显写入到cookie key:'language'
      Cookie.set('language', type) //
      // 改变当前的多语言
      this.$i18n.locale = type // 将当前的多语言类型改成对应的类型
      this.$message.success('切换多语言成功')
    }
  }

}
</script>

<style>

</style>
