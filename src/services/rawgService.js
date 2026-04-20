import axios from 'axios';

const RAWG_API_KEY = process.env.REACT_APP_RAWG_API_KEY || '';
const RAWG_BASE_URL = 'https://api.rawg.io/api';

/**
 * Create axios instance with RAWG API configuration
 */
const rawgAPI = axios.create({
  baseURL: RAWG_BASE_URL,
  timeout: 10000,
  params: {
    key: RAWG_API_KEY,
  },
});

/**
 * Add error interceptor for consistent error handling
 */
rawgAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || 'An error occurred while fetching data';
      console.error('API Error:', message, error.response.status);
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error:', error.request);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Error in request setup
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

/**
 * Fetch popular games with pagination
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Number of games per page (default: 20, max: 40)
 * @param {string} ordering - Ordering parameter (default: '-rating', options: '-rating', '-added', '-created', 'released')
 * @returns {Promise<Object>} Games data with count, next, results
 */
export const fetchPopularGames = async (page = 1, pageSize = 20, ordering = '-rating') => {
  try {
    const response = await rawgAPI.get('/games', {
      params: {
        page,
        page_size: Math.min(pageSize, 40), // RAWG max is 40
        ordering,
      },
    });

    return {
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      results: response.data.results.map(transformGame),
    };
  } catch (error) {
    console.error('Error fetching popular games:', error);
    throw error;
  }
};

/**
 * Search games by query
 * @param {string} query - Search query
 * @param {number} pageSize - Number of results (default: 20, max: 40)
 * @returns {Promise<Array>} Array of matching games
 */
export const searchGames = async (query, pageSize = 20) => {
  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty');
  }

  try {
    const response = await rawgAPI.get('/games', {
      params: {
        search: query,
        page_size: Math.min(pageSize, 40),
      },
    });

    return response.data.results.map(transformGame);
  } catch (error) {
    console.error('Error searching games:', error);
    throw error;
  }
};

/**
 * Fetch a single game by ID
 * @param {number|string} gameId - Game ID from RAWG
 * @returns {Promise<Object>} Complete game data
 */
export const fetchGameById = async (gameId) => {
  if (!gameId) {
    throw new Error('Game ID is required');
  }

  try {
    const response = await rawgAPI.get(`/games/${gameId}`);
    return transformGame(response.data, true);
  } catch (error) {
    console.error(`Error fetching game ${gameId}:`, error);
    throw error;
  }
};

/**
 * Fetch games by platform
 * @param {number|string} platformId - Platform ID (e.g., 1 for PC, 18 for PlayStation 5)
 * @param {number} pageSize - Number of results (default: 20)
 * @returns {Promise<Array>} Array of games for the platform
 */
export const fetchGamesByPlatform = async (platformId, pageSize = 20) => {
  try {
    const response = await rawgAPI.get('/games', {
      params: {
        platforms: platformId,
        page_size: Math.min(pageSize, 40),
        ordering: '-rating',
      },
    });

    return response.data.results.map(transformGame);
  } catch (error) {
    console.error(`Error fetching games for platform ${platformId}:`, error);
    throw error;
  }
};

/**
 * Fetch games by genre
 * @param {number|string} genreId - Genre ID
 * @param {number} pageSize - Number of results (default: 20)
 * @returns {Promise<Array>} Array of games for the genre
 */
export const fetchGamesByGenre = async (genreId, pageSize = 20) => {
  try {
    const response = await rawgAPI.get('/games', {
      params: {
        genres: genreId,
        page_size: Math.min(pageSize, 40),
        ordering: '-rating',
      },
    });

    return response.data.results.map(transformGame);
  } catch (error) {
    console.error(`Error fetching games for genre ${genreId}:`, error);
    throw error;
  }
};

/**
 * Fetch game screenshots
 * @param {number|string} gameId - Game ID
 * @returns {Promise<Array>} Array of screenshot URLs
 */
export const fetchGameScreenshots = async (gameId) => {
  try {
    const response = await rawgAPI.get(`/games/${gameId}/screenshots`);
    return response.data.results.map(screenshot => screenshot.image);
  } catch (error) {
    console.error(`Error fetching screenshots for game ${gameId}:`, error);
    throw error;
  }
};

/**
 * Transform RAWG game object to app format
 * @param {Object} rawgGame - Game object from RAWG API
 * @param {boolean} detailed - Include detailed information
 * @returns {Object} Transformed game object
 */
const transformGame = (rawgGame, detailed = false) => {
  const game = {
    id: rawgGame.id,
    title: rawgGame.name,
    image: rawgGame.background_image,
    price: rawgGame.price || 9.99 + (rawgGame.rating || 3) * 2, // Mock price calculation
    genre: rawgGame.genres?.[0]?.name || 'Unknown',
    genres: rawgGame.genres?.map(g => g.name) || [],
    rating: rawgGame.rating || 0,
    description: rawgGame.description || rawgGame.description_raw || 'No description available',
    developer: rawgGame.developers?.[0]?.name || 'Unknown Developer',
    developers: rawgGame.developers?.map(d => d.name) || [],
    releaseDate: rawgGame.released || new Date().toISOString().split('T')[0],
    platforms: rawgGame.platforms?.map(p => p.platform.name) || [],
    publisher: rawgGame.publishers?.[0]?.name || 'Unknown Publisher',
    tags: rawgGame.tags?.map(t => t.name) || [],
    metacritic: rawgGame.metacritic || null,
  };

  if (detailed) {
    game.playtime = rawgGame.playtime || 0;
    game.achievements = rawgGame.achievements_count || 0;
    game.website = rawgGame.website || null;
    game.reddit_url = rawgGame.reddit_url || null;
  }

  return game;
};

/**
 * Get all available platforms
 * @returns {Promise<Array>} Array of platform objects
 */
export const fetchPlatforms = async () => {
  try {
    const response = await rawgAPI.get('/platforms');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching platforms:', error);
    throw error;
  }
};

/**
 * Get all available genres
 * @returns {Promise<Array>} Array of genre objects
 */
export const fetchGenres = async () => {
  try {
    const response = await rawgAPI.get('/genres');
    return response.data.results;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

/**
 * Advanced search with filters
 * @param {Object} filters - Filter object
 * @param {string} filters.search - Search query
 * @param {string} filters.ordering - Sort order
 * @param {array} filters.platforms - Platform IDs
 * @param {array} filters.genres - Genre IDs
 * @param {number} filters.page - Page number
 * @param {number} filters.page_size - Results per page
 * @returns {Promise<Object>} Filtered games
 */
export const advancedSearch = async (filters = {}) => {
  try {
    const params = {
      page_size: 40,
      ...filters,
    };

    const response = await rawgAPI.get('/games', { params });

    return {
      count: response.data.count,
      next: response.data.next,
      previous: response.data.previous,
      results: response.data.results.map(transformGame),
    };
  } catch (error) {
    console.error('Error in advanced search:', error);
    throw error;
  }
};

export default rawgAPI;
