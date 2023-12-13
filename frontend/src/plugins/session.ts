import { refresh_token, type Login, type Token, signin } from '@/api/auth';
import { useSession } from '@/stores/token';
import dayjs from 'dayjs';

const session = {
    install() {
        useSession().token = get_session_token()
    }
  }
export default session;

export type AppToken = {
    token: string
    refresh_token: string
    expires_at: string
}

export function get_session_token(): AppToken | null {
    if (localStorage.getItem("token") === null){
        return null
    }
    const session_token: AppToken = JSON.parse(localStorage.getItem("token")!)
    if (new Date() > new Date(session_token.expires_at)) {
        refresh_session_token(session_token.refresh_token)
    }
    return JSON.parse(localStorage.getItem("token")!)
    
}

export function set_session_token(token: Token){
    localStorage.setItem("token", JSON.stringify({
        token: token.token,
        refresh_token: token.refresh_token,
        expires_at: dayjs(new Date).add(token.expires_in),
    }))
    useSession().token = get_session_token()
}

export async function refresh_session_token(app_refresh_token: string){
    set_session_token(await refresh_token(app_refresh_token))
}

export async function signIn(credentials: Login) {
    const session_token = await signin(credentials)
    set_session_token(session_token);
}