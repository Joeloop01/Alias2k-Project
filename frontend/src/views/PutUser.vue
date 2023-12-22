<script setup lang="ts">
import { put } from '@/api/users'
import type { EditUser } from '@/api/users'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { get } from '@/api/users'
import { FwbInput, FwbButton, FwbHeading } from 'flowbite-vue'
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
  <fwb-heading tag="h2" class="flex justify-center mt-10 mb-6 font-light text-green-400">
    Edit User
  </fwb-heading>
  <div class="flex flex-col items-stretch max-w-md gap-4 mx-auto">
    <fwb-input v-model="editUser.name" label="Update your name" />
    <fwb-input v-model="editUser.email" label="Update your email" />
  </div>
  <div class="flex justify-center my-10">
    <fwb-button @click="onClick" color="green">submit</fwb-button>
  </div>
</template>
