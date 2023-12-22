import type { User } from "./users"

export type Login = {
    email: string
    password: string
  }

export type Token ={
    token: string
    refresh_token: string
    expires_in: number
}

const headers_signin = {
    "Content-Type": "application/json",
    "Authorization": "Bearer 34393e2c-9fe6-11ee-b215-38ca84c6d8be:02d7e0fe824a812a2a4efb6a5027734b5c90bef9b2abd55b35665828ab4d6d127e3c4f3f389888c52a2492629b6a455d8cd22192ee7091ef67c6546cd3546f57"
};

  const url = "http://127.0.0.1:6969/auth";

export async function signin(login: Login): Promise<Token> {
    const response =  await fetch(url + "/signin", {
        mode: "cors",
        method:"ANY",
        body: JSON.stringify(login),
        headers: headers_signin
    });
    return await response.json()
}

export async function refresh_token(refresh_token:string): Promise<Token>{
    const response =  await fetch(url + "/refreshtoken", {
        mode: "cors",
        method:"ANY",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+ refresh_token
        }
    });
    return await response.json()
}

export async function user_info(token: string): Promise<User>{
    const response = await fetch(url + "/userinfo", {
        mode: "cors",
        method:"GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer "+ token
        }
    })
    return await response.json()
}