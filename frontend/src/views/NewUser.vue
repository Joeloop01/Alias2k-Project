<script setup lang="ts">
import { post } from '@/api/users'
import { FwbInput, FwbButton, FwbHeading } from 'flowbite-vue'
import router from '@/router'
import z from 'zod'
import { Field, useForm, ErrorMessage } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

const NEWUSER_SCHEMA = z.object({
  name: z.string().min(3, 'Name must contain at least 3 character(s)'),
  email: z.string().email({ message: 'Must be a valid email' }),
  password: z.string().min(3, 'Password must contain at least 3 character(s)')
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
  <head>
    <meta name="description" content="Create a new user" />
  </head>
  <fwb-heading tag="h2" class="flex justify-center mt-10 mb-6 font-bold text-primary-950">
    New User
  </fwb-heading>
  <form
    @submit="onSubmit"
    class="flex flex-col items-stretch max-w-md gap-4 mx-auto text-primary-950"
  >
    <Field name="name" v-slot="{ field }">
      <fwb-input
        v-bind="field"
        placeholder="Name"
        class="border-neutral-900 focus:border focus:border-primary-600"
        autocomplete="off"
      />
      <ErrorMessage class="text-sm" name="name" />
    </Field>
    <Field name="email" v-slot="{ field }">
      <fwb-input
        v-bind="field"
        placeholder="Email"
        class="border-neutral-900 focus:border focus:border-primary-600"
        autocomplete="off"
      />
      <ErrorMessage class="text-sm" name="email" />
    </Field>
    <Field name="password" v-slot="{ field }">
      <fwb-input
        v-bind="field"
        placeholder="Password"
        type="password"
        class="border-neutral-900 focus:border focus:border-primary-600"
        autocomplete="off"
      />
      <ErrorMessage class="text-sm" name="password" />
    </Field>

    <fwb-button color="green" class="flex mx-auto my-5 bg-primary-600 hover:bg-primary-700">
      <div class="font-bold text-neutral-900">Submit</div>
    </fwb-button>
  </form>
</template>
