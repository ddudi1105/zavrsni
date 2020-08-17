import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from './firebase'
import vuetify from '@/plugins/vuetify'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import axios from 'axios'
import { store } from './store/store'

Vue.use(Buefy)

Vue.config.productionTip = false
Vue.config.silent = true

axios.defaults.baseURL = 'https://cors-anywhere.herokuapp.com/https://api.trackingmore.com/v2';
axios.defaults.headers.common['Trackingmore-Api-Key'] = 'e3c4a060-5e16-48c0-8d2c-37a1e3782b22'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/json'

export const eventBus = new Vue();

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !firebase.auth().currentUser) {
    next('/signup')
  } else {
    next()
  }
})

let app
firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    app = new Vue({
      router,
      vuetify,
      store,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {
    store.dispatch('updateUser', user)
  }
})