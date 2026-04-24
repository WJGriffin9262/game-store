import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GameCard from '../components/GameCard';
import { useGames } from '../context/GameContext';
import { useCart } from '../context/CartContext';
import { APP_NAME } from '../constants';

function Home() {
  const { games, fetchAllGames } = useGames();
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function loadFeaturedGames() {
      setIsLoading(true);
      setLoadError('');
      try {
        await fetchAllGames();
      } catch (err) {
        setLoadError(err.message || 'Failed to load games.');
      } finally {
        setIsLoading(false);
      }
    }

    loadFeaturedGames();
  }, [fetchAllGames]);

  const featuredGames = games.slice(0, 4);

  function handleAddToCart(game) {
    addItem(game);
    alert(`Added "${game.title}" to cart`);
  }

  return (
    <div className='home-page'>
      <section className='home-hero'>
        <div className='container home-hero-content'>
          <h1>{APP_NAME}</h1>
          <p>Drop into a neon-inspired game shelf built for arcade fans.</p>
          <div className='home-hero-actions'>
            <Link to='/games' className='button-primary'>Enter Arcade</Link>
            <Link to='/cart' className='button-secondary'>View Cart</Link>
          </div>
        </div>
      </section>

      <section className='w-full'>
        <div className='bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 sm:py-12'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <h2 className='text-4xl sm:text-5xl font-bold mb-4'>Arcade Picks</h2>
            <p className='text-gray-300 text-lg'>
              Starter picks to get your next high score run going.
            </p>
          </div>
        </div>

        <div className='bg-white py-12 sm:py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            {isLoading ? (
              <p className='text-center text-gray-600 py-12'>Loading arcade picks...</p>
            ) : loadError ? (
              <div className='text-center py-12'>
                <p className='text-gray-600 mb-4'>{loadError}</p>
                <button type='button' className='button-primary' onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </div>
            ) : featuredGames.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                {featuredGames.map((game) => (
                  <div key={game.id}>
                    <GameCard game={game} onAddToCart={handleAddToCart} />
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-center text-gray-600 py-12'>No arcade picks yet.</p>
            )}

            <div className='text-center mt-12'>
              <Link to='/games' className='button-secondary'>
                See Full Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
