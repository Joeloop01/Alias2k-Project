import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const NEW_USER_DATA = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
})

type NewUserData = z.output<typeof NEW_USER_DATA>;

function NewUser() {
    const { register, handleSubmit } = useForm<NewUserData>({ resolver: zodResolver(NEW_USER_DATA) });

    const url = "http://localhost:6969/users";
    const postInfo = (data: NewUserData) => {
        return fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer e5f28e63-77de-11ee-86fe-38ca84c6d8be:eea8f3274225bdbce6c1dc3010f6dc16f2cf6aaae8ec7d990ad83d4dbadbb7890a3b31d981d465231ec322d6c5430442798b2536fee5729b1950694f7179e64f`
            },
            body: JSON.stringify(data)
        });
    }

    return (
        <form onSubmit={handleSubmit(postInfo)}>
            <label>Name
                <input {...register("name")} />
            </label>
            <label>Email
                <input {...register("email")} />
            </label>
            <label>Password
                <input {...register("password")} />
            </label>
            <input type="submit" />
        </form>
    )
}

export default NewUser;