import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "@/Login/Login.tsx";


import { Provider } from "react-redux";
import store from "./redux/store.ts";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Login></Login>
      <Toaster />
    </Provider>
  </StrictMode>,
);
