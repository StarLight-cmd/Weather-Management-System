import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Register from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/components/Authentication/Register.jsx';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom/vitest';

vi.mock('axios');

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderComponent = () => {
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    axios.post.mockResolvedValue({ data: {} });
  });

  it('renders form inputs and buttons', () => {
    renderComponent();

    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Re-enter Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
  });

  it('shows error message when passwords do not match', async () => {
    renderComponent();

    await userEvent.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.type(screen.getByPlaceholderText('Re-enter Password'), 'wrongpass');

    await userEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(await screen.findByText(/Passwords donot match/i)).toBeInTheDocument();
  });

  it('submits form when passwords match and calls axios.post', async () => {
    renderComponent();

    await userEvent.type(screen.getByPlaceholderText(/Email/i), 'test@example.com');
    await userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    await userEvent.type(screen.getByPlaceholderText('Re-enter Password'), 'password123');

    await userEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(axios.post).toHaveBeenCalledWith('http://localhost:9090/register', {
      email: 'test@example.com',
      password: 'password123',
      RePassword: 'password123',
    });
  });

  it('navigates to login page when Login button is clicked', async () => {
    renderComponent();

    const loginButton = screen.getByRole('button', { name: /Login/i });
    await userEvent.click(loginButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});
