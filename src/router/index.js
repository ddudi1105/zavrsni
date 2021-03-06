import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes.js'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if(to.hash) {
      return {
        selector: to.hash,
        offset: { x:0, y: 90}
      }
    } else if(savedPosition) {
      return savedPosition;
    }

    return {x: 0, y: 0};
  }
})
