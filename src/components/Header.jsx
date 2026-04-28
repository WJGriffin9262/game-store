import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Gamepad2, House, Menu, Moon, ShoppingCart, Store, Sun, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { APP_NAME } from '../utils/helpers';
import LayoutContainer from './LayoutContainer';

export default function Header() {
  const { itemCount, theme, toggleTheme } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const isDark = theme === 'dark';

  function closeMenu() {
    setMenuOpen(false);
  }

  function toggleMenu() {
    setMenuOpen((open) => !open);
  }

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [menuOpen]);

  const mobileNavOverlay =
    menuOpen &&
    createPortal(
      <div
        className='header__mobile-nav'
        role='dialog'
        aria-modal='true'
        aria-label='Site navigation'
      >
        <div className='header__mobile-nav__top'>
          <span className='header__mobile-nav__label'>Go to</span>
          <button
            type='button'
            className='header__mobile-nav__close header__icon-btn'
            onClick={closeMenu}
            aria-label='Close menu'
          >
            <X size={22} strokeWidth={2} aria-hidden />
          </button>
        </div>
        <nav className='header__mobile-nav__links' aria-label='Primary pages'>
          <Link to='/' className='header__mobile-nav__item' onClick={closeMenu}>
            <House className='header__mobile-nav__item-icon' aria-hidden />
            <span>Home</span>
          </Link>
          <Link to='/games' className='header__mobile-nav__item' onClick={closeMenu}>
            <Store className='header__mobile-nav__item-icon' aria-hidden />
            <span>Games</span>
          </Link>
          <Link to='/cart' className='header__mobile-nav__item' onClick={closeMenu}>
            <ShoppingCart className='header__mobile-nav__item-icon' aria-hidden />
            <span>Cart</span>
            {itemCount > 0 ? <span className='header__badge header__mobile-nav__badge'>{itemCount}</span> : null}
          </Link>
        </nav>
      </div>,
      document.body,
    );

  return (
    <>
      <header className='header'>
        <LayoutContainer>
          <nav className='header__nav' aria-label='Primary'>
            <Link
              to='/'
              className='header__brand'
              onClick={closeMenu}
              aria-label={`${APP_NAME}, home`}
            >
              <Gamepad2 className='header__brand-icon' size={28} strokeWidth={1.75} aria-hidden />
              <span className='header__brand-text'>{APP_NAME}</span>
            </Link>

            <div className='header__trailing'>
              <button
                type='button'
                className='header__theme-toggle header__icon-btn'
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                aria-pressed={isDark}
              >
                {isDark ? <Sun size={20} strokeWidth={2} aria-hidden /> : <Moon size={20} strokeWidth={2} aria-hidden />}
              </button>

              <button
                type='button'
                className='header__menu-toggle header__icon-btn'
                onClick={toggleMenu}
                aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
              </button>

              <ul className='header__list'>
                <li>
                  <Link to='/' className='header__link' onClick={closeMenu}>
                    <House className='icon' aria-hidden />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to='/games' className='header__link' onClick={closeMenu}>
                    <Store className='icon' aria-hidden />
                    Games
                  </Link>
                </li>
                <li>
                  <Link to='/cart' className='header__link' onClick={closeMenu}>
                    <ShoppingCart className='icon' aria-hidden />
                    Cart
                    {itemCount > 0 ? <span className='header__badge'>{itemCount}</span> : null}
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </LayoutContainer>
      </header>
      {mobileNavOverlay}
    </>
  );
}
