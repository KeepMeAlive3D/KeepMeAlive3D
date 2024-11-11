import {useState} from 'react'
import App from "@/App.tsx";
import {LoginForm} from "@/components/login-form.tsx";

function Login() {
    const [authenticated, login] = useState(false)

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
