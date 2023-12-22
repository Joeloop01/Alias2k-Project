<script setup lang="ts">
import { user_info } from '@/api/auth'
import type { User } from '@/api/users'
import { useSession } from '@/stores/token'
import { FwbHeading } from 'flowbite-vue'
import { ref } from 'vue'

let user = ref<User | null>()
let showButton = ref<boolean>()

async function onCLick() {
  showButton.value = !showButton.value
  if (showButton.value) user.value = await user_info(useSession().token!.token)
}

function onLogout() {
  localStorage.removeItem('token')
  location.reload()
}
</script>

<template>
  <header class="flex gap-5 my-10">
    <fwb-heading tag="h1" class="font-light" color="text-green-400">
      Project Vue by Simone
    </fwb-heading>
    <div v-if="useSession().token != null" class="relative flex align-middle gap-6o">
      <button
        class="text-sm rounded-full md:me-0 md:focus:ring-4 md:focus:ring-gray-300"
        type="button"
        @click="onCLick()"
      >
        <img class="rounded-full" src="https://picsum.photos/60" alt="user photo" />
      </button>
      <div
        v-if="showButton"
        class="absolute right-0 z-10 mr-0 bg-white divide-y divide-gray-100 rounded-lg shadow my-28 md:my-20 w-44"
      >
        <div class="px-4 py-3 text-sm text-black">
          <p>
            <span>{{ user?.name }}</span>
            <span v-if="user?.admin == 1" class="text-gray-400"> (admin)</span>
          </p>
          <div class="font-medium truncate">{{ user?.email }}</div>
        </div>
        <ul class="py-2 text-sm text-gray-700">
          <li>
            <a href="/" class="block px-4 py-2 hover:bg-gray-100"> Home </a>
          </li>
          <li>
            <a href="/users" v-if="user?.admin == 1" class="block px-4 py-2 hover:bg-gray-100">
              Show all users
            </a>
          </li>
          <li>
            <a
              :href="`/users/` + `${user?.id.toString()}` + `/edit`"
              class="block px-4 py-2 hover:bg-gray-100"
            >
              Edit
            </a>
          </li>
          <li>
            <div class="block px-4 py-2 hover:bg-gray-100" @click="onLogout">Logout</div>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
