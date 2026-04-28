import { Link } from 'react-router-dom';
import { CreditCard, Store } from 'lucide-react';
import { formatPrice } from '../utils/helpers';

export default function CartOrderSummary({ cart, subtotal, tax, total }) {
  const unitCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className='cart__summary'>
      <h2 className='cart__summary-title'>Order summary</h2>

      <div className='cart__summary-rows'>
        <div className='cart__summary-row'>
          <span className='cart__summary-label'>
            Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})
          </span>
          <span className='cart__summary-value'>{formatPrice(subtotal)}</span>
        </div>
        <div className='cart__summary-row'>
          <span className='cart__summary-label'>Tax (8.25%)</span>
          <span className='cart__summary-value'>{formatPrice(tax)}</span>
        </div>
        <div className='cart__summary-row cart__summary-total'>
          <span className='cart__summary-total-label'>Total</span>
          <span className='cart__summary-total-value'>{formatPrice(total)}</span>
        </div>
      </div>

      <div className='cart__summary-actions'>
        <button type='button' className='button-primary full-width'>
          <CreditCard className='icon icon--md' aria-hidden />
          Continue to checkout
        </button>
        <Link to='/games' className='button-secondary full-width text-center'>
          <Store className='icon icon--md' aria-hidden />
          Keep browsing
        </Link>
      </div>

      <div className='cart__stats mobile-hide-on-small'>
        <div className='cart__stats-text'>
          <div className='cart__stats-row'>
            <span>Games in cart</span>
            <span className='cart__stats-strong'>{cart.length}</span>
          </div>
          <div className='cart__stats-row'>
            <span>Total units</span>
            <span className='cart__stats-strong'>{unitCount}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
