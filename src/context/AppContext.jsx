/**
 * Single app context: games list, cart, and toast.
 * Keeps beginner-friendly "one provider" pattern instead of multiple contexts.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import * as cartStorage from '../cartStorage';
import { gamesService } from '../gamesApi';

const AppContext = createContext(null);

const THEME_STORAGE_KEY = 'game-store-theme';

function readStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* ignore */
  }
  return null;
}

function preferredSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function initialTheme() {
  return readStoredTheme() ?? preferredSystemTheme();
}

const MOCK_GAMES = [
  {
    id: 1,
    title: 'Cyber Quest 2077',
    price: 59.99,
    genre: 'Action RPG',
    developer: 'Cyber Studios',
    rating: 4.5,
    description:
      'An immersive cyberpunk RPG set in a dystopian future. Explore neon-lit cities, hack corporate systems, and uncover dark conspiracies in this groundbreaking adventure.',
    releaseDate: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X'],
    metacritic: 87,
    playtime: 12,
  },
  {
    id: 2,
    title: 'Puzzle Master Pro',
    price: 24.99,
    genre: 'Puzzle',
    developer: 'Brain Games Inc',
    rating: 4.8,
    description:
      'Challenge your mind with over 500 hand-crafted puzzles. From logic grids to spatial reasoning challenges, this game will test your problem-solving skills like never before.',
    releaseDate: '2024-02-10',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400',
    platforms: ['PC', 'Mobile', 'Nintendo Switch'],
    metacritic: 92,
    playtime: 8,
  },
  {
    id: 3,
    title: 'Fantasy Realms Online',
    price: 49.99,
    genre: 'MMORPG',
    developer: 'Mythic Worlds',
    rating: 4.3,
    description:
      'Dive into a vast fantasy world with thousands of players. Choose your class, form alliances, and battle epic monsters in this massively multiplayer online experience.',
    releaseDate: '2024-03-20',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X'],
    metacritic: 78,
    playtime: 25,
  },
  {
    id: 4,
    title: 'Racing Thunder',
    price: 39.99,
    genre: 'Racing',
    developer: 'Speed Demons',
    rating: 4.5,
    description:
      'Feel the adrenaline rush as you race through stunning tracks around the world. Customize your cars, compete in tournaments, and become the ultimate racing champion.',
    releaseDate: '2024-04-05',
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch'],
    metacritic: 85,
    playtime: 15,
  },
  {
    id: 5,
    title: 'Space Explorer',
    price: 34.99,
    genre: 'Adventure',
    developer: 'Cosmic Games',
    rating: 4.5,
    description:
      'Embark on an epic space journey across the galaxy. Discover new planets, encounter alien civilizations, and make choices that shape the future of humanity.',
    releaseDate: '2024-05-12',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X'],
    metacritic: 82,
    playtime: 18,
  },
  {
    id: 6,
    title: 'Battle Arena Champions',
    price: 19.99,
    genre: 'Fighting',
    developer: 'Combat Studios',
    rating: 4.5,
    description:
      'Master various fighting styles and compete in intense battles. Choose from dozens of unique characters, each with their own special moves and abilities.',
    releaseDate: '2024-06-18',
    image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X', 'Mobile'],
    metacritic: 88,
    playtime: 10,
  },
];

