import {useEffect, useState} from 'react'
import App from "@/App.tsx";
import {LoginForm} from "@/components/login-form.tsx";
import {refreshToken} from "@/service/login.ts";
import {setDefaultRequestToken} from "@/service/service.ts";
import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import {AppSidebar} from "@/sidebar/AppSidebar.tsx";

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
            <SidebarProvider>
                <AppSidebar/>
                <main className="w-full">
                    <App></App>
                </main>
            </SidebarProvider>

        )
    } else {
        return (
            <LoginForm setAuth={login}></LoginForm>
        )
    }

}

export default Login
