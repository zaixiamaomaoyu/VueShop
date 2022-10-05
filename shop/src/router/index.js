import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from 'components/login/LoginPage'
import HomePage from 'components/home/HomePage'

Vue.use(VueRouter)

const routes = [
  {
    name: 'Login',
    path: '/login',
    component: LoginPage
  },
  {
    name: 'HomePage',
    path: '/home',
    component: HomePage
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.path === '/login') {
    return next()
  }
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) {
    return next('/login')
  }
  next()
})

export default router
