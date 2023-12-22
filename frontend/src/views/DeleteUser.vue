<script setup lang="ts">
import { delete_user } from '@/api/users'
import { useSession } from '@/stores/token'
import { useRoute } from 'vue-router'

let id = useRoute().params.id.toString()

const session = useSession()
</script>

<template>
  <button @click="delete_user(id, session.token!.token)">submit</button>
</template>
