<script setup lang="ts">
import { put } from '@/api/users'
import type { EditUser } from '@/api/users'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { get } from '@/api/users'
import { FwbInput, FwbButton } from 'flowbite-vue'
import router from '@/router'
import { useSession } from '@/stores/token'

let id = useRoute().params.id.toString()

const session = useSession()

let editUser = ref<EditUser>({
  name: '',
  email: ''
})

get(id, session.token!.token).then((d) => (editUser.value = d))

function onClick() {
  router.push({ path: '/users' })
  put(editUser.value, id, session.token!.token)
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
