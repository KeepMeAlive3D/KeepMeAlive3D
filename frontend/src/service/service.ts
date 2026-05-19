import axios from "axios";
import { toast } from "sonner";
import type { RestErrorInfo } from "@/service/error.ts";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL ?? window.origin,
  timeout: 20_000,
});

service.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (localStorage.getItem("token")) {
        //only redirect & delete if the user was logged in
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        localStorage.removeItem("token_expire");

        window.location.href = window.location.origin; //refresh window
      }
    }
    if (error.response !== undefined) {
      const errInfo = error.response.data as RestErrorInfo;
      toast.error(errInfo.name, {
        description: errInfo.message
      })
    } else {
      toast.error("Request Failed", {
        description: error.message
      })
    }
    console.error(`Middleware error detail for: ${error.message}`);
    console.error(error);
    return Promise.reject(error);
  }
);

export function setDefaultRequestToken(token: string) {
  service.defaults.headers.common = { Authorization: `bearer ${token}` };
}

export default service;
