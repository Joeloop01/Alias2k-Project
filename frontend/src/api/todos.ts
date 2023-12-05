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
    'Authorization': 'Bearer 9ebc34c3-935a-11ee-aed3-38ca84c6d8be:2a98d9f1d0fb8388a40b33ccdf5abbb08fca04fc0d91f74ebc6ab27b23abfcc51b5f7e62096d54b00073e9b0623c72ea5525724031c23d9814c9ecbd74e8f690'
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
