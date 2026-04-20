// Example Usage: Using RAWG API Service in Components

// ============================================
// Example 1: Fetching Popular Games in a Component
// ============================================

import { useEffect, useState } from 'react';
import { fetchPopularGames } from '../services/rawgService';

function MyGamesComponent() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGames = async () => {
      setLoading(true);
      try {
        const data = await fetchPopularGames(1, 20, '-rating');
        setGames(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {games.map(game => (
        <div key={game.id}>
          <h3>{game.title}</h3>
          <p>Rating: {game.rating}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Example 2: Searching Games with Hooks
// ============================================

import { useGames } from '../hooks';

function SearchComponent() {
  const { games, loading, searchGames } = useGames();
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    const term = e.target.value;
    setQuery(term);
    if (term.trim()) {
      await searchGames(term);
    }
  };

  return (
    <div>
      <input 
        value={query}
        onChange={handleSearch}
        placeholder="Search games..."
      />
      {games.map(game => (
        <div key={game.id}>{game.title}</div>
      ))}
    </div>
  );
}

// ============================================
// Example 3: Advanced Search with Filters
// ============================================

import { advancedSearch } from '../services/rawgService';

async function searchWithFilters() {
  const results = await advancedSearch({
    search: 'RPG',
    ordering: '-rating',
    platforms: [1, 2], // PC and PlayStation
    genres: [5],       // RPG
    page_size: 20
  });

  console.log(results.results); // Array of games
}

// ============================================
// Example 4: Fetching Games by Genre
// ============================================

import { fetchGamesByGenre } from '../services/rawgService';

async function getActionGames() {
  try {
    const actionGames = await fetchGamesByGenre(4, 20); // Action genre ID is 4
    console.log(actionGames);
  } catch (error) {
    console.error('Error fetching action games:', error);
  }
}

// ============================================
// Example 5: Fetching Games by Platform
// ============================================

import { fetchGamesByPlatform } from '../services/rawgService';

async function getPCGames() {
  try {
    const pcGames = await fetchGamesByPlatform(1, 20); // PC platform ID is 1
    console.log(pcGames);
  } catch (error) {
    console.error('Error fetching PC games:', error);
  }
}

// ============================================
// Example 6: Getting All Genres and Platforms
// ============================================

import { fetchGenres, fetchPlatforms } from '../services/rawgService';

async function loadMetadata() {
  try {
    const genres = await fetchGenres();
    const platforms = await fetchPlatforms();
    
    // Use these for filtering dropdowns
    console.log('Genres:', genres);
    console.log('Platforms:', platforms);
  } catch (error) {
    console.error('Error loading metadata:', error);
  }
}

// ============================================
// Example 7: Using with Context in a Page
// ============================================

import { useGames } from '../hooks';

function GamesPage() {
  const { 
    games, 
    loading, 
    error, 
    pagination,
    fetchAllGames, 
    searchGames,
    fetchGameById 
  } = useGames();

  useEffect(() => {
    fetchAllGames(1, 20); // Fetch first page
  }, [fetchAllGames]);

  const handleSearch = async (query) => {
    await searchGames(query);
  };

  const handlePageChange = (page) => {
    fetchAllGames(page, 20);
  };

  return (
    <div>
      <input 
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search games..."
      />
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      <div className="games-grid">
        {games.map(game => (
          <div key={game.id}>
            <img src={game.image} alt={game.title} />
            <h3>{game.title}</h3>
            <p>Rating: {game.rating}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <p>Total: {pagination.count} games</p>
        {pagination.previous && (
          <button onClick={() => handlePageChange(1)}>Previous</button>
        )}
        {pagination.next && (
          <button onClick={() => handlePageChange(2)}>Next</button>
        )}
      </div>
    </div>
  );
}

// ============================================
// Error Handling Examples
// ============================================

// Handling API errors
try {
  const game = await fetchGameById(invalidId);
} catch (error) {
  if (error.message.includes('Network error')) {
    console.log('Check your internet connection');
  } else if (error.message.includes('401')) {
    console.log('Invalid API key');
  } else {
    console.log('Game not found or other error:', error.message);
  }
}

// ============================================
// Tips & Best Practices
// ============================================

/*
1. Use the useGames hook for most operations instead of calling the service directly
2. Always wrap async operations in try-catch blocks
3. Show loading states while fetching data
4. Implement error boundaries for better error handling
5. Cache results when possible to reduce API calls
6. Use pagination for large result sets
7. Add debouncing to search inputs to reduce API calls
8. Check that the API key is set in .env before deploying
9. Monitor API rate limits (20 requests/minute for free tier)
10. Test all error scenarios (network errors, invalid IDs, etc.)
*/
