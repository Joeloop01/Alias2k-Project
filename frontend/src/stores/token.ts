import type { AppToken } from '@/plugins/session'
import { defineStore } from 'pinia'


export const useSession = defineStore('token', {
    state:() => {
        return {
            token: null as AppToken | null
        }
    }
})