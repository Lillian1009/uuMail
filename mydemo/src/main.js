import Vue from 'vue'
import App from './App'
import router from './router'
// 引入重置样式
import './assets/css/reset.css'
// 引入全局element-UI
import ElementUI from 'element-ui'
// 引入elementUIcss样式
import 'element-ui/lib/theme-chalk/index.css'
// 引入Vuex状态管理
import store from './store'
// Vue原型挂载一个服务器地址
Vue.prototype.$imgUrl = 'http://localhost:3000'

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
