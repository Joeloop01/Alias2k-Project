import { useState, useEffect } from "react";
import { z } from "zod";
import './Users.css';
import { USER_SCHEMA } from "./USER_SCHEMA";

type User = z.output<typeof USER_SCHEMA>;

function UsersPage() {
    const url = "http://localhost:6969/users";
    const [data, sedivata] = useState<User[] | undefined>();

    const fetchInfo = () => {
        return fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                'Authorization': `Bearer e5f28e63-77de-11ee-86fe-38ca84c6d8be:eea8f3274225bdbce6c1dc3010f6dc16f2cf6aaae8ec7d990ad83d4dbadbb7890a3b31d981d465231ec322d6c5430442798b2536fee5729b1950694f7179e64f`
            }
        })
            .then((res) => res.json())
            .then((d) => USER_SCHEMA.array().parse(d))
            .then((d) => sedivata(d))
    }

    useEffect(() => {
        fetchInfo();
    }, [])

    return <div className="container">{!!data && <UserTable users={data} />}</div>
}

export default UsersPage;


type UserTableProps = {
    users: User[],
}
function UserTable({ users }: UserTableProps) {
    return (
        <div className="flex">
            {users.map((user) =>
                <UserRow key={user.toString()} user={user} />
            )}
        </div>
    )
}

function UserRow({ user }: { user: User }) {
    const userUrl = window.location.href + "/" + user.id;
    return (
        <a href={userUrl}>
            <div className="card">
                <h3>
                    {user.name}
                </h3>
                <div>
                    <p>
                        <div>id: {user.id}</div>
                        <div>email: {user.email}</div>
                        <div>created at: {user.created_at}</div>
                        <div>updated at: {user.updated_at}</div>
                    </p>
                </div>

                <div className="go-corner">
                    <div className="go-arrow">
                        →
                    </div>
                </div>
            </div>
        </a>
    )
}