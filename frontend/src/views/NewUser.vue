<script setup lang="ts">
import { post } from '@/api/users'
import type { NewUser } from '@/api/users'
import { ref } from 'vue'
import { FwbInput, FwbButton } from 'flowbite-vue'
import router from '@/router'

let data = ref<NewUser>({
  name: '',
  email: '',
  password: ''
})

function onClick() {
  post(data.value)
  router.push({ path: '/users' })
}
</script>

<template>
  <br />
  <fwb-input v-model="data.name" label="Enter your name" />
  <br />
  <fwb-input v-model="data.email" label="Enter your email" />
  <br />
  <fwb-input v-model="data.password" label="Enter your password" />
  <br />
  <fwb-button color="green" @click="onClick">submit</fwb-button>
</template>
