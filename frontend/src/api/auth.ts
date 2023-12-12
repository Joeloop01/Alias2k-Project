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
    "Authorization": "Bearer 13565bea-941e-11ee-b7e0-38ca84c6d8be:5d235688b3b5049b361a0fe3d60f9233aec4afbd0de11c95337bcfeabfa538076f9732068fc3831104bd774b70f62cdf6755df1ed5301daa632e52003e935cc5"
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
            "Authorization": "Bearer "+refresh_token
        }
    });
    return await response.json()
}