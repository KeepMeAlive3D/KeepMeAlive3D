import {useState} from 'react'
import App from "@/App.tsx";
import {LoginForm} from "@/components/login-form.tsx";
import {refreshToken} from "@/service/login.ts";

function Login() {
    const [authenticated, login] = useState(false)

    const token = localStorage.getItem("token")
    const refresh = localStorage.getItem("refresh")
    const expiration = Number(localStorage.getItem("token_expire"))

    if(token !== null && refresh !== null && Date.now().valueOf() < expiration * 1000 - 1000*60*60) {
        refreshToken(refresh).then(response => {
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("refresh", response.data.refreshToken)
            localStorage.setItem("token_expire", response.data.expiresIn.toString())

            login(true)
        })
    } else if(token !== null) {
        login(true)
    }

    if(authenticated) {
        return (
            <App></App>
        )
    } else {
        return (
            <LoginForm setAuth={login}></LoginForm>
        )
    }

}

export default Login