export function AppProvider({ children }) {
  const [games, setGames] = useState([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [gamesError, setGamesError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const [cart, setCart] = useState(() => {
    try {
      return cartStorage.getCart();
    } catch {
      return [];
    }
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);

  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }, []);

  const fetchAllGames = useCallback(async (page = 1, pageSize = 20) => {
    setGamesLoading(true);
    setGamesError(null);
    try {
      const offset = (page - 1) * pageSize;
      const data = await gamesService.fetchPopularGames(offset, pageSize);
      setGames(data);
      setPagination({
        count: data.length,
        next: data.length === pageSize ? page + 1 : null,
        previous: page > 1 ? page - 1 : null,
      });
    } catch {
      setGames(MOCK_GAMES);
      setPagination({
        count: MOCK_GAMES.length,
        next: null,
        previous: null,
      });
    } finally {
      setGamesLoading(false);
    }
  }, []);

  const searchGames = useCallback(
    async (query) => {
      if (!query) {
        await fetchAllGames();
        return;
      }

      setGamesLoading(true);
      setGamesError(null);
      try {
        const data = await gamesService.searchGames(query, 20);
        setGames(data);
        setPagination({
          count: data.length,
          next: data.length === 20 ? 2 : null,
          previous: null,
        });
      } catch {
        const normalizedQuery = query.toLowerCase();
        const filteredGames = MOCK_GAMES.filter(
          (game) =>
            game.title.toLowerCase().includes(normalizedQuery) ||
            game.description.toLowerCase().includes(normalizedQuery) ||
            game.genre.toLowerCase().includes(normalizedQuery) ||
            game.developer.toLowerCase().includes(normalizedQuery),
        );
        setGames(filteredGames);
        setPagination({
          count: filteredGames.length,
          next: null,
          previous: null,
        });
      } finally {
        setGamesLoading(false);
      }
    },
    [fetchAllGames],
  );

  const fetchGameById = useCallback(async (gameId) => {
    setGamesLoading(true);
    setGamesError(null);
    try {
      const data = await gamesService.fetchGameById(gameId);
      return data;
    } catch {
      const game = MOCK_GAMES.find((item) => String(item.id) === String(gameId));
      if (game) {
        return game;
      }
      throw new Error('Game not found in catalog or mock data');
    } finally {
      setGamesLoading(false);
    }
  }, []);

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

  const addItem = useCallback((item) => {
    if (!item || !item.id) {
      throw new Error('Invalid item provided to addItem');
    }
    const updatedCart = cartStorage.addToCart(item);
    setCart(updatedCart);
    setHasUnsavedChanges(true);
  }, []);

  const removeItem = useCallback((itemId) => {
    if (!itemId) {
      throw new Error('Invalid item ID provided to removeItem');
    }
    const updatedCart = cartStorage.removeFromCart(itemId);
    setCart(updatedCart);
    setHasUnsavedChanges(true);
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (!itemId || typeof quantity !== 'number') {
      throw new Error('Invalid parameters provided to updateQuantity');
    }
    if (quantity < 1) {
      const updatedCart = cartStorage.removeFromCart(itemId);
      setCart(updatedCart);
      setHasUnsavedChanges(true);
      return;
    }
    const updatedCart = cartStorage.updateCartQuantity(itemId, quantity);
    setCart(updatedCart);
    setHasUnsavedChanges(true);
  }, []);

  const clearAllItems = useCallback(() => {
    const updatedCart = cartStorage.clearCart();
    setCart(updatedCart);
    setHasUnsavedChanges(false);
  }, []);

  const getCartItem = useCallback(
    (itemId) => cart.find((item) => item.id === itemId) || null,
    [cart],
  );

  const isItemInCart = useCallback(
    (itemId) => cart.some((item) => item.id === itemId),
    [cart],
  );

  const { subtotal, tax, total } = cartStorage.calculateTotal(cart);

  const showToast = useCallback((msg, duration = 3200) => {
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, duration);
  }, []);

  useEffect(
    () => () => {
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current);
    },
    [],
  );

  const value = {
    games,
    loading: gamesLoading,
    error: gamesError,
    pagination,
    fetchAllGames,
    searchGames,
    fetchGameById,

    cart,
    itemCount: cart.length,
    subtotal,
    tax,
    total,
    isEmpty: cart.length === 0,
    addItem,
    removeItem,
    updateQuantity,
    clearAllItems,
    getCartItem,
    isItemInCart,
    hasUnsavedChanges,

    showToast,

    theme,
    toggleTheme,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {toastMessage ? (
        <div className='toast' role='status' aria-live='polite'>
          {toastMessage}
        </div>
      ) : null}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
