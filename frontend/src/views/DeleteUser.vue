<script setup lang="ts">
import { deleted } from '@/api/users';
import { useRoute } from "vue-router";

let id = useRoute().params.id.toString();
</script>

<template>
    <button @click="deleted(id)">submit</button>
</template>