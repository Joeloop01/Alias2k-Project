export type User = {
    id: number,
    name: string,
    email: string,
    created_at: string,
    updated_at: string,
}

export type EditUser = {
    name: string,
    email: string,
}

export type NewUser = EditUser & {
    password: string
}


const headers = {
    "Content-Type": "application/json",
    'Authorization': 'Bearer e5f28e63-77de-11ee-86fe-38ca84c6d8be:eea8f3274225bdbce6c1dc3010f6dc16f2cf6aaae8ec7d990ad83d4dbadbb7890a3b31d981d465231ec322d6c5430442798b2536fee5729b1950694f7179e64f'
};

const url = "http://127.0.0.1:6969/users";

export async function getAll(): Promise<User[]> {
    const response = await fetch(url, {
        mode: "cors",
        method: "GET",
        headers
    });
    return await response.json()
}

export async function get(id: string): Promise<User> {
    const response = await fetch(url + "/" + id, {
        mode: "cors",
        method: "GET",
        headers
    })
    return await response.json()
}

export async function post(data: NewUser) {
    await fetch(url, {
        mode: "cors",
        method: "POST",
        headers,
        body: JSON.stringify(data)
    })
}

export async function put(data: EditUser, id: string) {
    await fetch(url + "/" + id, {
        mode: "cors",
        method: "PATCH",
        headers,
        body: JSON.stringify(data)
    })
}

export async function deleted(id: string) {
    await fetch(url + "/" + id, {
        mode: "cors",
        method: "DELETE",
        headers
    })
}