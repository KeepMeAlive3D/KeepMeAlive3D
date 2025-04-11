import service from "@/service/service.ts";

export type BasicAuthResponse = {
  token: string;
  refreshToken: string;
  expiresIn: number;
};

export type User = {
  username: string;
  loginType: string;
};

export function loginBasic(user: string, pass: string) {
  return service.post<BasicAuthResponse>("/api/login/basic", {
    username: user,
    password: pass,
  });
}

export function getCurrentUsername() {
  return service.get<User>("/api/user");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh");
  localStorage.removeItem("token_expire");

  window.location.href = window.location.origin;
}

export function refreshToken(refreshToken: string) {
  return service.post<BasicAuthResponse>(
    "/api/login/refresh",
    {},
    {
      headers: { Authorization: `Bearer ${refreshToken}` },
    }
  );
}

export function registerBasic(user: string, pass: string) {
  return service.post<BasicAuthResponse>("/api/register/basic", {
    username: user,
    password: pass,
  });
}
