import {useEffect, useState} from 'react'
import {LoginForm} from "@/components/login-form.tsx";
import {refreshToken} from "@/service/login.ts";
import {setDefaultRequestToken} from "@/service/service.ts";
import {AppModelHandling} from "@/components/app-model-handling.tsx";

function Login() {
    const [authenticated, login] = useState(false)

    const token = localStorage.getItem("token")
    const refresh = localStorage.getItem("refresh")
    const expiration = Number(localStorage.getItem("token_expire"))

    const getTokenByRefresh = (refresh: string) => {
        refreshToken(refresh).then(response => {
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("refresh", response.data.refreshToken)
            localStorage.setItem("token_expire", response.data.expiresIn.toString())

            setDefaultRequestToken(response.data.token)
            login(true)
        })
    }

    useEffect(() => {
        if(token !== null && refresh !== null && Date.now().valueOf() < expiration * 1000 - 1000*60*60) {
            getTokenByRefresh(refresh)
        } else if(token !== null) {
            setDefaultRequestToken(token)
            login(true)
        }
    }, [expiration, refresh, token]);


    if(authenticated) {
        return (
            <AppModelHandling></AppModelHandling>
        )
    } else {
        return (
            <LoginForm setAuth={login} key="login"></LoginForm>
        )
    }

}

export default Login
