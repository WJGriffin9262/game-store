import { useMemo } from 'react';
import { Store } from 'lucide-react';
import { useApp } from '../context/AppContext';
import LayoutContainer from '../components/layout/LayoutContainer';
import PageHero from '../components/layout/PageHero';
import ButtonLink from '../components/ui/ButtonLink';
import CartEmptyState from '../components/cart/CartEmptyState';
import CartItemsPanel from '../components/cart/CartItemsPanel';
import CartOrderSummary from '../components/cart/CartOrderSummary';

export default function Cart() {
  const {
    cart,
    games,
    removeItem,
    updateQuantity,
    clearAllItems,
    subtotal,
    tax,
    total,
  } = useApp();

  const genreSuggestions = useMemo(() => {
    const fromCatalog = [...new Set(games.map((g) => g.genre).filter(Boolean))];
    if (fromCatalog.length > 0) return fromCatalog.slice(0, 6);
    return ['Action RPG', 'Puzzle', 'Racing', 'Adventure', 'Fighting'];
  }, [games]);

  const description =
    cart.length === 0
      ? 'Your voyage starts in the catalog—add games here when you’re ready.'
      : `${cart.length} title${cart.length !== 1 ? 's' : ''} in your hold—ready when you are.`;

  if (cart.length === 0) {
    return (
      <main className='cart-page'>
        <PageHero title='Cart' description={description} />
        <CartEmptyState genreSuggestions={genreSuggestions} />
      </main>
    );
  }

  const heroActions = (
    <ButtonLink to='/games' variant='secondary' className='page-hero__cta' icon={Store}>
      Continue browsing
    </ButtonLink>
  );

  return (
    <main className='cart-page'>
      <PageHero title='Cart' description={description} actions={heroActions} />

      <LayoutContainer className='cart-page__inner--compact'>
        <div className='cart__layout'>
          <section className='cart__main' aria-label='Cart items'>
            <CartItemsPanel
              cart={cart}
              onRemoveItem={removeItem}
              onUpdateQuantity={updateQuantity}
              onClearAll={clearAllItems}
            />
          </section>
          <CartOrderSummary cart={cart} subtotal={subtotal} tax={tax} total={total} />
        </div>
      </LayoutContainer>
    </main>
  );
}
