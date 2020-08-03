import Vue from 'vue'
import App from './App'
import router from './router'
import vuetify from '@/plugins/vuetify'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import axios from 'axios'

Vue.use(Buefy)

Vue.config.productionTip = false

axios.defaults.baseURL = 'https://cors-anywhere.herokuapp.com/https://api.trackingmore.com/v2';
axios.defaults.headers.common['Trackingmore-Api-Key'] = 'a94dee19-93c7-4995-ba58-ff333272aa5d'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Content-Type'] = 'application/json'

export const eventBus = new Vue();

new Vue({
  el: '#app',
  router,
  vuetify,
  components: { App },
  template: '<App/>'
})
