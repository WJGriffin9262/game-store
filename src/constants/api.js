// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.example.com';

export const API_ENDPOINTS = {
  GAMES: '/games',
  GAME_DETAIL: (id) => `/games/${id}`,
  CART: '/cart',
  CHECKOUT: '/checkout',
};

export const HTTP_TIMEOUT = 10000; // 10 seconds
