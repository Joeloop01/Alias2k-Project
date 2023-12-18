<script setup lang="ts">
import { FwbButton, FwbHeading } from 'flowbite-vue'

const userPath = window.location.href

localStorage.removeItem('token')
</script>

<template>
  <fwb-heading tag="h1" class="flex justify-center my-12 font-thin text-green-400">
    Welcome to Project Joe</fwb-heading
  >
  <div class="flex justify-center gap-5 my-10">
    <fwb-button color="green" :href="`${userPath}` + `login`"> Login </fwb-button>
    <fwb-button color="green" :href="`${userPath}` + `users/new`"> Create new user </fwb-button>
  </div>
</template>
