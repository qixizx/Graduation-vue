import Vue from 'vue'
import App from './App.vue'
import Storage from 'vue-ls'
import router from './router'
import store from './store/'

import { VueAxios,axios } from "@/utils/request"

import Antd from 'ant-design-vue'
import Viser from 'viser-vue'
import 'ant-design-vue/dist/antd.less';  // or 'ant-design-vue/dist/antd.less'

import '@/permission' // permission control
import '@/utils/filter' // base filter
import Print from 'vue-print-nb-jeecg'
/*import '@babel/polyfill'*/
import VueApexCharts from 'vue-apexcharts'

import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

import {
  ACCESS_TOKEN,
  DEFAULT_COLOR,
  DEFAULT_THEME,
  DEFAULT_LAYOUT_MODE,
  DEFAULT_COLOR_WEAK,
  SIDEBAR_TYPE,
  DEFAULT_FIXED_HEADER,
  DEFAULT_FIXED_HEADER_HIDDEN,
  DEFAULT_FIXED_SIDEMENU,
  DEFAULT_CONTENT_WIDTH_TYPE,
  DEFAULT_MULTI_PAGE
} from "@/store/mutation-types"
import config from '@/defaultSettings'

import JDictSelectTag from './components/dict/index.js'
import hasPermission from '@/utils/hasPermission'
import vueBus from '@/utils/vueBus';
import JeecgComponents from '@/components/jeecg/index'
import VueI18n from 'vue-i18n'
// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
import braintree from 'vue-braintree'
Vue.use(braintree)
//mian.js中：谷歌地图

import VueMapkit from 'vue-mapkit'
Vue.use(VueMapkit, {
  authorizationCallback(done) {
    // provide mapkit jwt here
    // fetch('/brainTreeToken/clientToken',{method: 'get'})
    //   .then(response => response.json())
    //   .then(res => {
    //     console.log(res)
    //     done(res.result)
    //   })

    axios({
      url: '/brainTreeToken/clientToken',
      method:'get' ,
      data: ''
    }).then(function(res){
      done(res.result)
    }).catch(function (error) {
      console.log(error);
    });

    // done("eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkhXNzYyUTlEVzUifQ.eyJpc3MiOiJNNlNVNFU5NjNCIiwiaWF0IjoxNTc3NzU3Nzg3LCJleHAiOjE1ODAxNjk2MDB9.lKuhFmwYl59Jo82Zj7QIodY6NBh_ceCM6BRS_JP-GFugO4RMWT8MSakJR-LThiRpTJA7R6wK9U9YlHDRjG3Zgg")
  },
  language: 'es',
})

Vue.config.productionTip = false
Vue.use(Storage, config.storageOptions)
Vue.use(Antd)
Vue.use(VueAxios, router)
Vue.use(Viser)
Vue.use(hasPermission)
Vue.use(JDictSelectTag)
Vue.use(Print)
Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)
Vue.use(preview)
Vue.use(vueBus);
Vue.use(JeecgComponents);
/*国际化*/
Vue.use(VueI18n)

// 注册i18n实例并引入语言文件，文件格式等下解析
const i18n = new VueI18n({
  locale: Vue.ls.get("language", "zh-CN'"),
  messages: {
    'zh-CN': require('@/components/lang/zh-CN.js'),
    'en-US': require('@/components/lang/en-US.js')
  }
})
new Vue({
  router,
  store,
  i18n,
  mounted () {
    store.commit('SET_SIDEBAR_TYPE', Vue.ls.get(SIDEBAR_TYPE, true))
    store.commit('TOGGLE_THEME', Vue.ls.get(DEFAULT_THEME, config.navTheme))
    store.commit('TOGGLE_LAYOUT_MODE', Vue.ls.get(DEFAULT_LAYOUT_MODE, config.layout))
    store.commit('TOGGLE_FIXED_HEADER', Vue.ls.get(DEFAULT_FIXED_HEADER, config.fixedHeader))
    store.commit('TOGGLE_FIXED_SIDERBAR', Vue.ls.get(DEFAULT_FIXED_SIDEMENU, config.fixSiderbar))
    store.commit('TOGGLE_CONTENT_WIDTH', Vue.ls.get(DEFAULT_CONTENT_WIDTH_TYPE, config.contentWidth))
    store.commit('TOGGLE_FIXED_HEADER_HIDDEN', Vue.ls.get(DEFAULT_FIXED_HEADER_HIDDEN, config.autoHideHeader))
    store.commit('TOGGLE_WEAK', Vue.ls.get(DEFAULT_COLOR_WEAK, config.colorWeak))
    store.commit('TOGGLE_COLOR', Vue.ls.get(DEFAULT_COLOR, config.primaryColor))
    store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
    store.commit('SET_MULTI_PAGE',Vue.ls.get(DEFAULT_MULTI_PAGE,true))
  },
  render: h => h(App)
}).$mount('#app')
