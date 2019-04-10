// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
//import App from './App'
import master from "./components/layouts/master"
import {store} from './store/store'
window.eventBus = new Vue()
Vue.config.productionTip = false
Vue.use(VueRouter)

const router = new VueRouter({
   routes
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router:router,
  store:store,
  components: { master},
  template: '<master/>'
})
