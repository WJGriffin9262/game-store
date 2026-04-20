import axios from 'axios';
import jsonp from 'jsonp';

// GameSpot API Configuration
const GAMESPOT_BASE_URL = 'http://www.gamespot.com/api';
const API_KEY = process.env.REACT_APP_GAMESPOT_API_KEY || process.env.REACT_APP_IGDB_API_KEY;

// Create axios instance with GameSpot configuration for server-side requests
const gamespotApi = axios.create({
  baseURL: GAMESPOT_BASE_URL,
  timeout: 10000,
  headers: {
    'User-Agent': 'GameStore-App/1.0 (williamjgriffin9262@gmail.com)',
  },
});

// Add request interceptor for API key
gamespotApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: API_KEY,
    format: 'json',
  };
  return config;
});

// Add response interceptor for error handling
gamespotApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('GameSpot API Error:', error);
    if (error.response?.status === 401) {
      throw new Error('Invalid GameSpot API key');
    }
    if (error.response?.status === 429) {
      throw new Error('GameSpot API rate limit exceeded');
    }
    throw error;
  }
);

// JSONP helper function for browser requests
const gamespotJsonpRequest = (endpoint, params = {}) => {
  return new Promise((resolve, reject) => {
    const url = `${GAMESPOT_BASE_URL}${endpoint}`;
    const queryParams = new URLSearchParams({
      ...params,
      api_key: API_KEY,
      format: 'jsonp',
    });

    const fullUrl = `${url}?${queryParams.toString()}`;

    jsonp(fullUrl, { timeout: 10000 }, (err, data) => {
      if (err) {
        console.error('GameSpot JSONP Error:', err);
        reject(err);
        return;
      }

      if (data.status_code !== 1) {
        reject(new Error(data.error || 'GameSpot API error'));
        return;
      }

      resolve(data);
    });
  });
};

// Transform GameSpot game data to our app format
const transformGameSpotGame = (game) => {
  return {
    id: game.id,
    title: game.name,
    image: game.image?.original || game.image?.screen_url || game.image?.medium_url,
    price: calculatePrice(game),
    genre: game.genres?.[0]?.name || 'Unknown',
    genres: game.genres?.map(g => g.name) || [],
    rating: game.score || (Math.random() * 2 + 3), // Use review score or random 3-5
    description: game.description || game.deck,
    developer: game.developers?.[0]?.name || 'Unknown',
    publisher: game.publishers?.[0]?.name || 'Unknown',
    releaseDate: game.release_date,
    platforms: game.platforms?.map(p => p.name) || [],
    slug: game.site_detail_url?.split('/').pop() || game.name?.toLowerCase().replace(/\s+/g, '-'),
    // GameSpot specific fields
    deck: game.deck,
    site_detail_url: game.site_detail_url,
    videos_api_url: game.videos_api_url,
    articles_api_url: game.articles_api_url,
    reviews_api_url: game.reviews_api_url,
    images_api_url: game.images_api_url,
    themes: game.themes?.map(t => t.name) || [],
    franchises: game.franchises?.map(f => f.name) || [],
  };
};

// Calculate price based on game data (mock pricing)
const calculatePrice = (game) => {
  const basePrice = 29.99;
  const ratingMultiplier = (game.score || 4) / 5;
  const genreMultiplier = game.genres?.length > 1 ? 1.2 : 1;
  const year = new Date(game.release_date).getFullYear();
  const ageMultiplier = year > 2020 ? 1.3 : year > 2015 ? 1.1 : 0.9;

  return Math.round((basePrice * ratingMultiplier * genreMultiplier * ageMultiplier) * 100) / 100;
};

