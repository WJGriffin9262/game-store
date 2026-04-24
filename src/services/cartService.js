import { TAX_RATE } from '../constants';

const CART_STORAGE_KEY = 'gamestore_cart';

/**
 * Get cart from localStorage
 * @returns {Array} Cart items
 */
export const getCart = () => {
  const cart = localStorage.getItem(CART_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
};

/**
 * Add item to cart
 * @param {Object} item - Game object
 */
export const addToCart = (item) => {
  const cart = getCart();
  const existingItem = cart.find(cartItem => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  return cart;
};

/**
 * Remove item from cart
 * @param {number} itemId - Game ID
 */
export const removeFromCart = (itemId) => {
  const cart = getCart();
  const filtered = cart.filter(item => item.id !== itemId);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};

/**
 * Update cart item quantity
 * @param {number} itemId - Game ID
 * @param {number} quantity - New quantity
 */
export const updateCartQuantity = (itemId, quantity) => {
  const cart = getCart();
  const item = cart.find(cartItem => cartItem.id === itemId);

  if (item) {
    item.quantity = Math.max(1, quantity);
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  return cart;
};

/**
 * Clear entire cart
 */
export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
  return [];
};

/**
 * Calculate cart total
 * @param {Array} cart - Cart items
 * @returns {Object} Subtotal, tax, total
 */
export const calculateTotal = (cart, taxRate = TAX_RATE) => {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return { subtotal, tax, total };
};
