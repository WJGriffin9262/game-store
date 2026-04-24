import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { APP_NAME } from '../constants';

function Header() {
  const { itemCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleToggleMenu() {
    setIsMenuOpen((prevState) => !prevState);
  }

  function handleCloseMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className='site-header'>
      <div className='container'>
        <nav className='site-nav'>
          <Link
            to='/'
            className='site-brand'
            onClick={handleCloseMenu}
            aria-label={`${APP_NAME}, home`}
          >
            <svg
              className='site-brand-logo'
              viewBox='0 0 32 32'
              width='32'
              height='32'
              aria-hidden='true'
              focusable='false'
            >
              <rect
                x='4'
                y='14'
                width='24'
                height='14'
                rx='3'
                fill='none'
                stroke='currentColor'
                strokeWidth='1.5'
              />
              <line
                x1='16'
                y1='14'
                x2='16'
                y2='8'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
              <circle cx='16' cy='6' r='3.5' fill='currentColor' />
              <circle cx='10' cy='20' r='2' fill='currentColor' opacity='0.85' />
              <circle cx='22' cy='20' r='2' fill='currentColor' opacity='0.85' />
            </svg>
            <span className='site-brand-text'>{APP_NAME}</span>
          </Link>
          <button
            type='button'
            className='mobile-menu-button'
            onClick={handleToggleMenu}
            aria-label='Toggle navigation menu'
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <ul className={`site-nav-list ${isMenuOpen ? 'is-open' : ''}`}>
            <li>
              <Link to='/' className='site-nav-link' onClick={handleCloseMenu}>Home</Link>
            </li>
            <li>
              <Link to='/games' className='site-nav-link' onClick={handleCloseMenu}>Games</Link>
            </li>
            <li>
              <Link to='/cart' className='site-cart-link' onClick={handleCloseMenu}>
                Cart
                {itemCount > 0 && (
                  <span className='cart-count-badge'>
                    {itemCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
