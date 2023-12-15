import '@/assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import session from '@/plugins/session'

import App from './App.vue'
import router from './router'

const app = createApp(App)


app.use(createPinia())
app.use(session)
app.use(router)


app.mount('#app')
