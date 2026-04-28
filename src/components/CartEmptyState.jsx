import { Link } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';
import LayoutContainer from './LayoutContainer';
import GenreSuggestions from './GenreSuggestions';

export default function CartEmptyState({ genreSuggestions }) {
  return (
    <LayoutContainer className='cart-page__inner'>
      <div className='cart__empty'>
        <div className='cart__empty-icon'>
          <ShoppingBag className='cart__empty-svg' size={44} strokeWidth={1.75} aria-hidden />
        </div>
        <h2 className='cart__empty-title'>Nothing here yet</h2>
        <p className='cart__empty-text'>
          Add titles from the catalog and they&apos;ll appear here—your cart is the next stop on the
          journey.
        </p>
        <Link to='/games' className='button-primary'>
          <Search className='icon icon--md' aria-hidden />
          Browse the catalog
        </Link>
        <GenreSuggestions genres={genreSuggestions} />
      </div>
    </LayoutContainer>
  );
}
