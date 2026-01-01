import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Weather from 'C:/Users/sashe/OneDrive/Desktop/Weather-App/src/components/Dashboard/Weather.jsx';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MemoryRouter } from 'react-router-dom';
import { prettyDOM } from '@testing-library/react';

// Mock fetch
global.fetch = vi.fn();

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
};
Object.defineProperty(global.navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});
vi.spyOn(global, 'fetch');

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});


const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Weather Component (Mocked)', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders Weather Dashboard title and logo', () => {
    renderWithRouter(<Weather />);
    expect(screen.getByText(/Weather DashBoard/i)).toBeInTheDocument();
    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('shows warning when searching empty input', async () => {
    renderWithRouter(<Weather />);
    const searchBtn = screen.getByAltText('Search');
    await userEvent.click(searchBtn);
    expect(await screen.findByText(/Please enter a location/i)).toBeInTheDocument();
  });

  it('shows error on invalid location', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ results: [] }),
    });

    renderWithRouter(<Weather />);
    const input = screen.getByPlaceholderText(/search for location/i);
    await userEvent.type(input, 'invalid');

    const searchBtn = screen.getByAltText('Search');
    await userEvent.click(searchBtn);

    expect(await screen.findByText(/Invalid location/i)).toBeInTheDocument();
  });

  it('calls fetch API when searching for location', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({ results: [{ name: 'Durban' }] }),
    });

    renderWithRouter(<Weather />);

    const input = screen.getByPlaceholderText(/search for location/i);
    await userEvent.type(input, 'Durban');

    const searchBtn = screen.getByAltText('Search');
    await userEvent.click(searchBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
