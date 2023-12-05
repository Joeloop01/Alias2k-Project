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
    'Authorization': 'Bearer 9ebc34c3-935a-11ee-aed3-38ca84c6d8be:2a98d9f1d0fb8388a40b33ccdf5abbb08fca04fc0d91f74ebc6ab27b23abfcc51b5f7e62096d54b00073e9b0623c72ea5525724031c23d9814c9ecbd74e8f690'
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