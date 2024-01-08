<script setup lang="ts">
import { signIn } from '@/plugins/session'
import router from '@/router'
import { FwbHeading, FwbButton, FwbAlert, FwbInput } from 'flowbite-vue'
import { ref } from 'vue'
import { Field, useForm, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import z from 'zod'

let error = ref<boolean>()

const LOGIN_SCHEMA = z.object({
  email: z.string().email({ message: 'Must be a valid email' }),
  password: z.string().min(3)
})
type LoginSchema = z.infer<typeof LOGIN_SCHEMA>

const { handleSubmit } = useForm<LoginSchema>({
  validationSchema: toTypedSchema(LOGIN_SCHEMA)
})

const onSubmit = handleSubmit(async (value) => {
  error.value = false
  await signIn(value).catch(() => (error.value = true))
  if (!error.value) router.push({ path: '/' })
})
</script>

<template>
  <head>
    <meta name="description" content="Login user with username and password " />
  </head>
  <fwb-heading tag="h1" class="flex justify-center mt-12 mb-6 font-bold text-primary-950">
    Login
  </fwb-heading>
  <form @submit="onSubmit">
    <div class="flex flex-col items-stretch max-w-md gap-4 mx-auto">
      <fwb-alert type="danger" v-if="error" class="ring-1 ring-red-400">
        Email or password are incorrect. Please retry.
      </fwb-alert>
      <Field name="email" v-slot="{ field }">
        <fwb-input
          v-bind="field"
          placeholder="Enter your email"
          autocomplete="on"
          class="border-neutral-900 focus:border focus:border-primary-600"
        />
        <ErrorMessage name="email" />
      </Field>
      <Field name="password" v-slot="{ field }">
        <fwb-input
          v-bind="field"
          placeholder="Enter your password"
          type="password"
          autocomplete="off"
          class="border-neutral-900 focus:border focus:border-primary-600"
        />
        <ErrorMessage name="password" />
      </Field>
    </div>
    <div class="flex justify-center gap-5 my-10">
      <fwb-button class="bg-primary-600 hover:bg-primary-700">
        <div class="font-bold text-neutral-900">Confirm</div></fwb-button
      >
      <fwb-button class="bg-primary-600 hover:bg-primary-700" href="/users/new">
        <div class="font-bold text-neutral-900">Create new user</div>
      </fwb-button>
    </div>
  </form>
</template>
