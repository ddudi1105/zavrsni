import Home from '@/views/Home'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  }, 
  {
    path: '/signup',
    name: 'Signup',
    component: () => import ( '../views/Signup.vue')
  },
  {
    path: '/account',
    component: () => import ( '../views/Account.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        component: () => import ( '../views/Profile.vue'),
        name: 'Profile'
      },
      {
        path: 'trackings',
        component: () => import ( '../views/Trackings.vue'),
        name: 'Trackings'
      }
    ]
  },
]

export default routes
