import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice, PLACEHOLDER_GAME_IMAGE, handleGameImageError } from '../../utils/helpers';

export default function CartLineItem({ item, onRemove, onUpdateQuantity }) {
  return (
    <div className='cart__item'>
      <div className='cart__item-grid'>
        <div className='cart__item-cell--product'>
          <div className='cart__product-row'>
            <div className='cart__thumb'>
              <img
                src={item.image || PLACEHOLDER_GAME_IMAGE}
                alt={item.title}
                className='cart__thumb-img'
                onError={handleGameImageError}
              />
            </div>
            <div>
              <Link to={`/games/${item.id}`} className='cart__title-link'>
                {item.title}
              </Link>
              <p className='cart__developer'>{item.developer || 'Unknown developer'}</p>
            </div>
          </div>
        </div>

        <div className='cart__item-cell--price'>
          <span className='cart__price'>{formatPrice(item.price)}</span>
        </div>

        <div className='cart__item-cell--qty'>
          <div className='cart__qty-group'>
            <button
              type='button'
              className='cart__qty-btn'
              disabled={item.quantity <= 1}
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              aria-label='Decrease quantity'
            >
              <Minus className='icon' strokeWidth={2} aria-hidden />
            </button>
            <input
              type='number'
              min='1'
              className='cart__qty-input'
              value={item.quantity}
              onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value, 10) || 1)}
              aria-label={`Quantity for ${item.title}`}
            />
            <button
              type='button'
              className='cart__qty-btn'
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              aria-label='Increase quantity'
            >
              <Plus className='icon' strokeWidth={2} aria-hidden />
            </button>
          </div>
        </div>

        <div className='cart__item-cell--total'>
          <span className='cart__line-total'>{formatPrice(item.price * item.quantity)}</span>
        </div>

        <div className='cart__item-cell--remove'>
          <button
            type='button'
            className='cart__remove'
            onClick={() => onRemove(item.id)}
            title='Remove item'
          >
            <Trash2 className='icon icon--md' strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
