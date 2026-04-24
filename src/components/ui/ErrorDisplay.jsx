import { AlertTriangle, House, Mail, RotateCcw } from 'lucide-react';
import { SUPPORT_EMAIL } from '../../utils/helpers';
import Button from './Button';

export default function ErrorDisplay({ message, onRetry, title = 'Something went wrong' }) {
  function handleGoHome() {
    window.location.assign('/');
  }

  return (
    <div className='error-page'>
      <div className='error-page__card'>
        <div className='error-page__head'>
          <div className='error-page__icon-wrap'>
            <AlertTriangle className='error-page__icon' size={32} strokeWidth={2} aria-hidden />
          </div>
          <h2 className='error-page__title'>{title}</h2>
        </div>

        <div className='error-page__body'>
          <p className='error-page__message'>
            {message || 'We hit a snag. Try again or head home.'}
          </p>

          <div className='error-page__actions'>
            {onRetry ? (
              <Button variant='primary' className='button-ghost--grow' onClick={onRetry} icon={RotateCcw}>
                Try again
              </Button>
            ) : null}
            <Button
              variant='secondary'
              className='button-ghost--grow'
              onClick={handleGoHome}
              icon={House}
            >
              Go home
            </Button>
          </div>

          <div className='error-page__footer'>
            <p className='error-page__help'>
              <span>Need help?</span>
              <a href={`mailto:${SUPPORT_EMAIL}`} className='error-page__mailto'>
                <Mail className='icon' aria-hidden />
                {SUPPORT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
