<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/HeaderUser.vue'
import Footer from '@/components/FooterUser.vue'
</script>

<template>
  <div class="flex flex-col h-screen bg-neutral-100">
    <Header />
    <div class="container flex-1">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>
