import { Link } from 'react-router-dom';
import { ChevronRight, ShoppingCart } from 'lucide-react';
import {
  formatPrice,
  truncateText,
  PLACEHOLDER_GAME_IMAGE,
  handleGameImageError,
} from '../../utils/helpers';

export default function GameCard({ game, onAddToCart }) {
  function handleAddToCartClick() {
    onAddToCart?.(game);
  }

  const rating = Math.floor(game.rating || 0);
  const hasRating = rating > 0;
  const imageSrc = game.image || PLACEHOLDER_GAME_IMAGE;

  return (
    <article className='game-card'>
      <div className='game-card__media'>
        <img src={imageSrc} alt={game.title} onError={handleGameImageError} loading='lazy' />
        <span className='game-card__genre'>{game.genre}</span>
      </div>

      <div className='game-card__body'>
        <h3 className='game-card__title'>{game.title}</h3>

        <p className='game-card__desc'>{truncateText(game.description, 80)}</p>

        <div className='game-card__rating-row'>
          {hasRating ? (
            <>
              <span className='game-card__stars'>{'★'.repeat(rating)}</span>
              <span className='game-card__rating-num'>{game.rating || 'N/A'}</span>
            </>
          ) : (
            <span className='game-card__rating-num game-card__rating-num--muted'>No rating</span>
          )}
        </div>

        <div className='game-card__actions'>
          <div className='game-card__price-row'>
            <span className='game-card__price'>{formatPrice(game.price)}</span>
          </div>

          <button type='button' className='game-card__add-btn' onClick={handleAddToCartClick}>
            <ShoppingCart className='icon' aria-hidden />
            Add to Cart
          </button>

          <Link to={`/games/${game.id}`} className='game-card__detail-link'>
            View game details
            <ChevronRight className='icon' aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
