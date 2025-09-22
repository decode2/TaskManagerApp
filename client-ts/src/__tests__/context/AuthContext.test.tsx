import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';

// Mock the auth service
jest.mock('../../services/authService');
const mockAuthService = authService as jest.Mocked<typeof authService>;

// Test component to access context
const TestComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.email : 'No user'}</div>
      <div data-testid="is-authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage
    localStorage.clear();
  });

  it('should provide initial state with no user', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('is-authenticated')).toHaveTextContent('false');
  });

  it('should login user successfully', async () => {
    const mockUser = { email: 'test@example.com', token: 'mock-token' };
    mockAuthService.login.mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    
    await act(async () => {
      loginButton.click();
    });

    await act(async () => {
      // Wait for async operations
    });

    expect(mockAuthService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('should logout user and clear token', async () => {
    // Set initial token
    localStorage.setItem('token', 'mock-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const logoutButton = screen.getByText('Logout');
    
    await act(async () => {
      logoutButton.click();
    });

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should restore user from token on mount', async () => {
    // Mock token in localStorage
    const mockToken = 'valid-token';
    localStorage.setItem('token', mockToken);

    // Mock token validation
    mockAuthService.validateToken.mockResolvedValue({
      email: 'test@example.com',
      token: mockToken
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      // Wait for token validation
    });

    expect(mockAuthService.validateToken).toHaveBeenCalledWith(mockToken);
  });

  it('should clear invalid token on mount', async () => {
    // Mock invalid token in localStorage
    localStorage.setItem('token', 'invalid-token');
    mockAuthService.validateToken.mockRejectedValue(new Error('Invalid token'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      // Wait for token validation
    });

    expect(localStorage.getItem('token')).toBeNull();
  });
});
