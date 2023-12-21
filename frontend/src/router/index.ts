import { createRouter, createWebHistory } from 'vue-router'
import UsersPage from '../views/UsersPage.vue'
import UserPage from '../views/UserPage.vue'
import NewUser from '../views/NewUser.vue'
import PutUser from '../views/PutUser.vue'
import DeleteUser from '../views/DeleteUser.vue'
import LoginUser from '../views/LoginUser.vue'
import HomeUser from '../views/HomeUser.vue'
import { useSession } from '@/stores/token'
import { get_session_token } from '@/plugins/session'
import { user_info } from '@/api/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeUser,
      beforeEnter: [check_token]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginUser, 
      beforeEnter: [check_isLogged]
    },
    {
      path: '/users',
      name: 'users',
      component: UsersPage,
      beforeEnter: [check_session]
    },
    {
      path: '/users/:id',
      name: 'user',
      component: UserPage,
      beforeEnter: [check_session, check_user]
    },
    {
      path: '/users/new',
      name: 'newuser',
      component: NewUser
    },
    {
      path: '/users/:id/edit',
      name: 'putuser',
      component: PutUser,
      beforeEnter: [check_session, check_user]
    },
    {
      path: '/users/:id/delete',
      name: 'deleteuser',
      component: DeleteUser
    }
  ]
})

export default router


async function check_session(){
  useSession().token = await get_session_token() 
  if (useSession().token != null) return
  router.push({path:"/login"})
}

async function check_isLogged(){
  useSession().token = await get_session_token() 
  if (useSession().token == null) return
  router.push({ path: '/'})
}

async function check_user(to: any){
  useSession().token = await get_session_token() 
  if (useSession().token == null) return
  const user =  await user_info(useSession().token!.token)
  if(user.id == to.params.id) return
  router.push({ path: '/'})
}

async function check_token(){
  useSession().token = await get_session_token() 
}