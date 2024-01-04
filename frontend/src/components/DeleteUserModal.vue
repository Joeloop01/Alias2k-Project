<script setup lang="ts">
import { delete_user } from '@/api/users'
import { useSession } from '@/stores/token'
import { FwbModal, FwbButton } from 'flowbite-vue'

const props = defineProps<{
  id: number
  onClose: () => void
}>()

async function onClick() {
  await delete_user(props.id.toString(), useSession().token!.token)
  location.reload()
}
</script>

<template>
  <fwb-modal @close="props.onClose">
    <template #header> Are you sure you want to remove this user? </template>
    <template #body>
      <div class="flex justify-end">
        <fwb-button color="red" @click="onClick">Confirm</fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
