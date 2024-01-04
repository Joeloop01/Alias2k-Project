<script setup lang="ts">
import type { EditUser } from '@/api/users'
import { useRoute } from 'vue-router'
import { get } from '@/api/users'
import { useSession } from '@/stores/token'
import EditUserComponent from '@/components/EditUserComponent.vue'
import { ref } from 'vue'

const id = useRoute().params.id.toString()

let editUser = ref<EditUser>({
  name: '',
  email: ''
})

get(id, useSession().token!.token).then((d) => (editUser.value = d))
</script>

<template>
  <EditUserComponent v-if="editUser.email != ''" :id="id" :editUser="editUser" />
</template>
