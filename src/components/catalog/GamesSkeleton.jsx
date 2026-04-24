export default function GamesSkeleton({ count = 8 }) {
  return (
    <div className='games-skeleton' aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className='skeleton-card skeleton-card--pulse'>
          <div className='skeleton-card__shine skeleton-card__media'>
            <div className='skeleton-card__block skeleton-card__fill' />
            <div className='skeleton-card__pill'>
              <div className='skeleton-card__block skeleton-card__pill-inner' />
            </div>
          </div>
          <div className='skeleton-card__content'>
            <div className='skeleton-card__block skeleton-card__line' />
            <div className='skeleton-card__block skeleton-card__line skeleton-card__line--short' />
            <div className='skeleton-card__block skeleton-card__line skeleton-card__line--muted' />
            <div className='skeleton-card__block skeleton-card__line skeleton-card__line--muted skeleton-card__line--shorter' />
            <div className='skeleton-card__rating-row'>
              <div className='skeleton-card__stars'>
                {[...Array(5)].map((__, starIndex) => (
                  <div key={starIndex} className='skeleton-card__block skeleton-card__star' />
                ))}
              </div>
              <div className='skeleton-card__block skeleton-card__score' />
            </div>
            <div className='skeleton-card__actions'>
              <div className='skeleton-card__block skeleton-card__price-bar' />
              <div className='skeleton-card__block skeleton-card__btn-bar' />
              <div className='skeleton-card__block skeleton-card__link-bar' />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
