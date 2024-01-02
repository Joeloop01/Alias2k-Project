<script setup lang="ts">
import { post } from '@/api/users'
import { FwbInput, FwbButton, FwbHeading } from 'flowbite-vue'
import router from '@/router'
import z from 'zod'
import { Field, useForm, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

const NEWUSER_SCHEMA = z.object({
  name: z.string(),
  email: z.string().email({ message: 'Must be a valid email' }),
  password: z.string().min(3)
})
type NewUserSchema = z.infer<typeof NEWUSER_SCHEMA>

const { handleSubmit } = useForm<NewUserSchema>({
  validationSchema: toTypedSchema(NEWUSER_SCHEMA)
})

const onSubmit = handleSubmit(async (value) => {
  await post(value)
  router.push({ path: '/' })
})
</script>

<template>
  <fwb-heading tag="h2" class="flex justify-center mt-10 mb-6 font-light text-green-400">
    New User
  </fwb-heading>
  <form @submit="onSubmit" class="flex flex-col items-stretch max-w-md gap-4 mx-auto">
    <Field name="name" v-slot="{ field }">
      <fwb-input v-bind="field" placeholder="Name" />
    </Field>
    <Field name="email" v-slot="{ field }">
      <fwb-input v-bind="field" placeholder="Email" />
      <ErrorMessage name="email" />
    </Field>
    <Field name="password" v-slot="{ field }">
      <fwb-input v-bind="field" placeholder="Password" type="password" />
      <ErrorMessage name="password" />
    </Field>
    <div>
      <fwb-button color="green" class="flex mx-auto my-5">submit</fwb-button>
    </div>
  </form>
</template>
