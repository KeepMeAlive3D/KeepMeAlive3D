import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {FormEvent, useState} from "react";
import {loginBasic} from "@/service/login.ts";
import {Form} from "@/components/ui/form.tsx";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {useToast} from "@/hooks/use-toast.ts";
import {setDefaultRequestToken} from "@/service/service.ts";
import useLocalStorage from "@/hooks/localstorage.ts";

export function LoginForm({setAuth}: { setAuth: React.Dispatch<React.SetStateAction<boolean>> }) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const {toast} = useToast()

    const [, updateToken] = useLocalStorage("token", "")
    const [, updateRefreshToken] = useLocalStorage("refresh", "")
    const [, updateExpiration] = useLocalStorage("token_expire", "")

    function handleBasicLogin(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        loginBasic(username, password).then((response) => {
            updateToken(response.data.token)
            updateRefreshToken(response.data.refreshToken)
            updateExpiration(response.data.refreshToken.toString())
            setDefaultRequestToken(response.data.token)
            setAuth(true)
        }, err => {
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request."
            })
            console.debug(err)
            console.error(err)
        })
    }

    const formSchema = z.object({
        username: z.string().min(2).max(50),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your username below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>

                    <form onSubmit={(event) => handleBasicLogin(event)}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="username"
                                    placeholder="m@example.com"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            <Button variant="outline" className="w-full">
                                Login with Google
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                    </div>
                </Form>
            </CardContent>
        </Card>
    )
}
