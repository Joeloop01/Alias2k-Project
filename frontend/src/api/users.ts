export type User = {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
  admin: number
}

export type EditUser = {
  name: string
  email: string
}

export type NewUser = EditUser & {
  password: string
}
const api_url = import.meta.env.VITE_BACKEND_URL

const url = api_url + '/users'

export async function getAll(token: string): Promise<User[]> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  })
  return await response.json()
}

export async function get(id: string, token: string): Promise<User> {
  const response = await fetch(url + '/' + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  })
  return await response.json()
}

export async function post(data: NewUser) {
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
}

export async function put(data: EditUser, id: string, token: string) {
  await fetch(url + '/' + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    },
    body: JSON.stringify(data)
  })
}

export async function delete_user(id: string, token: string) {
  await fetch(url + '/' + id, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token
    }
  })
}
