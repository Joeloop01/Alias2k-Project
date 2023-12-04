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

let headerText = 'New Todo'
if (newTodoData.value.title.length > 0) {
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
        <div v-if="newTodoData.title.length == 0">
          <br />
          <fwb-checkbox v-model="isCompleted" label="Already completed" />
        </div>
      </div>

      <div v-if="newTodoData.title.length > 0">
        <br />
        Created at: {{ todo!.created_at }}
        <br />
        Last update: {{ todo!.updated_at }} <br />
        <div v-if="todo?.completed_at != undefined">Completed at: {{ todo!.completed_at }}</div>
        <div v-else>Completed at: Not completed</div>
      </div>
    </template>
    <template #footer>
      <div class="flex justify-end">
        <fwb-button color="green" @click="createNewTodo">Confirm</fwb-button>
      </div>
    </template>
  </fwb-modal>
</template>
