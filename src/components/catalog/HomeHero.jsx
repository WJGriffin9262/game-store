import { Link } from 'react-router-dom';
import { LayoutGrid, ShoppingCart } from 'lucide-react';
import LayoutContainer from '../layout/LayoutContainer';
import { APP_NAME } from '../../utils/helpers';

export default function HomeHero() {
  return (
    <section className='home-hero' aria-labelledby='home-hero-title'>
      <LayoutContainer className='home-hero__inner'>
        <p className='home-hero__badge'>Start your journey</p>
        <h1 id='home-hero-title' className='home-hero__title'>
          Find your next game on <span className='home-hero__emphasis'>{APP_NAME}</span>
        </h1>
        <p className='home-hero__desc'>
          Explore the catalog, dive into every title, and build your cart at your own pace—clear,
          calm, and built for players.
        </p>
        <div className='home-hero__actions'>
          <Link to='/games' className='button-primary'>
            <LayoutGrid className='icon icon--md' aria-hidden />
            Browse catalog
          </Link>
          <Link to='/cart' className='button-secondary'>
            <ShoppingCart className='icon icon--md' aria-hidden />
            View cart
          </Link>
        </div>
      </LayoutContainer>
    </section>
  );
}
