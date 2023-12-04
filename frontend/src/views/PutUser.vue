<script setup lang="ts">
import { put } from '@/api/users'
import type { EditUser } from '@/api/users'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { get } from '@/api/users'
import { FwbInput, FwbButton } from 'flowbite-vue'
import router from '@/router'

let id = useRoute().params.id.toString()

let editUser = ref<EditUser>({
  name: '',
  email: ''
})

get(id).then((d) => (editUser.value = d))

function onClick() {
  router.push({ path: '/users' })
  put(editUser.value, id)
}
</script>

<template>
  <br />
  <fwb-input v-model="editUser.name" label="Enter your name" />
  <br />
  <fwb-input v-model="editUser.email" label="Enter your email" />
  <br />
  <fwb-button @click="onClick" color="green">submit</fwb-button>
</template>
