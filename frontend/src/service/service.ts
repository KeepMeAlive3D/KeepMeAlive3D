import axios from "axios";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 20_000,
});

service.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      if (!localStorage.getItem("token")) {
        // If not logged in the no reload is necessary as the user is already
        // on the login page.
        return Promise.reject(error);
      }

      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
      localStorage.removeItem("token_expire");

      window.location.href = window.location.origin; //refresh window
    }
    return Promise.reject(error);
  }
);

export function setDefaultRequestToken(token: string) {
  service.defaults.headers.common = { Authorization: `bearer ${token}` };
}

export default service;
