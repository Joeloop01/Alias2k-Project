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
  FwbTable
} from 'flowbite-vue'
import TodoModal from '@/components/TodoModal.vue'
import { postTodo } from '@/api/todos'
import { useSession } from '@/stores/token'
import CompletedTodoCheckBox from './CompletedTodoCheckBox.vue'

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
</script>

<template>
  <head>
    <meta name="description" contents="displays user info and todos" />
  </head>
  <div class="flex my-5">
    <img
      src="./icons/image_placeholder.png"
      alt="placeholder"
      name="placeholder"
      class="w-20 m-5 mr-10 rounded-full h-20 shadow-xl ring-2 ring-primary-600 my-auto"
    />
    <fwb-heading tag="h2" class="overflow-hidden font-bold text-neutral-900 text-ellipsis my-auto">
      Hi, {{ userData?.name }}
    </fwb-heading>
  </div>

  <div class="flex gap-2 my-5">
    <fwb-heading tag="h3" class="font-bold leading-normal text-neutral-900">
      Here's your to-do's!
    </fwb-heading>
    <fwb-button
      @click="openNewTodoModal"
      class="my-auto md:flex-shrink-0 md:my-0 bg-primary-600 hover:bg-primary-700"
    >
      <div class="font-bold text-neutral-900">New Todo</div>
    </fwb-button>
  </div>

  <div class="border bg-neutral-900 rounded-xl">
    <div class="m-5">
      <fwb-heading tag="h4" class="my-5 text-primary-600">Not completed</fwb-heading>

      <fwb-table hoverable>
        <fwb-table-body>
          <fwb-table-row
            v-for="todo in todosData"
            v-bind:key="todo.id"
            v-auto-animate
            class="overflow-hidden"
          >
            <div v-if="todo.completed_at == undefined">
              <fwb-table-cell class="align-middle">
                <CompletedTodoCheckBox :todoData="todo" />
              </fwb-table-cell>
              <fwb-table-cell
                v-if="todo.completed_at == undefined"
                @click="openEditTodoModal(todo)"
              >
                <div class="text-start md:mx-0">
                  <fwb-heading tag="h5" class="font-semibold cursor-pointer text-neutral-900">
                    {{ todo.title }}
                  </fwb-heading>
                  <div class="font-normal break-all cursor-pointer text-neutral-900">
                    {{ todo.description }}
                  </div>
                </div>
              </fwb-table-cell>
            </div>
          </fwb-table-row>
        </fwb-table-body>
      </fwb-table>
    </div>
  </div>

  <div class="my-5 border bg-neutral-900 rounded-xl">
    <div class="m-5">
      <fwb-heading tag="h4" class="my-5 font-bold text-primary-600">Completed</fwb-heading>

      <fwb-table hoverable class="my-5">
        <fwb-table-body>
          <fwb-table-row v-for="todo in todosData" v-bind:key="todo.id" v-auto-animate>
            <div v-if="todo.completed_at != undefined">
              <fwb-table-cell class="align-middle">
                <CompletedTodoCheckBox :todoData="todo" />
              </fwb-table-cell>
              <fwb-table-cell
                v-if="todo.completed_at != undefined"
                @click="openEditTodoModal(todo)"
              >
                <div class="text-start md:mx-0">
                  <fwb-heading tag="h5" class="font-semibold cursor-pointer text-neutral-900">
                    {{ todo.title }}
                  </fwb-heading>
                  <div class="font-normal break-all cursor-pointer text-neutral-900">
                    {{ todo.description }}
                  </div>
                </div>
              </fwb-table-cell>
            </div>
          </fwb-table-row>
        </fwb-table-body>
      </fwb-table>
    </div>
  </div>
  <TodoModal
    v-if="isEditTodoModal"
    :todo="editTodo!"
    :onClosed="closeEditModal"
    :onSaved="(t) => onEditTodo(t, editTodo!.id.toString())"
  />
  <TodoModal v-if="isNewTodoModal" :onClosed="closeNewModal" :onSaved="onNewTodo" />
</template>
