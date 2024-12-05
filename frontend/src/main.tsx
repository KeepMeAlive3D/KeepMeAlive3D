import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import Login from "@/Login.tsx";
import {Toaster} from "@/components/ui/toaster.tsx";
import {ToastProvider} from "@/components/ui/toast.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ToastProvider>
            <Login></Login>
            <Toaster/>
        </ToastProvider>
    </StrictMode>,
)
