import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LoginForm } from '../../components/LoginForm';
import { authService } from '../../services/authService';

// Mock the auth service
jest.mock('../../services/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

describe('LoginForm', () => {
  const mockOnLoginSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form fields', () => {
    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    const mockUser = { email: 'test@example.com', token: 'mock-token' };
    mockAuthService.login.mockResolvedValue(mockUser);

    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'password123' } 
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockAuthService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(mockOnLoginSuccess).toHaveBeenCalledWith(mockUser);
    });
  });

  it('should show error message on login failure', async () => {
    mockAuthService.login.mockRejectedValue(new Error('Invalid credentials'));

    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'wrongpassword' } 
    });

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    expect(mockOnLoginSuccess).not.toHaveBeenCalled();
  });

  it('should show validation error for empty email', async () => {
    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

    // Try to submit without email
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should show loading state during login', async () => {
    mockAuthService.login.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ email: 'test@example.com', token: 'token' }), 100))
    );

    render(<LoginForm onLoginSuccess={mockOnLoginSuccess} />);

    // Fill and submit form
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'password123' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check loading state
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /logging in/i })).toBeDisabled();
  });
});
