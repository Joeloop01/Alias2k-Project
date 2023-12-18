<script setup lang="ts">
import { deleted } from '@/api/users'
import { useSession } from '@/stores/token'
import { useRoute } from 'vue-router'

let id = useRoute().params.id.toString()

const session = useSession()
</script>

<template>
  <button @click="deleted(id, session.token!.token)">submit</button>
</template>
