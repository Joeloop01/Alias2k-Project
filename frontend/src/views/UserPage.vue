<script setup lang="ts">
import UserInfo from '@/components/UserInfo.vue'
import { useRoute } from 'vue-router'

let id = useRoute().params.id.toString()
</script>

<template>
  <head>
    <meta name="description" content="Shows a specific user page with user info" />
  </head>
  <UserInfo :id="id" />
</template>
