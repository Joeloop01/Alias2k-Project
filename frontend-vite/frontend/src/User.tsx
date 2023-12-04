import { useState, useEffect } from "react";
import { z } from "zod";
import './User.css';
import { useParams } from 'react-router-dom';
import { USER_SCHEMA } from "./USER_SCHEMA";

export const TODOS_SCHEMA = z.object({
    id: z.number(),
    user_id: z.number(),
    title: z.string(),
    description: z.string(),
    completed_at: z.string(),
    created_at: z.string(),
    updated_at: z.string()
});

type Todos = z.output<typeof TODOS_SCHEMA>;

type User = z.output<typeof USER_SCHEMA>;

function UserPage() {
    return (
        <main>
            <UserProfile />
            <Todos />
        </main>
    )
}

export default UserPage;

function UserProfile() {
    const params = useParams();
    const url = `http://localhost:6969/users/${params.id}`;
    const [data, setData] = useState<User | undefined>();

    const fetchInfo = () => {
        return fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': `Bearer e5f28e63-77de-11ee-86fe-38ca84c6d8be:eea8f3274225bdbce6c1dc3010f6dc16f2cf6aaae8ec7d990ad83d4dbadbb7890a3b31d981d465231ec322d6c5430442798b2536fee5729b1950694f7179e64f`
            }
        })
            .then((res) => res.json())
            .then((d) => USER_SCHEMA.parse(d))
            .then((d) => setData(d))
    }

    useEffect(() => {
        fetchInfo();
    }, [])

    return (
        <div className="card-wrap">
            <div className="profile_pic-wrap">
                <img src="https://picsum.photos/150/150" alt="" />
            </div>
            <div className="info-wrap">
                <h1 className="user-name">{data?.name}</h1>
                <p>Email: {data?.email}</p>
                <p>Id: {data?.id}</p>
                <p>Created at: {data?.created_at}</p>
                <p>Updated at: {data?.updated_at}</p>
            </div>
        </div>
    )
}



function Todos() {
    const [data, setData] = useState<Todos[] | undefined>();
    const params = useParams();
    const url = `http://localhost:6969/users/${params.id}/todos`;

    const fetchInfo = () => {
        return fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': `Bearer e5f28e63-77de-11ee-86fe-38ca84c6d8be:eea8f3274225bdbce6c1dc3010f6dc16f2cf6aaae8ec7d990ad83d4dbadbb7890a3b31d981d465231ec322d6c5430442798b2536fee5729b1950694f7179e64f`
            }
        })
            .then((res) => res.json())
            .then((d) => setData(d))
    }

    useEffect(() => {
        fetchInfo();
    }, [])

    return <div>{!!data && <TodosTable todos={data} />}</div>
}

type TodosTableProps = {
    todos: Todos[],
}

function TodosTable({ todos }: TodosTableProps) {
    return (
        <table>
            <tr>
                <th>id</th>
                <th>title</th>
                <th>description</th>
                <th>completed at</th>
                <th>created at</th>
                <th>updated at</th>

            </tr>
            {todos.map((todo) =>
                <TodosRow key={todo.toString()} todo={todo} />
            )}

        </table>
    )
}

function TodosRow({ todo }: { todo: Todos }) {
    return (
        <tr>
            <td>{todo.id}</td>
            <td>{todo.title}</td>
            <td>{todo.description}</td>
            <td>{todo.completed_at}</td>
            <td>{todo.created_at}</td>
            <td>{todo.updated_at}</td>
        </tr>
    )
}

