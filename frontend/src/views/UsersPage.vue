<script setup lang="ts">
import { getAll } from '@/api/users'
import { ref, computed } from 'vue'
import type { User } from '@/api/users'
import {
  FwbInput,
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbA,
  FwbButton
} from 'flowbite-vue'
import dayjs from 'dayjs'
import { useSession } from '@/stores/token'
import DeleteUserModal from '@/components/DeleteUserModal.vue'

let session = useSession()
let deleteUser = ref<boolean>(false)
let userId = ref<number | null>()

let data = ref<User[] | null>(null)
getAll(session.token!.token).then((d) => (data.value = d))

const userPath = window.location.href + '/'
const nameOrEmail = ref('')
const from = ref('')
const to = ref('')

const filtered = computed(() => {
  const query = nameOrEmail.value.toLowerCase().trim()
  let list = data.value
  const dateFrom = from.value
  const dateTo = to.value
  if (!list) return list
  if (query.length > 0) {
    list = list.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query)
    )
  }
  if (dateFrom.length > 0) {
    list = list.filter((user) => new Date(user.created_at) > new Date(dateFrom))
  }
  if (dateTo.length > 0) {
    list = list.filter((user) => new Date(user.created_at) < new Date(dateTo))
  }
  return list
})

function openDeleteUserModal(id: number) {
  deleteUser.value = true
  userId.value = id
}

function closeDeleteModal() {
  deleteUser.value = false
}
</script>

<template>
  <head>
    <meta name="users page" content="show all users. Accessible only from admin" />
  </head>
  <div class="mt-4 md:gap-3 md:flex">
    <fwb-input v-model="nameOrEmail" class="flex-1" placeholder="Search a user" label="User:" />
    <br />
    <div class="gap-3 md:flex">
      <fwb-input type="datetime-local" class="flex-1" v-model="from" label="From:" />
      <br />
      <fwb-input type="datetime-local" class="flex-1" v-model="to" label="To:" />
    </div>
  </div>
  <br />

  <fwb-table hoverable>
    <fwb-table-head class="text-gray-900 bg-primary-600">
      <fwb-table-head-cell> Name </fwb-table-head-cell>
      <fwb-table-head-cell> Email </fwb-table-head-cell>
      <fwb-table-head-cell> Created at </fwb-table-head-cell>
      <fwb-table-head-cell> Updated at </fwb-table-head-cell>
      <fwb-table-head-cell> <span class="sr-only">Edit and Remove</span></fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body>
      <fwb-table-row v-for="user of filtered" v-bind:key="user.id" class="text-primary-950">
        <fwb-table-cell>
          <fwb-a :href="`${userPath}${user.id.toString()}`" class="text-primary-950">{{
            user.name
          }}</fwb-a>
        </fwb-table-cell>
        <fwb-table-cell>{{ user.email }}</fwb-table-cell>
        <fwb-table-cell>
          Day: {{ dayjs(user.created_at).format(' DD/MM/YYYY ') }} <br />
          Hour: {{ dayjs(user.created_at).format(' h:mm:ss ') }}
        </fwb-table-cell>
        <fwb-table-cell>
          Day: {{ dayjs(user.updated_at).format(' DD/MM/YYYY ') }} <br />
          Hour: {{ dayjs(user.updated_at).format(' h:mm:ss ') }}
        </fwb-table-cell>
        <fwb-table-cell class="flex justify-center gap-10">
          <fwb-button
            :href="`${userPath}${user.id.toString()}` + `/edit`"
            class="bg-primary-700 hover:bg-primary-800"
          >
            Edit
          </fwb-button>
          <fwb-button color="red" @click="openDeleteUserModal(user.id)"> Remove</fwb-button>
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
  <br />

  <DeleteUserModal v-if="deleteUser" :id="userId!" :onClose="closeDeleteModal" />
</template>
