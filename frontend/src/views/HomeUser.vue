<script setup lang="ts">
import { user_info } from '@/api/auth'
import type { User } from '@/api/users'
import userInfo from '@/components/UserInfo.vue'

import { useSession } from '@/stores/token'
import { ref } from 'vue'

let user = ref<User | null>()

user_info(useSession().token!.token).then((u) => (user.value = u))
</script>

<template>
  <head>
    <meta name="description" contents="Shows user info when logged. Homepage" />
  </head>
  <div v-if="user != null">
    <userInfo :id="user!.id.toString()" />
  </div>
</template>
