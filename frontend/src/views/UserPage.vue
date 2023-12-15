<script setup lang="ts">
import { get } from '@/api/users'
import type { User } from '@/api/users'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
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

let id = useRoute().params.id.toString()
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
  await postTodo(id, newTodo, session.token!.token)
  await getAllTodos(id, session.token!.token).then((d) => (todosData.value = d))
}

async function onEditTodo(newTodo: NewTodo, todoId: string) {
  closeEditModal()
  await putTodo(id, newTodo, todoId, session.token!.token)
  await getAllTodos(id, session.token!.token).then((d) => (todosData.value = d))
}

let userData = ref<User | null>(null)
let todosData = ref<Todo[] | null>(null)

if (session.token != null) {
  get(id, session.token!.token).then((d) => (userData.value = d))
  getAllTodos(id, session.token!.token).then((d) => (todosData.value = d))
}

function isClicked(todoData: Todo) {
  let newTodoData: NewTodo = todoData
  if (newTodoData.completed_at == undefined) {
    todoData.completed_at = dayjs(new Date().toString()).format('YYYY-MM-DDTHH:mm:ss')
  } else {
    newTodoData.completed_at = undefined
  }
  putTodo(id, newTodoData, newTodoData.id!.toString(), session.token!.token)
}
</script>

<template>
  <div v-if="session.token == null">NOT AUTORIZED</div>
  <div v-else>
    <div class="border rounded-lg">
      <div class="m-16">
        <img src="https://picsum.photos/300" class="m-auto rounded-full shadow-xl" />
      </div>
      <fwb-heading tag="h1" class="mb-12 font-medium text-center">{{ userData?.name }}</fwb-heading>
      <fwb-heading tag="h5" class="mb-6 font-medium text-center text-slate-500"
        >Contact: {{ userData?.email }}
      </fwb-heading>
    </div>

    <br />
    <div class="flex">
      <fwb-heading tag="h2" class="font-light leading-normal text-green-500">TODOS</fwb-heading>
      <fwb-button @click="openNewTodoModal" color="green" class="flex-shrink-0 mx-6"
        >New Todo</fwb-button
      >
    </div>
    <br />

    <fwb-heading tag="h4" class="font-light text-green-500">Not completed</fwb-heading>
    <br />

    <fwb-table hoverable>
      <fwb-table-body>
        <fwb-table-row v-for="todo in todosData" v-bind:key="todo.id">
          <fwb-table-cell v-if="todo.completed_at == undefined">
            <fwb-checkbox
              v-model="computed(() => todo.completed_at != undefined).value"
              @click="isClicked(todo)"
              class="mx-3"
            />
          </fwb-table-cell>
          <fwb-table-cell
            v-if="todo.completed_at == undefined"
            class="flex"
            @click.left="openEditTodoModal(todo)"
          >
            <div class="flex flex-col -mx-6 text-center md:mx-0">
              <fwb-heading tag="h5" class="font-semibold">{{ todo.title }}</fwb-heading>
              <div class="flex justify-start font-normal text-slate-500">
                {{ todo.description }}
              </div>
            </div>
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
    </fwb-table>
    <br />

    <fwb-heading tag="h4" class="font-light text-green-500">Completed</fwb-heading>

    <br />
    <fwb-table hoverable>
      <fwb-table-body>
        <fwb-table-row v-for="todo in todosData" v-bind:key="todo.id">
          <fwb-table-cell v-if="todo.completed_at != undefined" class="">
            <fwb-checkbox
              v-model="computed(() => todo.completed_at != undefined).value"
              @click="isClicked(todo)"
              class="mx-3"
            />
          </fwb-table-cell>
          <fwb-table-cell
            v-if="todo.completed_at != undefined"
            class="flex gap-x-10"
            @click.left="openEditTodoModal(todo)"
          >
            <div class="flex flex-col text-center">
              <fwb-heading tag="h5" class="font-semibold">{{ todo.title }}</fwb-heading>
              <div class="flex justify-start font-normal text-slate-500">
                {{ todo.description }}
              </div>
            </div>
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
    </fwb-table>

    <TodoModal
      v-if="isEditTodoModal"
      :todo="editTodo!"
      :onClosed="closeEditModal"
      :onSaved="(t) => onEditTodo(t, editTodo!.id!.toString())"
    />
    <TodoModal v-if="isNewTodoModal" :onClosed="closeNewModal" :onSaved="onNewTodo" />
  </div>
</template>
