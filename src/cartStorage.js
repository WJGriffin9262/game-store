/**
 * Cart persistence in localStorage — kept separate from React so it stays easy to test.
 * (Tutorial-style: one small plain JS module instead of a services/ folder.)
 */
const CART_STORAGE_KEY = 'gamestore_cart';
const TAX_RATE = 0.0825;

export { TAX_RATE };

export function getCart() {
  const cart = localStorage.getItem(CART_STORAGE_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function addToCart(item) {
  const cart = getCart();
  const existingItem = cart.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  return cart;
}

export function removeFromCart(itemId) {
  const cart = getCart();
  const filtered = cart.filter((item) => item.id !== itemId);
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
}

export function updateCartQuantity(itemId, quantity) {
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === itemId);

  if (item) {
    item.quantity = Math.max(1, quantity);
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  return cart;
}

export function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  return [];
}

export function calculateTotal(cart, taxRate = TAX_RATE) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * taxRate;
  const total = subtotal + tax;
  return { subtotal, tax, total };
}
