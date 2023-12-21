<script setup lang="ts">
import UserInfo from '@/components/UserInfo.vue'
import { useRoute } from 'vue-router'

let id = useRoute().params.id.toString()
</script>

<template>
  <UserInfo :id="id" />
</template>
