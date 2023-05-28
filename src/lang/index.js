import Vue from 'vue' // 引入Vue
import VueI18n from 'vue-i18n' // 引入国际化的包
import Cookie from 'js-cookie' // 引入cookie包
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包
import ElementJA from 'element-ui/lib/locale/lang/JA' // 引入日文
import customZH from '.zh' // 自定义语音包
import cumstomEN from './en'
Vue.use(VueI18n) // 全局注册国际化包
export default new VueI18n({
  // locale: Cookie.get('language') || 'ja', // locale:当前的多语言的类型
  locale: Cookie.get('language') || 'zh', // locale:当前的多语言的类型
  messages: { // 当前的语言包
    en: {
      ...elementEN, // 将饿了么的英文语言包引入
      ...cumstomEN
    },
    zh: {
      ...elementZH, // 将饿了么的中文语言包引入
      ...customZH
    },
    ja: {
      ...ElementJA
    }
  }
})
