import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'
import BootstrapVue from 'bootstrap-vue'
import VueWorker from 'vue-worker'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
// Vue.use(VueNativeSock, 'ws://localhost:9300', {
//   format: 'json',
//   reconnection: true, // (Boolean) whether to reconnect automatically (false)
//   reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
//   reconnectionDelay: 3000, // (Number) how long to initially wait before attempting a new (1000)
//   store: store
// })
Vue.use(BootstrapVue)
Vue.use(VueWorker)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
