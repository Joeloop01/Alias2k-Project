import '@/assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import session from '@/plugins/session'

import App from './App.vue'
import router from './router'

const app = createApp(App)


app.use(createPinia())

app.use(router).use(session).use(autoAnimatePlugin)


app.mount('#app')
