import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from 'components/login/LoginPage'
import HomePage from 'components/home/HomePage'
import WelcomePage from 'components/home/child/WelcomePage'
import UserPage from 'views/user/UserPage'
import RolePage from 'views/rights/roles/RolePage'
import RightPage from 'views/rights/rightList/RightPage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
    component: LoginPage
  },
  {
    name: 'Login',
    path: '/login',
    component: LoginPage
  },
  {
    name: 'HomePage',
    path: '/home',
    component: HomePage,
    children: [
      {
        path: '/home',
        redirect: '/welcome',
        component: WelcomePage
      },
      {
        name: 'welcome',
        path: '/welcome',
        component: WelcomePage
      },
      {
        name: 'user',
        path: '/users',
        component: UserPage
      },
      {
        name: 'role',
        path: '/roles',
        component: RolePage
      },
      {
        name: 'right',
        path: '/rights',
        component: RightPage
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
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
