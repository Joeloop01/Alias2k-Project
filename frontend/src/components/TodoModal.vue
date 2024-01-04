<script setup lang="ts">
import type { NewTodo, Todo } from '@/api/todos'
import { FwbButton, FwbModal, FwbHeading, FwbInput, FwbCheckbox } from 'flowbite-vue'
import dayjs from 'dayjs'
import { Field, useForm, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import z from 'zod'

const props = defineProps<{
  todo?: Todo
  onClosed: () => void
  onSaved: (newTodo: NewTodo) => void
}>()

const headerText = !props.todo ? 'New Todo' : 'Details'

const FORM_SCHEMA = z.object({
  title: z.string().min(3),
  description: z.string(),
  isCompleted: z.string().optional()
})
type FormType = z.infer<typeof FORM_SCHEMA>

const { handleSubmit } = useForm<FormType>({
  validationSchema: toTypedSchema(FORM_SCHEMA),
  initialValues: props.todo
})

const onSubmit = handleSubmit((value) => {
  let newTodo: NewTodo = {
    title: value.title,
    description: value.description,
    completed_at: undefined
  }
  if (props.todo?.completed_at != undefined || value.isCompleted != undefined) {
    newTodo.completed_at = dayjs(props.todo?.completed_at).format('YYYY-MM-DDTHH:mm:ss')
  }
  props.onSaved(newTodo)
})
</script>

<template>
  <form @submit="onSubmit">
    <fwb-modal @close="onClosed">
      <template #header>
        <fwb-heading tag="h3" class="font-light" color="text-primary-900">
          {{ headerText }}
        </fwb-heading>
      </template>
      <template #body>
        <div class="flex flex-col gap-5">
          <Field name="title" v-slot="{ field, value }">
            <fwb-input v-bind="field" placeholder="Title" :model-value="value" />
            <ErrorMessage name="title" />
          </Field>
          <Field name="description" v-slot="{ field, value }">
            <fwb-input v-bind="field" placeholder="Description" :model-value="value" />
          </Field>
          <Field
            v-if="props.todo == undefined"
            v-slot="{ field }"
            name="isCompleted"
            type="checkbox"
          >
            <fwb-checkbox v-bind="field" label="Already completed" />
          </Field>
        </div>
        <div v-if="props.todo != undefined" class="flex flex-col mt-3">
          <div>
            Created at day: {{ dayjs(todo!.created_at).format(' DD/MM/YYYY ') }} hour:
            {{ dayjs(todo!.created_at).add(1, 'hour').format(' h:mm:ss ') }}
          </div>
          <div>
            Last update at day: {{ dayjs(todo!.updated_at).format(' DD/MM/YYYY ') }} hour:
            {{ dayjs(todo!.updated_at).add(1, 'hour').format(' h:mm:ss ') }}
          </div>
          <div v-if="todo?.completed_at != undefined">
            Completed at day:
            {{ dayjs(todo!.completed_at).format(' DD/MM/YYYY ') }} hour:
            {{ dayjs(todo!.completed_at).format(' h:mm:ss ') }}
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <fwb-button type="submit" class="bg-primary-700 hover:bg-primary-800">
            Confirm
          </fwb-button>
        </div>
      </template>
    </fwb-modal>
  </form>
</template>
