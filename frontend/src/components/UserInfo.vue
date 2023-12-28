<script setup lang="ts">
import { get } from '@/api/users'
import type { User } from '@/api/users'
import { computed, ref } from 'vue'
import type { NewTodo, Todo } from '@/api/todos'
import { getAllTodos, putTodo } from '@/api/todos'
import {
  FwbButton,
  FwbHeading,
  FwbTableBody,
  FwbTableCell,
  FwbTableRow,
  FwbTable,
  FwbCheckbox
} from 'flowbite-vue'
import TodoModal from '@/components/TodoModal.vue'
import { postTodo } from '@/api/todos'
import dayjs from 'dayjs'
import { useSession } from '@/stores/token'

const props = defineProps<{
  id: string
}>()

const session = useSession()

let editTodo = ref<Todo | null>(null)

const isNewTodoModal = ref(false)
const isEditTodoModal = computed(() => editTodo.value != null)

function openNewTodoModal() {
  isNewTodoModal.value = true
}

function closeNewModal() {
  isNewTodoModal.value = false
}

function openEditTodoModal(todo: Todo) {
  editTodo.value = todo
}

function closeEditModal() {
  editTodo.value = null
}

async function onNewTodo(newTodo: NewTodo) {
  closeNewModal()
  await postTodo(props.id, newTodo, session.token!.token)
  await getAllTodos(props.id, session.token!.token).then((d) => (todosData.value = d))
}

async function onEditTodo(newTodo: NewTodo, todoId: string) {
  closeEditModal()
  await putTodo(props.id, newTodo, todoId, session.token!.token)
  await getAllTodos(props.id, session.token!.token).then((d) => (todosData.value = d))
}

let userData = ref<User | null>(null)
let todosData = ref<Todo[] | null>(null)

get(props.id, session.token!.token).then((d) => (userData.value = d))
getAllTodos(props.id, session.token!.token).then((d) => (todosData.value = d))

function isClicked(todoData: Todo) {
  let newTodoData: NewTodo = todoData
  if (newTodoData.completed_at == undefined) {
    todoData.completed_at = dayjs(new Date().toString()).format('YYYY-MM-DDTHH:mm:ss')
  } else {
    newTodoData.completed_at = undefined
  }
  putTodo(props.id, newTodoData, newTodoData.id!.toString(), session.token!.token)
}
</script>

<template>
  <div class="flex flex-col items-center my-10">
    <img src="https://picsum.photos/300" class="m-16 rounded-full shadow-xl" />
    <fwb-heading tag="h1" class="mb-6 font-medium text-center">
      {{ userData?.name }}
      <span v-if="userData?.admin == 1" class="text-xl font-medium text-slate-500"> (Admin) </span>
    </fwb-heading>
    <fwb-heading tag="h5" class="mb-6 font-medium text-center text-slate-500">
      Contact: {{ userData?.email }}
    </fwb-heading>
  </div>
  <hr />
  <hr />
  <div class="flex my-5">
    <fwb-heading tag="h2" class="font-light leading-normal text-green-500">TODOS</fwb-heading>
    <fwb-button @click="openNewTodoModal" color="green" class="flex-shrink-0">
      New Todo
    </fwb-button>
  </div>

  <fwb-heading tag="h4" class="my-5 font-light text-green-500">Not completed</fwb-heading>

  <fwb-table hoverable>
    <fwb-table-body>
      <fwb-table-row v-for="todo in todosData" v-bind:key="todo.id" v-auto-animate>
        <div v-if="todo.completed_at == undefined">
          <fwb-table-cell class="align-middle">
            <fwb-checkbox
              v-model="computed(() => todo.completed_at != undefined).value"
              @click="isClicked(todo)"
              class="ml-5"
            />
          </fwb-table-cell>
          <fwb-table-cell v-if="todo.completed_at == undefined" @click="openEditTodoModal(todo)">
            <div class="text-start md:mx-0">
              <fwb-heading tag="h5" class="font-semibold">{{ todo.title }}</fwb-heading>
              <div class="font-normal break-all text-slate-500">
                {{ todo.description }}
              </div>
            </div>
          </fwb-table-cell>
        </div>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>

  <fwb-heading tag="h4" class="my-5 font-light text-green-500">Completed</fwb-heading>

  <fwb-table hoverable class="my-5">
    <fwb-table-body>
      <fwb-table-row v-for="todo in todosData" v-bind:key="todo.id" v-auto-animate>
        <div v-if="todo.completed_at != undefined">
          <fwb-table-cell class="align-middle">
            <fwb-checkbox
              v-model="computed(() => todo.completed_at != undefined).value"
              @click="isClicked(todo)"
              class="ml-5"
            />
          </fwb-table-cell>
          <fwb-table-cell v-if="todo.completed_at != undefined" @click="openEditTodoModal(todo)">
            <div class="text-start md:mx-0">
              <fwb-heading tag="h5" class="font-semibold">{{ todo.title }}</fwb-heading>
              <div class="font-normal break-all text-slate-500">
                {{ todo.description }}
              </div>
            </div>
          </fwb-table-cell>
        </div>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>

  <TodoModal
    v-if="isEditTodoModal"
    :todo="editTodo!"
    :onClosed="closeEditModal"
    :onSaved="(t) => onEditTodo(t, editTodo!.id.toString())"
  />
  <TodoModal v-if="isNewTodoModal" :onClosed="closeNewModal" :onSaved="onNewTodo" />
</template>
