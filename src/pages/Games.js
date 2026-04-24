import { useEffect, useState } from 'react';
import GameCard from '../components/GameCard';
import GameGridSkeleton from '../components/GameGridSkeleton';
import { useGames } from '../context/GameContext';
import { useCart } from '../context/CartContext';

function Games() {
  const { games, fetchAllGames, loading } = useGames();
  const { addItem } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('title-asc');

  useEffect(() => {
    fetchAllGames();
  }, [fetchAllGames]);

  const handleAddToCart = (game) => {
    addItem(game);
    alert(`Added "${game.title}" to cart`);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const genreOptions = ['all', ...new Set(games.map((game) => game.genre).filter(Boolean))];
  const platformOptions = ['all', ...new Set(games.flatMap((game) => game.platforms || []))];

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredGames = games
    .filter((game) => {
      const matchesSearch = !normalizedSearch
        || game.title.toLowerCase().includes(normalizedSearch)
        || (game.developer || '').toLowerCase().includes(normalizedSearch);
      const matchesGenre = selectedGenre === 'all' || game.genre === selectedGenre;
      const matchesPlatform = selectedPlatform === 'all' || (game.platforms || []).includes(selectedPlatform);
      return matchesSearch && matchesGenre && matchesPlatform;
    })
    .sort((firstGame, secondGame) => {
      if (sortBy === 'price-low') return firstGame.price - secondGame.price;
      if (sortBy === 'price-high') return secondGame.price - firstGame.price;
      if (sortBy === 'rating-high') return (secondGame.rating || 0) - (firstGame.rating || 0);
      return firstGame.title.localeCompare(secondGame.title);
    });

  if (loading) {
    return <GameGridSkeleton />;
  }

  return (
    <div className='w-full'>
      <div className='bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 sm:py-12'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <h1 className='text-4xl sm:text-5xl font-bold mb-4'>Arcade Catalog</h1>
          <p className='text-gray-300 text-lg'>
            Browse every title in the Retro Arcade 77 lineup.
          </p>
        </div>
      </div>

      <div className='bg-gray-50 py-6 sm:py-8 border-b border-gray-200'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4'>
          <input
            type='text'
            placeholder='Search arcade titles...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mobile-filter-grid'>
            <select
              value={selectedGenre}
              onChange={(event) => setSelectedGenre(event.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-lg bg-white'
            >
              {genreOptions.map((genre) => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </select>
            <select
              value={selectedPlatform}
              onChange={(event) => setSelectedPlatform(event.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-lg bg-white'
            >
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {platform === 'all' ? 'All Platforms' : platform}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className='px-3 py-2 border border-gray-300 rounded-lg bg-white'
            >
              <option value='title-asc'>Sort: Title A-Z</option>
              <option value='price-low'>Sort: Price Low to High</option>
              <option value='price-high'>Sort: Price High to Low</option>
              <option value='rating-high'>Sort: Top Rated</option>
            </select>
          </div>
          <p className='text-sm text-gray-600 mobile-hide-on-small'>
            {filteredGames.length} title{filteredGames.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>

      <div className='bg-white py-12 sm:py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          {filteredGames.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {filteredGames.map((game) => (
                <div key={game.id}>
                  <GameCard
                    game={game}
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className='max-w-md mx-auto p-6 bg-yellow-50 rounded-xl border border-yellow-200 text-center'>
              <h3 className='text-lg font-semibold text-yellow-800 mb-2'>No Titles Found</h3>
              <p className='text-yellow-700 mb-4 text-sm'>Try a different title or clear the search.</p>
              <button
                onClick={() => setSearchTerm('')}
                className='px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium'
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Games;
