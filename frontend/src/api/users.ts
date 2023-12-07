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
    'Authorization': 'Bearer 2N4oLyrrLLw8lMaSTWx5FFszqiabRDrleYZzXN8VrbDnkFHXoEgWdox1Snl675tDIMKAn7QU4O91l2GYd7stxeYQmF6eAoPkjQ5YFqp95D3bDnsbBzuXrjIkXYfoNO89Mj7AjO7nbfxZSewpkBOhtwck2AvJxhypRImQnzjGMwtNgXmacjM9q9hz2Y5iXruf7ecA28WZqDhGYmQCHRWN1ZLA47TvrCcuosN15dqpUPi8DiwsKpSvLaTzEM0LjlbLXlqYcZA7kVc6KfntQ3aHrREawYyQoeqop6N0gHGa6x3rDlp8hAzV7j5XNZi7yDSDzbbaFRWbHlXvAAJvQdNF2qUd2Pv8jXA4Ncc0AlfOR2IovqQHJiUyIjG6ypZAu6MnqasIrqqMlFtgbEJqaXEsnIO2TKbNWu7HQ30x8yGnjJ6Nb5rzXQBFvl9kaSYkFlXTKBjCB8Ol0ZaMD4C1NRiIpTd4DxniRpJJv9KC4bvwcni758EFWTAJosocpajC2P9c'
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