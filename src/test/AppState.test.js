import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AppStateProvider, useAppState } from '../state/AppState.js';
import React from 'react';

// Mock the API service
vi.mock('../services/api.js', () => ({
  login: vi.fn(),
  logout: vi.fn(),
  getProfile: vi.fn(),
  getOrders: vi.fn(),
  getUserData: vi.fn(),
  saveUserData: vi.fn(),
  createOrder: vi.fn(),
}));

// Test component to use the hook
const TestComponent = () => {
  const { 
    currentUser, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart
  } = useAppState();

  return (
    <div>
      <div data-testid="loading">{isLoading ? 'true' : 'false'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="user">{currentUser?.email || 'null'}</div>
      <div data-testid="cart-length">{cart.length}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={() => addToCart({ id: '1', name: 'Product', price: 10 })}>Add to Cart</button>
      <button onClick={() => removeFromCart('1')}>Remove from Cart</button>
      <button onClick={() => updateCartItemQuantity('1', 2)}>Update Quantity</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

describe('AppState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should provide authentication state', () => {
    const { getByTestId } = render(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );

    expect(getByTestId('loading')).toHaveTextContent('true');
    expect(getByTestId('authenticated')).toHaveTextContent('false');
    expect(getByTestId('user')).toHaveTextContent('null');
  });

  it('should handle cart operations', async () => {
    const { getByTestId, getByText } = render(
      <AppStateProvider>
        <TestComponent />
      </AppStateProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(getByTestId('loading')).toHaveTextContent('false');
    });

    // Add item to cart
    getByText('Add to Cart').click();
    await waitFor(() => {
      expect(getByTestId('cart-length')).toHaveTextContent('1');
    });

    // Update quantity
    getByText('Update Quantity').click();
    await waitFor(() => {
      expect(getByTestId('cart-length')).toHaveTextContent('1'); // Still 1 item, but quantity updated
    });

    // Remove from cart
    getByText('Remove from Cart').click();
    await waitFor(() => {
      expect(getByTestId('cart-length')).toHaveTextContent('0');
    });

    // Clear cart
    getByText('Add to Cart').click();
    getByText('Clear Cart').click();
    await waitFor(() => {
      expect(getByTestId('cart-length')).toHaveTextContent('0');
    });
  });

  it('should throw error when useAppState is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow('useAppState must be used within an AppStateProvider');
    
    consoleSpy.mockRestore();
  });
});