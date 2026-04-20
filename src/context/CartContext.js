import { createContext, useState, useCallback, useEffect } from 'react';
import * as cartService from '../services/cartService';

export const CartContext = createContext();

/**
 * CartProvider - Manages shopping cart state and operations
 * 
 * Features:
 * - Add/remove items from cart
 * - Update item quantities
 * - Persist cart to localStorage
 * - Calculate totals with tax
 * - Clear entire cart
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return cartService.getCart();
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Warn user if leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges && cart.length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, cart.length]);

  /**
   * Add item to cart
   * Increments quantity if item already exists
   */
  const addItem = useCallback((item) => {
    try {
      if (!item || !item.id) {
        throw new Error('Invalid item provided to addItem');
      }

      const updatedCart = cartService.addToCart(item);
      setCart(updatedCart);
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  }, []);

  /**
   * Remove item from cart by ID
   */
  const removeItem = useCallback((itemId) => {
    try {
      if (!itemId) {
        throw new Error('Invalid item ID provided to removeItem');
      }

      const updatedCart = cartService.removeFromCart(itemId);
      setCart(updatedCart);
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }, []);

  /**
   * Update quantity of an item in cart
   * Minimum quantity is 1
   */
  const updateQuantity = useCallback((itemId, quantity) => {
    try {
      if (!itemId || typeof quantity !== 'number') {
        throw new Error('Invalid parameters provided to updateQuantity');
      }

      if (quantity < 1) {
        console.warn('Quantity must be at least 1, removing item instead');
        return removeItem(itemId);
      }

      const updatedCart = cartService.updateCartQuantity(itemId, quantity);
      setCart(updatedCart);
      setHasUnsavedChanges(true);
    } catch (error) {
      console.error('Error updating item quantity:', error);
      throw error;
    }
  }, [removeItem]);

  /**
   * Clear entire cart
   */
  const clearAllItems = useCallback(() => {
    try {
      const updatedCart = cartService.clearCart();
      setCart(updatedCart);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }, []);

  /**
   * Get a specific item from cart
   */
  const getCartItem = useCallback((itemId) => {
    return cart.find(item => item.id === itemId) || null;
  }, [cart]);

  /**
   * Check if item is in cart
   */
  const isItemInCart = useCallback((itemId) => {
    return cart.some(item => item.id === itemId);
  }, [cart]);

  /**
   * Calculate totals
   */
  const { subtotal, tax, total } = cartService.calculateTotal(cart);

  /**
   * Context value object
   */
  const value = {
    // Cart data
    cart,
    itemCount: cart.length,
    subtotal,
    tax,
    total,
    isEmpty: cart.length === 0,

    // Cart operations
    addItem,
    removeItem,
    updateQuantity,
    clearAllItems,
    getCartItem,
    isItemInCart,

    // State
    hasUnsavedChanges,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
