<script setup lang="ts">
import { user_info } from '@/api/auth'
import type { User } from '@/api/users'
import userInfo from '@/components/UserInfo.vue'
import router from '@/router'

import { useSession } from '@/stores/token'
import { ref } from 'vue'

let user = ref<User | null>()

if (useSession().token != null) {
  user_info(useSession().token!.token).then((u) => (user.value = u))
} else {
  router.push({ path: '/login' })
}
</script>

<template>
  <div v-if="user != null">
    <userInfo :id="user!.id.toString()" />
  </div>
</template>
