<script setup lang="ts">
import { ref } from 'vue'
import type { NewTodo, Todo } from '@/api/todos'
import { FwbButton, FwbModal, FwbHeading, FwbInput, FwbCheckbox } from 'flowbite-vue'
import dayjs from 'dayjs'

const isCompleted = ref(false)

const props = defineProps<{
  todo?: Todo
  onClosed: () => void
  onSaved: (newTodo: NewTodo) => void
}>()

let newTodoData = ref<NewTodo>({
  title: '',
  description: '',
  completed_at: undefined,
  ...props.todo
})

let title_length = newTodoData.value.title.length

let headerText = 'New Todo'
if (title_length > 0) {
  headerText = 'Details'
}

function createNewTodo() {
  if (isCompleted.value == true) {
    newTodoData.value.completed_at = dayjs(newTodoData.value.completed_at).format(
      'YYYY-MM-DDTHH:mm:ss'
    )
  } else {
    newTodoData.value.completed_at = undefined
  }
  props.onSaved(newTodoData.value)
}
</script>

<template>
  <fwb-modal @close="onClosed">
    <template #header>
      <fwb-heading tag="h3" class="font-light" color="text-green-400">
        {{ headerText }}
      </fwb-heading>
    </template>
    <template #body>
      <div class="flex flex-col gap-3">
        <fwb-input class="flex-1" v-model.trim="newTodoData.title" label="Title:" />
        <fwb-input class="flex-1" v-model.trim="newTodoData.description" label="Description:" />
        <div v-if="title_length == 0">
          <br />
          <fwb-checkbox v-model="isCompleted" label="Already completed" />
        </div>
      </div>

      <div v-if="title_length > 0">
        <br />
        Created at day: {{ dayjs(todo!.created_at).format(' DD/MM/YYYY ') }} hour:
        {{ dayjs(todo!.created_at).add(1, 'hour').format(' h:mm:ss ') }}
        <br />
        Last update at day: {{ dayjs(todo!.updated_at).format(' DD/MM/YYYY ') }} hour:
        {{ dayjs(todo!.updated_at).add(1, 'hour').format(' h:mm:ss ') }}
        <div v-if="todo?.completed_at != undefined">
          Completed at day:
          {{ dayjs(todo!.completed_at).format(' DD/MM/YYYY ') }} hour:
          {{ dayjs(todo!.completed_at).format(' h:mm:ss ') }}
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <fwb-button color="green" @click="createNewTodo">Confirm</fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
