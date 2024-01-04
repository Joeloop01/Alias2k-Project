export type User = {
    id: number,
    name: string,
    email: string,
    created_at: string,
    updated_at: string,
    admin: number
}

export type EditUser = {
    name: string,
    email: string,
}

export type NewUser = EditUser & {
    password: string
}


const url = "http://127.0.0.1:6969/users";

export async function getAll(token: string): Promise<User[]> {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token,
        }
    });
    return await response.json()
}

export async function get(id: string, token: string): Promise<User> {
    const response = await fetch(url + "/" + id, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token,
        }
    })
    return await response.json()
}

export async function post(data: NewUser) {
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer 34393e2c-9fe6-11ee-b215-38ca84c6d8be:02d7e0fe824a812a2a4efb6a5027734b5c90bef9b2abd55b35665828ab4d6d127e3c4f3f389888c52a2492629b6a455d8cd22192ee7091ef67c6546cd3546f57'
        },
        body: JSON.stringify(data)
    })
}

export async function put(data: EditUser, id: string, token: string) {
    await fetch(url + "/" + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(data)
    })
}

export async function delete_user(id: string, token: string) {
    await fetch(url + "/" + id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token,
        }
    })
}