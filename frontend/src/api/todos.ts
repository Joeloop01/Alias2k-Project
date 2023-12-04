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

const headers = {
    "Content-Type": "application/json",
    'Authorization': 'Bearer e5f28e63-77de-11ee-86fe-38ca84c6d8be:eea8f3274225bdbce6c1dc3010f6dc16f2cf6aaae8ec7d990ad83d4dbadbb7890a3b31d981d465231ec322d6c5430442798b2536fee5729b1950694f7179e64f'
};

const url = "http://127.0.0.1:6969/users/";

export async function getAllTodos(id: string): Promise<Todo[]>{
    const response = await fetch(url+id+"/todos", {
        mode: "cors",
        method: "GET",
        headers
    });
    return await response.json()
}

export async function postTodo(id: string, data: NewTodo) {
    await fetch(url+id+"/todos", {
        mode: "cors",
        method: "POST",
        headers,
        body: JSON.stringify(data)
    })
}

export async function putTodo(id: string, data: NewTodo, todoId: string) {
    await fetch(url+id+"/todos/"+todoId, {
        mode: "cors",
        method: "PUT",
        headers,
        body: JSON.stringify(data)
    })
}