// API Functions
export const gamespotService = {
  // Fetch popular games (sorted by score/rating)
  fetchPopularGames: async (offset = 0, limit = 20) => {
    try {
      console.log('Fetching popular games from GameSpot API...');

      // Use JSONP for browser compatibility
      const data = await gamespotJsonpRequest('/games/', {
        sort: 'score:desc',
        limit: limit.toString(),
        offset: offset.toString(),
        field_list: 'id,name,image,deck,description,genres,themes,franchises,release_date,platforms,developers,publishers,score,site_detail_url,videos_api_url,articles_api_url,reviews_api_url,images_api_url',
      });

      const games = data.results.map(transformGameSpotGame);
      console.log(`Fetched ${games.length} games from GameSpot API`);
      return games;
    } catch (error) {
      console.error('Error fetching popular games from GameSpot:', error);
      throw error;
    }
  },

  // Search games
  searchGames: async (query, limit = 20) => {
    try {
      console.log(`Searching GameSpot API for: "${query}"`);

      // Use JSONP for browser compatibility
      const data = await gamespotJsonpRequest('/games/', {
        filter: `name:${query}`,
        limit: limit.toString(),
        field_list: 'id,name,image,deck,description,genres,themes,franchises,release_date,platforms,developers,publishers,score,site_detail_url,videos_api_url,articles_api_url,reviews_api_url,images_api_url',
      });

      const games = data.results.map(transformGameSpotGame);
      console.log(`Found ${games.length} games matching "${query}"`);
      return games;
    } catch (error) {
      console.error('Error searching games on GameSpot:', error);
      throw error;
    }
  },

  // Fetch single game by ID
  fetchGameById: async (id) => {
    try {
      console.log(`Fetching game details for ID: ${id}`);

      // Use JSONP for browser compatibility
      const data = await gamespotJsonpRequest('/games/', {
        filter: `id:${id}`,
        field_list: 'id,name,image,deck,description,genres,themes,franchises,release_date,platforms,developers,publishers,score,site_detail_url,videos_api_url,articles_api_url,reviews_api_url,images_api_url',
      });

      if (!data.results || data.results.length === 0) {
        throw new Error('Game not found');
      }

      const game = transformGameSpotGame(data.results[0]);
      console.log(`Fetched game: ${game.title}`);
      return game;
    } catch (error) {
      console.error('Error fetching game by ID from GameSpot:', error);
      throw error;
    }
  },

  // Fetch games by genre
  fetchGamesByGenre: async (genreName, limit = 20) => {
    try {
      console.log(`Fetching games for genre: ${genreName}`);

      // Use JSONP for browser compatibility
      const data = await gamespotJsonpRequest('/games/', {
        filter: `genres:${genreName}`,
        sort: 'score:desc',
        limit: limit.toString(),
        field_list: 'id,name,image,deck,description,genres,themes,franchises,release_date,platforms,developers,publishers,score,site_detail_url',
      });

      const games = data.results.map(transformGameSpotGame);
      console.log(`Found ${games.length} games in genre "${genreName}"`);
      return games;
    } catch (error) {
      console.error('Error fetching games by genre from GameSpot:', error);
      throw error;
    }
  },

  // Fetch game reviews
  fetchGameReviews: async (gameId, limit = 10) => {
    try {
      console.log(`Fetching reviews for game ID: ${gameId}`);

      // Use JSONP for browser compatibility
      const data = await gamespotJsonpRequest('/reviews/', {
        filter: `game:${gameId}`,
        sort: 'publish_date:desc',
        limit: limit.toString(),
        field_list: 'id,title,deck,score,authors,publish_date,site_detail_url',
      });

      const reviews = data.results.map(review => ({
        id: review.id,
        title: review.title,
        deck: review.deck,
        score: review.score,
        authors: review.authors,
        publish_date: review.publish_date,
        site_detail_url: review.site_detail_url,
      }));

      console.log(`Found ${reviews.length} reviews for game ID ${gameId}`);
      return reviews;
    } catch (error) {
      console.error('Error fetching game reviews from GameSpot:', error);
      throw error;
    }
  },

  // Fetch game images
  fetchGameImages: async (gameId, limit = 10) => {
    try {
      console.log(`Fetching images for game ID: ${gameId}`);

      // Use JSONP for browser compatibility
      const data = await gamespotJsonpRequest('/images/', {
        association: gameId,
        limit: limit.toString(),
        field_list: 'id,site_detail_url,icon_url,medium_url,screen_url,small_url,super_url,thumb_url,tiny_url,screen_tiny,square_tiny,original',
      });

      const images = data.results.map(image => ({
        id: image.id,
        site_detail_url: image.site_detail_url,
        icon_url: image.icon_url,
        medium_url: image.medium_url,
        screen_url: image.screen_url,
        small_url: image.small_url,
        super_url: image.super_url,
        thumb_url: image.thumb_url,
        tiny_url: image.tiny_url,
        screen_tiny: image.screen_tiny,
        square_tiny: image.square_tiny,
        original: image.original,
      }));

      console.log(`Found ${images.length} images for game ID ${gameId}`);
      return images;
    } catch (error) {
      console.error('Error fetching game images from GameSpot:', error);
      throw error;
    }
  },
};

export default gamespotService;