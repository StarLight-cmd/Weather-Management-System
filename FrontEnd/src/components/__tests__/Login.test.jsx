import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/components/Authentication/Login.jsx';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom/vitest';

// Mock axios
vi.mock('axios');

// Mock useNavigate
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn((key) => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock geolocation
const mockGeolocation = {
    getCurrentPosition: vi.fn().mockImplementation((success) =>
        success({
            coords: {
                latitude: -29.85,
                longitude: 31.02,
            },
        })
    ),
};

Object.defineProperty(global.navigator, 'geolocation', {
    configurable: true,
    get: () => mockGeolocation,
});

const renderComponent = () => {
    render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
};

describe('Login Component (Mocked)', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        cleanup();
        vi.clearAllMocks();
        useNavigate.mockReturnValue(mockNavigate);
    });

    it('renders login inputs and buttons', () => {
        renderComponent();

        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });

    it('updates form data correctly on input', async () => {
        renderComponent();

        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        await userEvent.type(emailInput, 'test@example.com');
        await userEvent.type(passwordInput, '123456');

        expect(emailInput).toHaveValue('test@example.com');
        expect(passwordInput).toHaveValue('123456');
    });

    it('submits login form for user and navigates to /weather', async () => {
        axios.post.mockResolvedValueOnce({
            data: { email: 'user@example.com', id: 'u123' },
        });

        axios.get.mockResolvedValueOnce({ data: false });

        renderComponent();

        await userEvent.type(screen.getByPlaceholderText(/email/i), 'user@example.com');
        await userEvent.type(screen.getByPlaceholderText(/password/i), 'password');
        await userEvent.click(screen.getByRole('button', { name: /login/i }));

        expect(await screen.findByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(axios.post).toHaveBeenCalledWith('http://localhost:9090/users/login', {
            email: 'user@example.com',
            password: 'password',
        });
        expect(axios.get).toHaveBeenCalledWith('http://localhost:9090/users/u123/isAdmin');
        expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'USER');
        expect(mockNavigate).toHaveBeenCalledWith('/weather', { replace: true });
    });

    it('submits login for admin and navigates to /Country', async () => {
        axios.post.mockResolvedValueOnce({
            data: { email: 'admin@example.com', id: 'a1' },
        });

        axios.get.mockResolvedValueOnce({ data: true });

        renderComponent();

        await userEvent.type(screen.getByPlaceholderText(/email/i), 'admin@example.com');
        await userEvent.type(screen.getByPlaceholderText(/password/i), 'admin123');
        await userEvent.click(screen.getByRole('button', { name: /login/i }));

        expect(await screen.findByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(localStorage.setItem).toHaveBeenCalledWith('userRole', 'ADMIN');
        expect(mockNavigate).toHaveBeenCalledWith('/Country', { replace: true });
    });

    it('shows alert and redirects on 404 user not found', async () => {
        axios.post.mockRejectedValueOnce({ response: { status: 404 } });

        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

        renderComponent();

        await userEvent.type(screen.getByPlaceholderText(/email/i), 'nouser@test.com');
        await userEvent.type(screen.getByPlaceholderText(/password/i), 'nopass');
        await userEvent.click(screen.getByRole('button', { name: /login/i }));

        await screen.findByPlaceholderText(/email/i);

        expect(alertMock).toHaveBeenCalledWith('User not found. Redirecting to registration...');
        expect(mockNavigate).toHaveBeenCalledWith('/register');

        alertMock.mockRestore();
    });

    it('shows general login failure alert on error', async () => {
        axios.post.mockRejectedValueOnce(new Error('Server Down'));

        const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

        renderComponent();

        await userEvent.type(screen.getByPlaceholderText(/email/i), 'error@test.com');
        await userEvent.type(screen.getByPlaceholderText(/password/i), 'errorpass');
        await userEvent.click(screen.getByRole('button', { name: /login/i }));

        await screen.findByPlaceholderText(/email/i);

        expect(alertMock).toHaveBeenCalledWith('Login failed.');

        alertMock.mockRestore();
    });

    it('navigates to forgot-password page when clicked', async () => {
        renderComponent();
        await userEvent.click(screen.getByText(/forgot password/i));
        expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
    });

    it('navigates to register page on register button click', async () => {
        renderComponent();
        await userEvent.click(screen.getByRole('button', { name: /register/i }));
        expect(mockNavigate).toHaveBeenCalledWith('/register');
    });

    it('renders weather data when geolocation and API succeed', async () => {
        const mockWeatherResponse = {
            main: { humidity: 70, temp: 22.7 },
            wind: { speed: 5.3 },
            weather: [{ icon: '10d' }],
            name: 'Durban',
        };

        global.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockWeatherResponse),
            })
        );

        renderComponent();

        const tempElement = await screen.findByText(/22°C/i);
        expect(tempElement).toBeInTheDocument();
        expect(screen.getByText(/Durban/i)).toBeInTheDocument();
        expect(screen.getByText(/Humidity/i)).toBeInTheDocument();
        expect(screen.getByText(/Wind Speed/i)).toBeInTheDocument();
    });
});
