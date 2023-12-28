<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/HeaderUser.vue'
import Footer from '@/components/FooterUser.vue'
</script>

<template>
  <div class="bg-green-100">
    <Header />
    <div class="container">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>
