import type { Token } from '@/api/auth'
import { defineStore } from 'pinia'


export const useSession = defineStore('token', {
    state:() => {
        return {
            token: null as Token | null
        }
    }
})