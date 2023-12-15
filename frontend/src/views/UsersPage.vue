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
import { refresh_token } from '@/api/auth'

let session = useSession()

console.log(session.token)
if (session.token == null) {
  location.reload()
}

let data = ref<User[] | null>(null)
if (session.token != null) {
  getAll(session.token!.token).then((d) => (data.value = d))
}

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
</script>

<template>
  <div v-if="session.token == null">NOT AUTORIZED</div>
  <div v-else>
    <div class="md:gap-3 md:flex">
      <fwb-input v-model="nameOrEmail" class="flex-1" placeholder="Search a user" label="User:" />
      <br />
      <div class="gap-3 md:flex">
        <fwb-input type="datetime-local" class="flex-1" v-model="from" label="From:" />
        <br />
        <fwb-input type="datetime-local" class="flex-1" v-model="to" label="To:" />
      </div>
    </div>
    <br />

    <fwb-table>
      <fwb-table-head>
        <fwb-table-head-cell> Name </fwb-table-head-cell>
        <fwb-table-head-cell> Email </fwb-table-head-cell>
        <fwb-table-head-cell> Created at </fwb-table-head-cell>
        <fwb-table-head-cell> Updated at </fwb-table-head-cell>
        <fwb-table-head-cell> <span class="sr-only">Edit</span></fwb-table-head-cell>
      </fwb-table-head>
      <fwb-table-body>
        <fwb-table-row v-for="user of filtered" v-bind:key="user.id">
          <fwb-table-cell>
            <fwb-a :href="`${userPath}${user.id.toString()}`">{{ user.name }}</fwb-a>
          </fwb-table-cell>
          <fwb-table-cell>{{ user.email }}</fwb-table-cell>
          <fwb-table-cell>
            Day: {{ dayjs(user.created_at).format(' DD/MM/YYYY ') }} <br />
            Hour: {{ dayjs(user.created_at).format(' h:mm:ss ') }}
          </fwb-table-cell>
          <fwb-table-cell
            >Day: {{ dayjs(user.updated_at).format(' DD/MM/YYYY ') }} <br />
            Hour: {{ dayjs(user.updated_at).format(' h:mm:ss ') }}
          </fwb-table-cell>
          <fwb-table-cell>
            <fwb-a :href="`${userPath}${user.id.toString()}` + `/edit`">Edit</fwb-a>
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
    </fwb-table>
    <br />
    <fwb-button color="green" :href="`${userPath}` + `new`"> Create a new user</fwb-button>
  </div>
</template>
