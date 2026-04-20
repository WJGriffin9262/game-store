import { API_BASE_URL, API_ENDPOINTS } from '../constants';

// Simulate API calls - replace with real API in production
const mockGames = [
  {
    id: 1,
    title: 'Cyber Quest',
    price: 29.99,
    genre: 'Action RPG',
    developer: 'Game Studio A',
    rating: 4.5,
    description: 'An immersive action RPG set in a futuristic world.',
    releaseDate: '2024-01-15',
  },
  {
    id: 2,
    title: 'Puzzle Master',
    price: 19.99,
    genre: 'Puzzle',
    developer: 'Game Studio B',
    rating: 4.8,
    description: 'Challenge your mind with innovative puzzle mechanics.',
    releaseDate: '2024-02-10',
  },
  {
    id: 3,
    title: 'Fantasy Realms',
    price: 49.99,
    genre: 'Fantasy RPG',
    developer: 'Game Studio C',
    rating: 4.3,
    description: 'Explore vast fantasy worlds with rich storytelling.',
    releaseDate: '2024-03-20',
  },
];

/**
 * Fetch all games
 * @returns {Promise<Array>} Array of games
 */
export const fetchGames = async () => {
  try {
    // Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GAMES}`);
    // return response.json();
    
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGames), 500);
    });
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

/**
 * Fetch single game by ID
 * @param {number} id - Game ID
 * @returns {Promise<Object>} Game object
 */
export const fetchGameById = async (id) => {
  try {
    // Replace with actual API call
    // const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GAME_DETAIL(id)}`);
    // return response.json();
    
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const game = mockGames.find(g => g.id === parseInt(id));
        if (game) {
          resolve(game);
        } else {
          reject(new Error('Game not found'));
        }
      }, 300);
    });
  } catch (error) {
    console.error('Error fetching game:', error);
    throw error;
  }
};

/**
 * Search games by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Filtered games
 */
export const searchGames = async (query) => {
  try {
    const games = await fetchGames();
    return games.filter(game =>
      game.title.toLowerCase().includes(query.toLowerCase()) ||
      game.description.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching games:', error);
    throw error;
  }
};
