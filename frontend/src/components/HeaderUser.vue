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
  <header class="flex p-6 bg-neutral-900">
    <fwb-heading tag="h1" class="flex font-bold text-primary-600">
      <a href="/" class="flex gap-3 leading-none">
        <img
          class="my-auto rounded-full w-7 h-7 bg-primary-600"
          src="./icons/home_button.png"
          alt="placeholder"
          name="placeholder"
        />VueOne</a
      >
    </fwb-heading>
    <div v-if="useSession().token != null" class="relative flex align-middle gap-6o">
      <button
        class="flex text-sm rounded-full md:me-0 md:focus:ring-4 md:focus:ring-green-500"
        type="button"
        name="showInformation"
        @click="onCLick()"
      >
        <img
          class="w-16 rounded-full ring-2 ring-primary-600"
          src="./icons/image_placeholder.png"
          alt="placeholder"
          name="placeholder"
        />
      </button>
      <div
        v-if="showButton"
        class="absolute right-0 z-10 my-16 mr-0 divide-y rounded-lg shadow bg-neutral-100 divide-neutral-300 md:-top-3 md:my-20 w-44"
      >
        <div class="px-4 py-3 text-sm text-neutral-900">
          <p>
            <span>{{ user?.name }}</span>
            <span v-if="user?.admin == 1"> (admin)</span>
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
            <div class="block px-4 py-2 cursor-pointer hover:bg-gray-100" @click="onLogout">
              Logout
            </div>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>
