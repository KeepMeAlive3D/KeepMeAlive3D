import service from "@/service/service.ts";

export function loginOauth() {

}

export function loginBasic(user: string, pass: string) {
    console.debug("here2")
    return service.post("/api/login/basic", {
        username: user,
        password: pass
    })
}