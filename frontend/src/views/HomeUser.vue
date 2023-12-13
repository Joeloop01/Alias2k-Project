<script setup lang="ts">
import { signin, type Login } from '@/api/auth'
import { signIn } from '@/plugins/session'
import router from '@/router'
import { useSession } from '@/stores/token'
import dayjs from 'dayjs'
import { FwbHeading, FwbButton, FwbInput } from 'flowbite-vue'
import { ref } from 'vue'

let login = ref<Login>({
  email: '',
  password: ''
})

const userPath = window.location.href + 'users/'
localStorage.removeItem('token')

async function onClick() {
  await signIn(login.value)
  router.push({ path: '/users' })
}
</script>

<template>
  <fwb-heading tag="h1" class="flex justify-center my-12 font-thin text-green-400">
    Welcome to project Joe
  </fwb-heading>
  <div class="flex flex-col items-stretch max-w-md gap-4 mx-auto">
    <fwb-input v-model="login.email" placeholder="Enter your email"> </fwb-input>
    <fwb-input type="password" v-model="login.password" placeholder="Enter your password">
    </fwb-input>
  </div>
  <div class="flex justify-center gap-5 my-10">
    <fwb-button color="green" @click="onClick"> Log in </fwb-button>
    <fwb-button color="green" :href="`${userPath}` + `new`"> Create new user </fwb-button>
  </div>
</template>
