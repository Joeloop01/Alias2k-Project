<script setup lang="ts">
import { putTodo, type NewTodo, type Todo } from '@/api/todos'
import { useSession } from '@/stores/token'
import { toTypedSchema } from '@vee-validate/zod'
import dayjs from 'dayjs'
import { FwbCheckbox } from 'flowbite-vue'
import { useForm, Field } from 'vee-validate'
import z from 'zod'

const props = defineProps<{
  todoData: Todo
}>()

const CHECKBOX_SCHEMA = z.object({
  isCompleted: z.boolean()
})

type CheckBoxType = z.infer<typeof CHECKBOX_SCHEMA>

const { handleSubmit } = useForm<CheckBoxType>({
  validationSchema: toTypedSchema(CHECKBOX_SCHEMA),
  initialValues: { isCompleted: !!props.todoData.completed_at }
})

const onSubmit = handleSubmit((value) => {
  let newTodoData: NewTodo = props.todoData
  if (!value.isCompleted) {
    newTodoData.completed_at = dayjs(new Date().toString())
      .add(-1, 'hours')
      .format('YYYY-MM-DDTHH:mm:ss')
  } else {
    newTodoData.completed_at = undefined
  }
  putTodo(
    props.todoData.user_id.toString(),
    newTodoData,
    newTodoData.id!.toString(),
    useSession().token!.token
  )
})
</script>

<template>
  <head>
    <meta name="description" content="checkbox completed todos" />
  </head>
  <form @click="onSubmit" class="m-5">
    <Field name="isCompleted" type="checkbox" v-slot="{ field, value }">
      <fwb-checkbox v-bind="field" :model-value="value" class="border rounded border-neutral-900" />
    </Field>
  </form>
</template>
