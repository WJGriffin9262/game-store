import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GameCard, GameGridSkeleton, ErrorMessage } from '../components';
import { useGames, useCart } from '../hooks';
import { debounce } from '../utils';

function Games() {
  const { games, loading, error, fetchAllGames, searchGames } = useGames();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [displayedGames, setDisplayedGames] = useState([]);

  // Load initial games
  useEffect(() => {
    fetchAllGames();
  }, [fetchAllGames]);

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce(async (term) => {
      if (term.trim()) {
        await searchGames(term);
      } else {
        await fetchAllGames();
      }
    }, 500),
    [searchGames, fetchAllGames]
  );

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  // Sort games based on selected option
  useEffect(() => {
    let sorted = [...games];

    switch (sortBy) {
      case 'rating-high':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'rating-low':
        sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case 'name-a-z':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-z-a':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'price-low':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      default:
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setDisplayedGames(sorted);
  }, [games, sortBy]);

  const handleAddToCart = (game) => {
    addItem(game);
    alert(`${game.title} added to cart!`);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    fetchAllGames();
  };

  if (loading && games.length === 0) {
    return (
      <div className="w-full bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-bold mb-2">Game Library</h1>
            <p className="text-xl text-gray-300 mb-8">
              Browse our complete collection of games and find your next favorite
            </p>
          </div>
        </div>

        {/* Skeleton Loading */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GameGridSkeleton count={8} />
        </div>
      </div>
    );
  }
  if (error && games.length === 0) return <ErrorMessage message={error} onRetry={fetchAllGames} />;

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">Game Library</h1>
          <p className="text-xl text-gray-300 mb-8">
            Browse our complete collection of games and find your next favorite
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search games by title..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full px-4 py-3 pr-10 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            {searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="bg-gray-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Info and Sorting */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <p className="text-gray-700 font-medium">
                <span className="text-lg text-blue-600 font-bold">{displayedGames.length}</span>
                {' '}game{displayedGames.length !== 1 ? 's' : ''} found
              </p>
              {searchTerm && (
                <p className="text-gray-600 text-sm mt-1">
                  Search results for: <span className="font-semibold text-gray-900">"{searchTerm}"</span>
                </p>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="w-full sm:w-auto">
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2 sm:mb-0 sm:inline sm:mr-3">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all bg-white cursor-pointer"
              >
                <option value="rating">⭐ Highest Rated</option>
                <option value="rating-low">⭐ Lowest Rated</option>
                <option value="name-a-z">A-Z Title</option>
                <option value="name-z-a">Z-A Title</option>
                <option value="price-low">💰 Price: Low to High</option>
                <option value="price-high">💰 Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading && games.length > 0 && (
            <div className="flex items-center justify-center gap-2 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="inline-block w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
              <p className="text-blue-700 font-medium">Updating results...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              className="mb-6 p-6 bg-red-50 rounded-xl border border-red-200"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">
                    {error.includes('Network') ? 'Connection Problem' : 'Unable to Load Games'}
                  </h3>
                  <p className="text-red-700 mb-4 leading-relaxed">
                    {error.includes('Network')
                      ? 'Please check your internet connection and try again.'
                      : error
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={fetchAllGames}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Try Again
                    </button>
                    {error.includes('Network') && (
                      <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                      >
                        Refresh Page
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Games Grid */}
          {displayedGames.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {displayedGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-16 sm:py-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="max-w-md mx-auto">
                {/* Empty State Icon */}
                <motion.div
                  className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </motion.div>

                {/* Empty State Content */}
                <motion.h3
                  className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {searchTerm ? 'No games found' : 'No games available'}
                </motion.h3>

                <motion.p
                  className="text-gray-600 mb-8 text-lg leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {searchTerm
                    ? `We couldn't find any games matching "${searchTerm}". Try adjusting your search or browse our full collection.`
                    : 'There are no games available at the moment. Please check back later or contact support.'}
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  {searchTerm && (
                    <motion.button
                      onClick={handleClearSearch}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear Search
                    </motion.button>
                  )}
                  <motion.button
                    onClick={fetchAllGames}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    View All Games
                  </motion.button>
                </motion.div>

                {/* Suggestions */}
                {searchTerm && (
                  <motion.div
                    className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Try these suggestions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {['Action', 'RPG', 'Strategy', 'Adventure', 'Indie'].map((genre) => (
                        <button
                          key={genre}
                          onClick={() => setSearchTerm(genre)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors"
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Info Section */}
      {displayedGames.length > 0 && (
        <div className="bg-white border-t border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600">
              Showing <span className="font-bold text-gray-900">{displayedGames.length}</span> games in total
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Games;
