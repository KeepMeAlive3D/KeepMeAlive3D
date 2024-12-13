import {describe, expect, it, vi,} from 'vitest'
import {render, screen} from "@testing-library/react";
import Login from "@/Login";
import store from "@/store";
import {Provider} from "react-redux";


vi.mock('@/components/login-form.tsx', () => {
    return {
        LoginForm: () => <div>Mocked Login Form</div>
    };
});

describe('Login is displayed if not logged in', () => {
    it('renders the LoginForm component', () => {
        render(
            <Provider store={store}>
                <Login/>
            </Provider>
        );

        // Check if the mocked LoginForm component is rendered
        const loginText = screen.getAllByText("Mocked Login Form");
        expect(loginText);
    });
});