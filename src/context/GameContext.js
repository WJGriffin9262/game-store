import { createContext, useState, useCallback } from 'react';
import {
  fetchPopularGames,
  searchGames as searchGamesAPI,
  fetchGameById as fetchGameByIdAPI
} from '../services/rawgService';

// Mock data fallback
const mockGames = [
  {
    id: 1,
    title: 'Cyber Quest 2077',
    price: 59.99,
    genre: 'Action RPG',
    developer: 'Cyber Studios',
    rating: 4.5,
    description: 'An immersive cyberpunk RPG set in a dystopian future. Explore neon-lit cities, hack corporate systems, and uncover dark conspiracies in this groundbreaking adventure.',
    releaseDate: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X'],
    metacritic: 87,
    playtime: 12
  },
  {
    id: 2,
    title: 'Puzzle Master Pro',
    price: 24.99,
    genre: 'Puzzle',
    developer: 'Brain Games Inc',
    rating: 4.8,
    description: 'Challenge your mind with over 500 hand-crafted puzzles. From logic grids to spatial reasoning challenges, this game will test your problem-solving skills like never before.',
    releaseDate: '2024-02-10',
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400',
    platforms: ['PC', 'Mobile', 'Nintendo Switch'],
    metacritic: 92,
    playtime: 8
  },
  {
    id: 3,
    title: 'Fantasy Realms Online',
    price: 49.99,
    genre: 'MMORPG',
    developer: 'Mythic Worlds',
    rating: 4.3,
    description: 'Dive into a vast fantasy world with thousands of players. Choose your class, form alliances, and battle epic monsters in this massively multiplayer online experience.',
    releaseDate: '2024-03-20',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X'],
    metacritic: 78,
    playtime: 25
  },
  {
    id: 4,
    title: 'Racing Thunder',
    price: 39.99,
    genre: 'Racing',
    developer: 'Speed Demons',
    rating: 4.6,
    description: 'Feel the adrenaline rush as you race through stunning tracks around the world. Customize your cars, compete in tournaments, and become the ultimate racing champion.',
    releaseDate: '2024-04-05',
    image: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X', 'Nintendo Switch'],
    metacritic: 85,
    playtime: 15
  },
  {
    id: 5,
    title: 'Space Explorer',
    price: 34.99,
    genre: 'Adventure',
    developer: 'Cosmic Games',
    rating: 4.4,
    description: 'Embark on an epic space journey across the galaxy. Discover new planets, encounter alien civilizations, and make choices that shape the future of humanity.',
    releaseDate: '2024-05-12',
    image: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X'],
    metacritic: 82,
    playtime: 18
  },
  {
    id: 6,
    title: 'Battle Arena Champions',
    price: 19.99,
    genre: 'Fighting',
    developer: 'Combat Studios',
    rating: 4.7,
    description: 'Master various fighting styles and compete in intense battles. Choose from dozens of unique characters, each with their own special moves and abilities.',
    releaseDate: '2024-06-18',
    image: 'https://images.unsplash.com/photo-1556438064-2d7646166914?w=400',
    platforms: ['PC', 'PlayStation 5', 'Xbox Series X', 'Mobile'],
    metacritic: 88,
    playtime: 10
  }
];

export const GameContext = createContext();

export function GameProvider({ children }) {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });

  const fetchAllGames = useCallback(async (page = 1, pageSize = 20) => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch from RAWG API first
      const data = await fetchPopularGames(page, pageSize);
      setGames(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (err) {
      console.warn('RAWG API failed, falling back to mock data:', err.message);
      // Fallback to mock data
      setGames(mockGames);
      setPagination({
        count: mockGames.length,
        next: null,
        previous: null,
      });
      // Don't set error for mock data fallback
    } finally {
      setLoading(false);
    }
  }, []);

  const searchGames = useCallback(async (query) => {
    if (!query) {
      await fetchAllGames();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Try to search via RAWG API first
      const data = await searchGamesAPI(query, 20);
      setGames(data);
      setPagination({
        count: data.length,
        next: null,
        previous: null,
      });
    } catch (err) {
      console.warn('RAWG API search failed, falling back to mock data search:', err.message);
      // Fallback to mock data search
      const filteredGames = mockGames.filter(game =>
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.description.toLowerCase().includes(query.toLowerCase()) ||
        game.genre.toLowerCase().includes(query.toLowerCase()) ||
        game.developer.toLowerCase().includes(query.toLowerCase())
      );
      setGames(filteredGames);
      setPagination({
        count: filteredGames.length,
        next: null,
        previous: null,
      });
    } finally {
      setLoading(false);
    }
  }, [fetchAllGames]);

  const fetchGameById = useCallback(async (gameId) => {
    setLoading(true);
    setError(null);
    try {
      // Try to fetch from RAWG API first
      const data = await fetchGameByIdAPI(gameId);
      return data;
    } catch (err) {
      console.warn('RAWG API fetch failed, falling back to mock data:', err.message);
      // Fallback to mock data
      const game = mockGames.find(g => g.id === parseInt(gameId));
      if (game) {
        return game;
      }
      throw new Error('Game not found');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    games,
    loading,
    error,
    pagination,
    fetchAllGames,
    searchGames,
    fetchGameById,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}
