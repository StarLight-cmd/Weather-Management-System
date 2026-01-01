import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Country from '../Country/Country';
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

const renderComponent = () => {
  render(
    <BrowserRouter>
      <Country />
    </BrowserRouter>
  );
};

describe('Country Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  it('renders main UI elements', () => {
    renderComponent();

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Country Code/i)).toBeInTheDocument();
    expect(screen.getByText(/Country Details/i)).toBeInTheDocument();
  });

  it('updates country code input correctly', async () => {
    renderComponent();
    const input = screen.getByPlaceholderText(/Enter Country Code/i);

    await userEvent.type(input, 'US');
    expect(input).toHaveValue('US');
  });

  it('fetches and displays country data on search success', async () => {
    const mockCountry = {
      policeNo: '100',
      firedepNo: '200',
      ambulanceNo: '300',
    };
    axios.get.mockResolvedValueOnce({ data: mockCountry });

    renderComponent();

    await userEvent.type(screen.getByPlaceholderText(/Enter Country Code/i), 'US');
    await userEvent.click(screen.getByAltText('Search'));

    expect(await screen.findByText(mockCountry.policeNo)).toBeInTheDocument();
    expect(screen.getByText(mockCountry.firedepNo)).toBeInTheDocument();
    expect(screen.getByText(mockCountry.ambulanceNo)).toBeInTheDocument();
  });

  it('enables editing country fields on Edit click', async () => {
    const mockCountry = {
      policeNo: '100',
      firedepNo: '200',
      ambulanceNo: '300',
    };
    axios.get.mockResolvedValueOnce({ data: mockCountry });

    renderComponent();

    await userEvent.type(screen.getByPlaceholderText(/Enter Country Code/i), 'US');
    await userEvent.click(screen.getByAltText('Search'));

    await userEvent.click(await screen.findByText('Edit'));

    expect(screen.getByDisplayValue(mockCountry.policeNo)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockCountry.firedepNo)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockCountry.ambulanceNo)).toBeInTheDocument();
  });

  it('deletes country and clears data on Delete click', async () => {
    const mockCountry = {
      policeNo: '100',
      firedepNo: '200',
      ambulanceNo: '300',
    };
    axios.get.mockResolvedValueOnce({ data: mockCountry });
    axios.delete.mockResolvedValueOnce({});

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    renderComponent();

    await userEvent.type(screen.getByPlaceholderText(/Enter Country Code/i), 'US');
    await userEvent.click(screen.getByAltText('Search'));

    const deleteBtn = await waitFor(() => screen.getByRole('button', { name: /delete/i }));
    await userEvent.click(deleteBtn);

    expect(axios.delete).toHaveBeenCalledWith('http://localhost:9090/countries/US');

    alertSpy.mockRestore();
  });
});
