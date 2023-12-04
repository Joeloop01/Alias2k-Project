import axios from "axios";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AsyncUserFetch() {
    return (
        <QueryClientProvider client={queryClient}>
            <GetAll />
        </QueryClientProvider>
    )
}
type User = {
    id: number,
    name: string,
    email: string,
    created_at: string,
    updated_at: string,
}

async function fetchAll() {
    const result = await axios.get<User[]>("http://127.0.0.1:6969/users", {
        headers: {
            Authorization:
                "Bearer e5f28e63-77de-11ee-86fe-38ca84c6d8be:eea8f3274225bdbce6c1dc3010f6dc16f2cf6aaae8ec7d990ad83d4dbadbb7890a3b31d981d465231ec322d6c5430442798b2536fee5729b1950694f7179e64f",
        },
    });
    return result.data;
}

function GetAll() {
    const { isLoading, isError, data } = useQuery({
        queryKey: ['getAll'], queryFn: fetchAll
    })
    if (isLoading) {
        return <span>Loading</span>
    }

    if (isError) {
        return <span>Error</span>
    }



    return <div className=" w-full max-w-max m-auto">{!!data && <Users users={data} />}</div>
}

function Users({ users }: { users: User[] }) {
    return (
        <div className="flex justify-center items-between flex-wrap">
            {users.map((user) =>
                <UserCard key={user.toString()} user={user} />
            )}
        </div>
    )
}

function UserCard({ user }: { user: User }) {
    const user_path = window.location.href + "/" + user.id;
    return (
        <a href={user_path}>
            <div className="group block relative max-w-xs bg-white rounded p-8 m-3 no-underline z-0 overflow-hidden before:absolute before:-z-10 before:-top-3 before:-right-3 before:bg-teal-300 before:h-8 before:w-8 before:rounded-3xl before:origin-center before:scale-100 before:transform before:ease-in-out before:duration-200 before:hover:scale-[30]">
                <h3 className=" text-black text-2xl leading-6 font-bold mb-1 group-hover:text-white group-hover:transition-all group-hover:duration-300 group-hover:ease-in-out">
                    {user.name}
                </h3>
                <div>
                    <p className=" text-gray-400 text-base leading-6 font-bold mb-16 group-hover:text-white group-hover:transition-all group-hover:duration-300 group-hover:ease-in-out">
                        <div>id: {user.id}</div>
                        <div>email: {user.email}</div>
                        <div>created at: {user.created_at}</div>
                        <div>updated at: {user.updated_at}</div>
                    </p>
                </div>

            </div>
        </a>
    )
}