import { refresh_token, type Token } from '@/api/auth';
import dayjs from 'dayjs';
import type { App } from 'vue';


/*     install: (app: App<Element>) => {
        app.config.globalProperties.$validate = ()=> {
            const store_token = useSession();
            if (store_token.token == null){
                return false
            }
            return store_token.token.expires_in < 1000
        }
    } */
const session = {
    install(app, options) {

    }
  }
export default session;

type AppToken = {
    token:string
    refresh_token:string
    expires_at: string
}

function get_token(): AppToken {
     return localStorage.getItemItem("token")
}

function set_token(token: Token){
    const date = dayjs(new Date).add(token.expires_in).toString();
    localStorage.setItem("token", JSON.stringify({
        token: token.token,
        refresh_token: token.refresh_token,
        expires_at: date
    }))
}

async function app_refresh_token(app_refresh_token: string){
    const result = await refresh_token(app_refresh_token)
    set_token(result)
}
