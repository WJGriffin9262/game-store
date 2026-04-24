import { Link } from 'react-router-dom';
import { APP_NAME } from '../constants';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='site-footer'>
      <div className='container'>
        <div className='site-footer-content'>
          <div>
            <h3 className='site-footer-title'>{APP_NAME}</h3>
            <p className='site-footer-text'>
              Classic arcade energy with modern game picks.
            </p>
          </div>

          <div>
            <h4 className='site-footer-heading'>Browse</h4>
            <ul className='site-footer-links'>
              <li><Link to='/'>Home</Link></li>
              <li><Link to='/games'>Games</Link></li>
              <li><Link to='/cart'>Cart</Link></li>
            </ul>
          </div>

          <div>
            <h4 className='site-footer-heading'>Player Support</h4>
            <p className='site-footer-text'>Need help? Contact support@retroarcade77.com</p>
          </div>
        </div>

        <div className='site-footer-bottom'>
          <p>
            &copy; {currentYear} {APP_NAME}. All rights reserved.
          </p>
          <div className='site-footer-meta'>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
