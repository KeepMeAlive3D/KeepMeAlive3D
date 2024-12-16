import {useEffect, useState} from 'react'
import {LoginForm} from "@/components/login-form.tsx";
import {refreshToken} from "@/service/login.ts";
import {setDefaultRequestToken} from "@/service/service.ts";
import useLocalStorage from "@/hooks/localstorage.ts";
import {AppModelHandling} from "@/components/app-model-handling.tsx";

function Login() {
    const [authenticated, login] = useState(false)

    const [token, updateToken] = useLocalStorage("token", "")
    const [refresh, updateRefreshToken] = useLocalStorage("refresh", "")
    const [expiration, updateExpiration] = useLocalStorage("token_expire", "")

    useEffect(() => {
        if(token !== "" && refresh !== "" && expiration !== "" && Date.now().valueOf() > Number(expiration) * 1000 - 1000*60*60) {
            refreshToken(refresh).then(response => {
                updateToken(response.data.token)
                updateRefreshToken(response.data.refreshToken)
                updateExpiration(response.data.expiresIn.toString())

                setDefaultRequestToken(response.data.token)
                login(true)
            })
        } else if(token !== "") {
            setDefaultRequestToken(token)
            login(true)
        }
    }, [token, refresh, expiration, updateToken, updateRefreshToken, updateExpiration])

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
