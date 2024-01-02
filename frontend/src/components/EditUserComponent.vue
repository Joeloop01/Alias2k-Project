<script setup lang="ts">
import { put } from '@/api/users'
import type { EditUser } from '@/api/users'
import { FwbInput, FwbButton, FwbHeading } from 'flowbite-vue'
import router from '@/router'
import { useSession } from '@/stores/token'
import z from 'zod'
import { useForm, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

const props = defineProps<{
  id: string
  editUser: EditUser
}>()

const EDITUSER_SCHEMA = z.object({
  name: z.string(),
  email: z.string().email({ message: 'Must be a valid email' })
})
type editUserSchema = z.infer<typeof EDITUSER_SCHEMA>

const { handleSubmit } = useForm<editUserSchema>({
  validationSchema: toTypedSchema(EDITUSER_SCHEMA),
  initialValues: props.editUser
})

const onSubmit = handleSubmit(async (value) => {
  await put(value, props.id, useSession().token!.token)
  router.push({ path: '/users' })
})
</script>

<template>
  <fwb-heading tag="h2" class="flex justify-center mt-10 mb-6 font-light text-green-400">
    Edit User
  </fwb-heading>
  <form @submit="onSubmit">
    <div class="flex flex-col items-stretch max-w-md gap-4 mx-auto">
      <Field name="name" v-slot="{ field, value }">
        <fwb-input v-bind="field" label="Update your name" :model-value="value" />
      </Field>
      <Field name="email" v-slot="{ field, value }">
        <fwb-input v-bind="field" label="Update your email" :model-value="value" />
      </Field>
    </div>
    <fwb-button color="green" class="flex mx-auto my-10">submit</fwb-button>
  </form>
</template>
