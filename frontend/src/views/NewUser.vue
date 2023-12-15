<script setup lang="ts">
import { post } from '@/api/users'
import type { NewUser } from '@/api/users'
import { ref } from 'vue'
import { FwbInput, FwbButton, FwbHeading } from 'flowbite-vue'
import router from '@/router'

let data = ref<NewUser>({
  name: '',
  email: '',
  password: ''
})

function onClick() {
  post(data.value)
  router.push({ path: '/' })
}
</script>

<template>
  <fwb-heading tag="h1" class="flex justify-center my-10 font-light text-green-400">
    New User
  </fwb-heading>
  <div class="flex flex-col items-stretch max-w-md gap-4 mx-auto">
    <fwb-input v-model="data.name" placeholder="Enter your name" />
    <fwb-input v-model="data.email" placeholder="Enter your email" />
    <fwb-input v-model="data.password" placeholder="Enter your password" />
  </div>
  <div class="flex justify-center my-10">
    <fwb-button color="green" @click="onClick">submit</fwb-button>
  </div>
</template>
