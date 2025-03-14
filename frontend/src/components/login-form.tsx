import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useState } from "react";
import { loginBasic, registerBasic } from "@/service/login.ts";
import { Form } from "@/components/ui/form.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast.ts";
import { setDefaultRequestToken } from "@/service/service.ts";
import useLocalStorage from "@/hooks/localstorage.ts";
import { RestErrorInfo } from "@/service/error.ts";

export function LoginForm({
  setAuth,
}: {
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const [, updateToken] = useLocalStorage("token", "");
  const [, updateRefreshToken] = useLocalStorage("refresh", "");
  const [, updateExpiration] = useLocalStorage("token_expire", "");

  function handleBasicLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const action = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("name");

    if (action === "login") {
      login();
    } else if (action === "register") {
      register();
    } else {
      console.error("Incorrect submit name");
    }
  }

  function register() {
    registerBasic(username, password)
      .then(() => {
        toast({
          variant: "default",
          title: "Successfully Registered!",
          description: "The account has been registered and logged in directly.",
        });
        //If successfully, then login directly
        login();
      })
  }

  function login() {
    loginBasic(username, password)
      .then((response) => {
        updateToken(response.data.token);
        updateRefreshToken(response.data.refreshToken);
        updateExpiration(response.data.refreshToken.toString());
        setDefaultRequestToken(response.data.token);
        setAuth(true);
      })
      .catch(error  => {
        const parsed = error.data as RestErrorInfo
        toast({
          variant: "destructive",
          title: parsed.name,
          description: parsed.message,
        })
      })
  }

  const formSchema = z.object({
    username: z.string().min(2).max(50),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  return (
    <Card className="m-auto max-w-sm">
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

              <Button type="submit" name="login" className="w-full">
                Login
              </Button>
              <Button variant="outline" name="register" className="w-full">
                Register
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
