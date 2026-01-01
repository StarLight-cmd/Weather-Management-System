import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DisasterAlert from '../Alert';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';

// Mock useNavigate from react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const renderComponent = (props = {}) => {
  render(
    <BrowserRouter>
      <DisasterAlert {...props} />
    </BrowserRouter>
  );
};

describe('DisasterAlert API call tests', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    localStorage.setItem('userEmail', 'testuser@example.com');

    global.fetch = vi.fn((url) => {
      if (url === 'https://ipapi.co/json/') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ country: 'FA' }),
        });
      }
      if (url.startsWith('http://localhost:9090/countries/')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              policeNo: '000',
              firedepNo: '111',
              ambulanceNo: '222',
            }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  it('calls ipapi API once', async () => {
    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://ipapi.co/json/');
    });

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('ipapi.co/json'));
  });

  it('calls emergency numbers with correct country code', async () => {
    renderComponent();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(global.fetch).toHaveBeenCalledWith('http://localhost:9090/countries/FA');
    });
  });

  it('renders loading state before emergency numbers load', () => {
    global.fetch = vi.fn((url) => {
      if (url === 'https://ipapi.co/json/') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ country: 'FA' }),
        });
      }
      if (url.startsWith('http://localhost:9090/countries/')) {
        return new Promise(() => {}); // Simulate pending fetch
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    renderComponent();

    expect(screen.getByText(/Loading emergency contacts/)).toBeInTheDocument();
  });

  it('renders basic UI elements', () => {
    renderComponent();

    expect(screen.getByText(/Hi testuser/i)).toBeInTheDocument();
    expect(screen.getByText(/Country Code:/i)).toBeInTheDocument();
    expect(screen.getByText(/Disaster Alert/i)).toBeInTheDocument();
    expect(screen.getByText(/Emergency Numbers/i)).toBeInTheDocument();
  });

  it('shows no immediate risk for normal weather', async () => {
    renderComponent({ temperature: 25, humidity: 50, wind: 10 });

    expect(await screen.findByText(/No immediate natural disaster risk/i)).toBeInTheDocument();
    expect(screen.getByText(/Stay informed and monitor weather updates/i)).toBeInTheDocument();
  });
});
