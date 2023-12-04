<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/HeaderUser.vue'
import Footer from '@/components/FooterUser.vue'
</script>

<template>
  <div class="container">
    <Header />
    <RouterView />
    <Footer />
  </div>
</template>
