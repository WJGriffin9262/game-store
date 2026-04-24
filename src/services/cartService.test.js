import {
  addToCart,
  calculateTotal,
  clearCart,
  getCart,
  updateCartQuantity,
} from './cartService';

const STORAGE_KEY = 'gamestore_cart';

describe('cartService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('addToCart adds new item with quantity 1', () => {
    const item = { id: 101, title: 'Neon Racer', price: 29.99 };
    const cart = addToCart(item);

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(1);
    expect(getCart()[0].id).toBe(101);
  });

  test('addToCart increments quantity for existing item', () => {
    const item = { id: 202, title: 'Arcade Fighter', price: 39.99 };
    addToCart(item);
    const cart = addToCart(item);

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(2);
  });

  test('updateCartQuantity never goes below 1', () => {
    addToCart({ id: 303, title: 'Puzzle Orbit', price: 14.99 });
    const cart = updateCartQuantity(303, 0);

    expect(cart[0].quantity).toBe(1);
  });

  test('calculateTotal returns subtotal, tax, and total', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([
      { id: 1, price: 10, quantity: 2 },
      { id: 2, price: 5, quantity: 1 },
    ]));

    const totals = calculateTotal(getCart(), 0.1);
    expect(totals.subtotal).toBe(25);
    expect(totals.tax).toBe(2.5);
    expect(totals.total).toBe(27.5);
  });

  test('clearCart removes all items', () => {
    addToCart({ id: 999, title: 'Test Game', price: 1 });
    const cart = clearCart();

    expect(cart).toEqual([]);
    expect(getCart()).toEqual([]);
  });
});
