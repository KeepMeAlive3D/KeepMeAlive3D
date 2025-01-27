import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Login from "@/Login";
import store from "@/store";
import { Provider } from "react-redux";
import { StrictMode } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

vi.mock("@/components/login-form.tsx", () => {
  return {
    LoginForm: () => <div>Mocked Login Form</div>,
  };
});

describe("Login is displayed if not logged in", () => {
  it("renders the LoginForm component", () => {
    render(
      <StrictMode>
        <Provider store={store}>
          <ToastProvider>
            <Login></Login>
            <Toaster />
          </ToastProvider>
        </Provider>
      </StrictMode>
    );

    // Check if the mocked LoginForm component is rendered
    const loginText = screen.getAllByText("Mocked Login Form");
    expect(loginText);
  });
});
