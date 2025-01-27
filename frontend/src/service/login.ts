import service from "@/service/service.ts";

export type BasicAuthResponse = {
  token: string;
  refreshToken: string;
  expiresIn: number;
};

export function loginBasic(user: string, pass: string) {
  return service.post<BasicAuthResponse>("/api/login/basic", {
    username: user,
    password: pass,
  });
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
