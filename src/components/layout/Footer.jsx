import { Link } from 'react-router-dom';
import { APP_NAME, SUPPORT_EMAIL } from '../../utils/helpers';
import LayoutContainer from './LayoutContainer';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <LayoutContainer>
        <div className='footer__content'>
          <div className='footer__col'>
            <h3 className='footer__title'>{APP_NAME}</h3>
            <p className='footer__text'>
              Discover games, read the details, and sail through checkout—your catalog journey in one
              place.
            </p>
          </div>

          <div className='footer__col'>
            <h4 className='footer__heading'>Browse</h4>
            <ul className='footer__links'>
              <li>
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/games'>Games</Link>
              </li>
              <li>
                <Link to='/cart'>Cart</Link>
              </li>
            </ul>
          </div>

          <div className='footer__col'>
            <h4 className='footer__heading'>Player Support</h4>
            <p className='footer__text'>
              Need help? Contact{' '}
              <a href={`mailto:${SUPPORT_EMAIL}`} className='footer__meta-link'>
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
        </div>

        <div className='footer__bottom'>
          <p className='footer__copy'>
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className='footer__meta'>
            <a href='#privacy' className='footer__meta-link'>
              Privacy
            </a>
            <a href='#terms' className='footer__meta-link'>
              Terms
            </a>
          </div>
        </div>
      </LayoutContainer>
    </footer>
  );
}
