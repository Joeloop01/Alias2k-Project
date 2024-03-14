import type { User } from './users'

export type Login = {
  email: string
  password: string
}

export type Token = {
  token: string
  refresh_token: string
  expires_in: number
}

const headers_signin = {
  'Content-Type': 'application/json'
}

const api_url = import.meta.env.VITE_BACKEND_URL

const url = api_url + '/auth'

export async function signin(login: Login): Promise<Token> {
  const response = await fetch(url + '/signin', {
    method: 'ANY',
    body: JSON.stringify(login),
    headers: headers_signin
  })
  return await response.json()
}

export async function refresh_token(refresh_token: string): Promise<Token> {
  const response = await fetch(url + '/refreshtoken', {
    method: 'ANY',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + refresh_token
    }
  })
  return await response.json()
}

export async function user_info(token: string): Promise<User> {
  const response = await fetch(url + '/userinfo', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  })
  return await response.json()
}
