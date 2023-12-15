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


const url = "http://127.0.0.1:6969/users";

export async function getAll(token: string): Promise<User[]> {
    const response = await fetch(url, {
        mode: "cors",
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
        mode: "cors",
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
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer 13565bea-941e-11ee-b7e0-38ca84c6d8be:5d235688b3b5049b361a0fe3d60f9233aec4afbd0de11c95337bcfeabfa538076f9732068fc3831104bd774b70f62cdf6755df1ed5301daa632e52003e935cc5'
        },
        body: JSON.stringify(data)
    })
}

export async function put(data: EditUser, id: string, token: string) {
    await fetch(url + "/" + id, {
        mode: "cors",
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(data)
    })
}

export async function deleted(id: string, token: string) {
    await fetch(url + "/" + id, {
        mode: "cors",
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token,
        }
    })
}