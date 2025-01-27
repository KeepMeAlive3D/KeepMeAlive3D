import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "@/Login.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import { ToastProvider } from "@/components/ui/toast.tsx";
import { Provider } from "react-redux";
import store from "./store";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <ToastProvider>
          <Login></Login>
          <Toaster />
        </ToastProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
