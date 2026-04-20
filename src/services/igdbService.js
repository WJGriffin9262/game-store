import axios from 'axios';

const IGDB_API_KEY = process.env.REACT_APP_IGDB_API_KEY || '';
const IGDB_BASE_URL = 'https://api.igdb.com/v4';

/**
 * Create axios instance with IGDB API configuration
 * IGDB uses a custom query language similar to GraphQL
 */
const igdbAPI = axios.create({
  baseURL: IGDB_BASE_URL,
  timeout: 10000,
  headers: {
    'Client-ID': IGDB_API_KEY,
  },
});

/**
 * Add error interceptor for consistent error handling
 */
igdbAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.[0]?.title || 'An error occurred while fetching data';
      console.error('IGDB API Error:', message, error.response.status);
      return Promise.reject(new Error(message));
    } else if (error.request) {
      console.error('Network Error:', error.request);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

/**
 * Fetch popular games from IGDB
 * @param {number} offset - Pagination offset (default: 0)
 * @param {number} limit - Number of results (default: 20, max: 500)
 * @returns {Promise<Object>} Games data with results
 */
export const fetchPopularGames = async (offset = 0, limit = 20) => {
  try {
    const query = `
      fields name, slug, summary, rating, first_release_date, cover.url, genres.name, platforms.name, developer.name, age_rating, artworks.url;
      sort popularity desc;
      limit ${Math.min(limit, 500)};
      offset ${offset};
      where rating != null & first_release_date != null;
    `;

    const response = await igdbAPI.post('/games', query, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    return {
      results: response.data.map(transformGame),
      count: response.data.length,
      offset,
      limit,
    };
  } catch (error) {
    console.error('Error fetching popular games:', error);
    throw error;
  }
};

/**
 * Search games on IGDB
 * @param {string} query - Search query
 * @param {number} limit - Number of results (default: 20)
 * @returns {Promise<Array>} Array of matching games
 */
export const searchGames = async (query, limit = 20) => {
  if (!query || query.trim().length === 0) {
    throw new Error('Search query cannot be empty');
  }

  try {
    const igdbQuery = `
      fields name, slug, summary, rating, first_release_date, cover.url, genres.name, platforms.name, developer.name, age_rating;
      search "${query}";
      limit ${Math.min(limit, 500)};
    `;

    const response = await igdbAPI.post('/games', igdbQuery, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    return response.data.map(transformGame);
  } catch (error) {
    console.error('Error searching games:', error);
    throw error;
  }
};

/**
 * Fetch a single game by ID
 * @param {number|string} gameId - IGDB game ID
 * @returns {Promise<Object>} Complete game data
 */
export const fetchGameById = async (gameId) => {
  if (!gameId) {
    throw new Error('Game ID is required');
  }

  try {
    const query = `
      fields name, slug, summary, rating, first_release_date, cover.url, genres.name, platforms.name, developer.name, publisher.name, age_rating, artworks.url, screenshots.url, videos.video_id, websites.url, multiplayer_modes.campaigncoop, multiplayer_modes.dropin, multiplayer_modes.online, multiplayer_modes.splitscreen;
      where id = ${gameId};
    `;

    const response = await igdbAPI.post('/games', query, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    if (response.data.length === 0) {
      throw new Error(`Game with ID ${gameId} not found`);
    }

    return transformGame(response.data[0], true);
  } catch (error) {
    console.error(`Error fetching game ${gameId}:`, error);
    throw error;
  }
};

/**
 * Fetch games by genre
 * @param {number|string} genreId - IGDB genre ID
 * @param {number} limit - Number of results (default: 20)
 * @returns {Promise<Array>} Array of games for the genre
 */
export const fetchGamesByGenre = async (genreId, limit = 20) => {
  try {
    const query = `
      fields name, slug, summary, rating, first_release_date, cover.url, genres.name, platforms.name, developer.name;
      where genres = ${genreId};
      sort rating desc;
      limit ${Math.min(limit, 500)};
    `;

    const response = await igdbAPI.post('/games', query, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    return response.data.map(transformGame);
  } catch (error) {
    console.error(`Error fetching games for genre ${genreId}:`, error);
    throw error;
  }
};

/**
 * Fetch games by platform
 * @param {number|string} platformId - IGDB platform ID
 * @param {number} limit - Number of results (default: 20)
 * @returns {Promise<Array>} Array of games for the platform
 */
export const fetchGamesByPlatform = async (platformId, limit = 20) => {
  try {
    const query = `
      fields name, slug, summary, rating, first_release_date, cover.url, genres.name, platforms.name, developer.name;
      where platforms = ${platformId};
      sort rating desc;
      limit ${Math.min(limit, 500)};
    `;

    const response = await igdbAPI.post('/games', query, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    return response.data.map(transformGame);
  } catch (error) {
    console.error(`Error fetching games for platform ${platformId}:`, error);
    throw error;
  }
};

/**
 * Get all available genres
 * @returns {Promise<Array>} Array of genre objects
 */
export const fetchGenres = async () => {
  try {
    const query = `fields name, slug;`;
    const response = await igdbAPI.post('/genres', query, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

/**
 * Get all available platforms
 * @returns {Promise<Array>} Array of platform objects
 */
export const fetchPlatforms = async () => {
  try {
    const query = `fields name, slug, platform_family;`;
    const response = await igdbAPI.post('/platforms', query, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching platforms:', error);
    throw error;
  }
};

/**
 * Transform IGDB game object to app format
 * @param {Object} igdbGame - Game object from IGDB API
 * @param {boolean} detailed - Include detailed information
 * @returns {Object} Transformed game object
 */
const transformGame = (igdbGame, detailed = false) => {
  // Construct image URL from IGDB cover ID
  const imageUrl = igdbGame.cover?.url
    ? `https:${igdbGame.cover.url.replace('t_thumb', 't_cover_big')}`
    : null;

  const game = {
    id: igdbGame.id,
    title: igdbGame.name || 'Unknown Game',
    image: imageUrl,
    price: calculatePrice(igdbGame.rating),
    genre: igdbGame.genres?.[0]?.name || 'Unknown',
    genres: igdbGame.genres?.map(g => g.name) || [],
    rating: igdbGame.rating ? Math.round(igdbGame.rating) / 10 : 0, // IGDB uses 0-100 scale, convert to 0-10
    description: igdbGame.summary || 'No description available',
    developer: igdbGame.developer?.name || 'Unknown Developer',
    publisher: igdbGame.publisher?.name || 'Unknown Publisher',
    releaseDate: igdbGame.first_release_date
      ? new Date(igdbGame.first_release_date * 1000).toISOString().split('T')[0]
      : 'TBA',
    platforms: igdbGame.platforms?.map(p => p.name) || [],
    ageRating: igdbGame.age_rating?.category || 'ESRB',
    slug: igdbGame.slug,
  };

  if (detailed) {
    game.artworks = igdbGame.artworks?.map(a => `https:${a.url.replace('t_thumb', 't_1080p')}`) || [];
    game.screenshots = igdbGame.screenshots?.map(s => `https:${s.url.replace('t_thumb', 't_screenshot_big')}`) || [];
    game.videos = igdbGame.videos?.map(v => v.video_id) || [];
    game.websites = igdbGame.websites || [];
    game.multiplayerModes = igdbGame.multiplayer_modes || [];
  }

  return game;
};

/**
 * Calculate price based on rating (mock pricing)
 * @param {number} rating - Game rating (0-100 IGDB scale)
 * @returns {number} Calculated price
 */
const calculatePrice = (rating) => {
  if (!rating) return 29.99;
  const normalizedRating = rating / 10; // Convert to 0-10 scale
  return Math.round((19.99 + normalizedRating * 4) * 100) / 100;
};

export default igdbAPI;
