import axios from "axios";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 20_000,
});

service.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("token_expire");

      window.location.href = window.location.origin; //refresh window
    }
  }
);

export function setDefaultRequestToken(token: string) {
  service.defaults.headers.common = { Authorization: `bearer ${token}` };
}

export default service;
