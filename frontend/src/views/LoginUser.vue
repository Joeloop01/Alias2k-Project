<script setup lang="ts">
import { type Login } from '@/api/auth'
import { signIn } from '@/plugins/session'
import router from '@/router'
import { FwbHeading, FwbButton, FwbAlert, FwbInput } from 'flowbite-vue'
import { ref } from 'vue'
import { Form, Field } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import * as zod from 'zod'

let error = ref<boolean>()

let login = ref<Login>({
  email: '',
  password: ''
})

async function onSubmit() {
  try {
    await signIn(login.value)
    router.push({ path: '/' })
  } catch (e) {
    error.value = true
    login.value.email = ''
    login.value.password = ''
  }
}

const validationSchema = toTypedSchema(
  zod.object({
    email: zod.string().email({ message: 'Must be a valid email' }),
    password: zod.string()
  })
)
</script>

<template>
  <fwb-heading tag="h1" class="flex justify-center mt-12 mb-6 font-thin text-green-400">
    Login
  </fwb-heading>
  <Form :validation-schema="validationSchema" @submit="onSubmit">
    <div class="flex flex-col items-stretch max-w-md gap-4 mx-auto">
      <fwb-alert type="danger" v-if="error" class="ring-1 ring-red-400"
        >Email or password are incorrect. Please retry.
      </fwb-alert>
      <Field name="email" type="email" v-slot="{ field }" v-model="login.email">
        <fwb-input v-bind="field" placeholder="Enter your email" autocomplete="on" />
      </Field>
      <Field name="password" type="password" v-slot="{ field }" v-model="login.password">
        <fwb-input v-bind="field" placeholder="Enter your password" type="password" />
      </Field>
    </div>
    <div class="flex justify-center gap-5 my-10">
      <fwb-button color="green"> Confirm </fwb-button>
      <fwb-button color="green" href="/users/new"> Create new user </fwb-button>
    </div>
  </Form>
</template>
