<script setup lang="ts">
import { type Login } from '@/api/auth'
import { signIn } from '@/plugins/session'
import router from '@/router'
import { FwbHeading, FwbButton, FwbInput } from 'flowbite-vue'
import { ref } from 'vue'

let login = ref<Login>({
  email: '',
  password: ''
})

async function onClick() {
  await signIn(login.value)
  router.push({ path: '/' })
}
</script>

<template>
  <fwb-heading tag="h1" class="flex justify-center my-12 font-thin text-green-400">
    Login
  </fwb-heading>
  <div class="flex flex-col items-stretch max-w-md gap-4 mx-auto">
    <fwb-input v-model="login.email" placeholder="Enter your email"> </fwb-input>
    <fwb-input type="password" v-model="login.password" placeholder="Enter your password">
    </fwb-input>
  </div>
  <div class="flex justify-center gap-5 my-10">
    <fwb-button color="green" @click="onClick"> Confirm </fwb-button>
    <fwb-button color="green" href="/users/new"> Create new user </fwb-button>
  </div>
</template>
