import { Link } from 'react-router-dom';
import { formatPrice, truncateText } from '../utils/helpers';

function GameCard({ game, onAddToCart }) {
  function handleAddToCartClick() {
    if (typeof onAddToCart === 'function') {
      onAddToCart(game);
    }
  }
  const rating = Math.floor(game.rating || 0);
  const hasRating = rating > 0;

  return (
    <div className='bg-gray-800/90 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-[0_0_15px_rgba(255,0,255,0.2)] hover:scale-[1.02] transition-all duration-300 border border-gray-700/50 backdrop-blur-sm'>
      {/* Game Image */}
      <div className='relative w-full h-48 sm:h-56 bg-gray-700 overflow-hidden'>
        <img
          src={game.image || '/placeholder-game.jpg'}
          alt={game.title}
          className='w-full h-full object-cover'
          onError={(e) => e.target.src = '/placeholder-game.jpg'}
        />
        <div className='absolute top-3 right-3 bg-neon-blue/20 text-neon-cyan px-3 py-1 rounded-full text-sm font-semibold border border-neon-blue/30 backdrop-blur-sm'>
          {game.genre}
        </div>
      </div>

      {/* Content */}
      <div className='p-4 sm:p-6 flex flex-col h-full'>
        {/* Title */}
        <h3 className='text-lg sm:text-xl font-bold text-gray-100 mb-2 line-clamp-2'>
          {game.title}
        </h3>

        {/* Description */}
        <p className='text-sm text-gray-400 mb-3 line-clamp-2 opacity-80'>
          {truncateText(game.description, 80)}
        </p>

        {/* Rating */}
        <div className='flex items-center gap-2 mb-4'>
          <div className='text-sm'>
            {hasRating ? (
              <>
                <span className='text-yellow-400'>{'★'.repeat(rating)}</span>
                <span className='ml-1 text-gray-400 font-medium opacity-80'>{game.rating || 'N/A'}</span>
              </>
            ) : (
              <span className='text-gray-400 opacity-70'>No rating</span>
            )}
          </div>
        </div>

        {/* Price and Actions */}
        <div className='mt-auto space-y-3 border-t border-gray-700/50 pt-4'>
          <div className='flex justify-between items-center'>
            <span className='text-2xl sm:text-3xl font-bold text-neon-cyan'>
              {formatPrice(game.price)}
            </span>
          </div>

          <div className='flex gap-2'>
            <button
              type='button'
              className='flex-1 bg-gradient-to-r from-neon-blue to-neon-cyan text-gray-900 py-2 px-4 rounded-lg font-semibold hover:shadow-[0_0_12px_rgba(30,144,255,0.4)] transition-all duration-300'
              onClick={handleAddToCartClick}
            >
              Add to Cart
            </button>
          </div>

          <Link
            to={`/games/${game.id}`}
            className='block text-center text-neon-cyan hover:text-neon-pink font-medium transition-colors duration-300 opacity-90 hover:opacity-100'
          >
            View game details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
