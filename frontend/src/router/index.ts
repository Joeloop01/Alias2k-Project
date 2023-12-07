import { createRouter, createWebHistory } from 'vue-router'
import UsersPage from '../views/UsersPage.vue'
import UserPage from '../views/UserPage.vue'
import NewUser from '../views/NewUser.vue'
import PutUser from '../views/PutUser.vue'
import DeleteUser from '../views/DeleteUser.vue'
import HomeUser from '../views/HomeUser.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeUser
    },
    {
      path: '/users',
      name: 'users',
      component: UsersPage
    },
    {
      path: '/users/:id',
      name: 'user',
      component: UserPage
    },
    {
      path: '/users/new',
      name: 'newuser',
      component: NewUser
    },
    {
      path: '/users/:id/edit',
      name: 'putuser',
      component: PutUser
    },
    {
      path: '/users/:id/delete',
      name: 'deleteuser',
      component: DeleteUser
    }
  ]
})

export default router
