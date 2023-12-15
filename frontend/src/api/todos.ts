export type Todo ={
    id: number,
    user_id: number,
    title: string,
    description: string,
    completed_at: string,
    created_at: string,
    updated_at: string,
    deleted_at: string
}

export type NewTodo = {
    id?: number,
    title: string,
    description: string,
    completed_at?: string
}

const url = "http://127.0.0.1:6969/users/";

export async function getAllTodos(id: string, token: string): Promise<Todo[]>{
    const response = await fetch(url+id+"/todos", {
        mode: "cors",
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
    });
    return await response.json()
}

export async function postTodo(id: string, data: NewTodo, token: string) {
    await fetch(url+id+"/todos", {
        mode: "cors",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    })
}

export async function putTodo(id: string, data: NewTodo, todoId: string, token: string) {
    await fetch(url+id+"/todos/"+todoId, {
        mode: "cors",
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
    })
}
