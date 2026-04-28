import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ShoppingCart } from 'lucide-react';
import ErrorDisplay from '../components/ErrorDisplay';
import LayoutContainer from '../components/LayoutContainer';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';
import { useApp } from '../context/AppContext';
import {
  formatPrice,
  formatDate,
  PLACEHOLDER_GAME_IMAGE,
  handleGameImageError,
} from '../utils/helpers';
import { useGameDetails } from '../hooks/useGameDetails';
import { fetchSteamGameNews } from '../gamesApi';

export default function GameDetails() {
  const { id } = useParams();
  const { addItem, fetchGameById, showToast } = useApp();
  const { game, isLoading, loadError } = useGameDetails(id, fetchGameById);

  const [steamNewsItems, setSteamNewsItems] = useState([]);

  useEffect(() => {
    if (!game?.id) {
      setSteamNewsItems([]);
      return undefined;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchSteamGameNews(game.id);
        const rows = data?.appnews?.newsitems;
        if (!Array.isArray(rows) || cancelled) return;
        setSteamNewsItems(
          rows.slice(0, 3).map((n) => ({
            heading: String(n.title || n.feedlabel || '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/\[[^\]]*\]/g, ' ')
              .replace(/\s+/g, ' ')
              .trim(),
            url: typeof n.url === 'string' ? n.url : null,
          })),
        );
      } catch {
        if (!cancelled) setSteamNewsItems([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [game?.id]);

  function handleAddToCart() {
    addItem(game);
    showToast(`Added "${game.title}" to cart`);
  }

  if (isLoading) {
    return (
      <main className='details-page'>
        <LoadingSpinner message='Loading this title from the catalog…' />
      </main>
    );
  }

  if (loadError) {
    return (
      <main className='details-page'>
        <ErrorDisplay
          message={`Game not found or failed to load: ${loadError}`}
          onRetry={() => window.location.reload()}
          title='Game Not Available'
        />
      </main>
    );
  }

  if (!game) {
    return (
      <main className='details-page'>
        <ErrorDisplay
          message="The game you're looking for doesn't exist or has been removed."
          title='Game Not Found'
        />
      </main>
    );
  }

  const platformText = game.platforms?.join(', ') || 'N/A';
  const metacriticText = game.metacritic ? `${game.metacritic}/100` : 'N/A';
  const playtimeText = game.playtime ? `${game.playtime}h` : 'N/A';
  const releaseYear = game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'Unknown';
  const releaseLabel = game.releaseDate ? formatDate(game.releaseDate) : 'TBD';
  const tags = Array.isArray(game.tags) ? game.tags.slice(0, 8) : [];
  const minimumRequirements = [
    `OS: ${game.platforms?.includes('PC') ? 'Windows 10' : 'Platform supported OS'}`,
    'CPU: Quad-core 3.0 GHz',
    'Memory: 8 GB RAM',
    'Graphics: 4 GB VRAM',
    'Storage: 40 GB available space',
  ];
  const recommendedRequirements = [
    'CPU: 6-core 3.5 GHz',
    'Memory: 16 GB RAM',
    'Graphics: 8 GB VRAM',
    'Storage: SSD with 40 GB free',
  ];
  const editionList = [
    {
      name: 'Standard Edition',
      details: 'Base game with all current updates.',
      price: formatPrice(game.price),
    },
    {
      name: 'Deluxe Edition',
      details: 'Base game plus soundtrack and cosmetic pack.',
      price: formatPrice(game.price + 12),
    },
  ];
  const subtitle = [game.developer || 'Unknown developer', game.genre].filter(Boolean).join(' · ');

  return (
    <main className='details-page'>
      <header className='details-page__header'>
        <LayoutContainer>
          <div className='details-page__header-row'>
            <div>
              <p className='details-page__kicker'>Catalog deep dive</p>
              <h1 className='details-page__title'>{game.title}</h1>
              <p className='details-page__subtitle'>{subtitle}</p>
            </div>
            <ButtonLink to='/games' variant='secondary' icon={ArrowLeft}>
              Back to Games
            </ButtonLink>
          </div>
        </LayoutContainer>
      </header>

      <section className='details-page__content'>
        <LayoutContainer className='details-page__grid'>
          <div className='details-page__main'>
            <div className='details-page__cover-wrap'>
              <img
                src={game.image || PLACEHOLDER_GAME_IMAGE}
                alt={game.title}
                className='details-page__cover-img'
                onError={handleGameImageError}
              />
            </div>

            <section className='details-page__block'>
              <h2>About This Title</h2>
              <p>{game.storyline || game.description || 'No description available.'}</p>
            </section>

            <section className='details-page__block'>
              <h2>At a Glance</h2>
              <div className='details-page__facts'>
                <div className='details-page__fact'>
                  <span className='details-page__fact-label'>Genre</span>
                  <span className='details-page__fact-value'>{game.genre || 'Unknown'}</span>
                </div>
                <div className='details-page__fact'>
                  <span className='details-page__fact-label'>Release Date</span>
                  <span className='details-page__fact-value'>{releaseLabel}</span>
                </div>
                <div className='details-page__fact'>
                  <span className='details-page__fact-label'>Developer</span>
                  <span className='details-page__fact-value'>{game.developer || 'Unknown'}</span>
                </div>
                <div className='details-page__fact'>
                  <span className='details-page__fact-label'>Metacritic</span>
                  <span className='details-page__fact-value'>{metacriticText}</span>
                </div>
              </div>
            </section>

            {tags.length > 0 ? (
              <section className='details-page__block'>
                <h2>Keywords</h2>
                <div className='tag-list'>
                  {tags.map((tag) => (
                    <span key={tag} className='tag-chip'>
                      {tag}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {steamNewsItems.length > 0 ? (
              <section className='details-page__block' aria-label='Steam news'>
                <h2>News from Steam</h2>
                <ul className='details-page__news-list'>
                  {steamNewsItems.map((item, idx) => (
                    <li key={`steam-news-${game.id}-${idx}`} className='details-page__news-item'>
                      {item.url ? (
                        <a href={item.url} target='_blank' rel='noopener noreferrer'>
                          {item.heading}
                        </a>
                      ) : (
                        item.heading
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className='details-page__tiles' aria-label='Quick facts'>
              <div className='meta-card'>
                <p className='meta-label'>Platforms</p>
                <p>{platformText}</p>
              </div>
              <div className='meta-card'>
                <p className='meta-label'>Publisher</p>
                <p>{game.publisher || 'Unknown'}</p>
              </div>
              <div className='meta-card'>
                <p className='meta-label'>Metacritic</p>
                <p>{metacriticText}</p>
              </div>
              <div className='meta-card'>
                <p className='meta-label'>Playtime</p>
                <p>{playtimeText}</p>
              </div>
              <div className='meta-card'>
                <p className='meta-label'>Release Year</p>
                <p>{releaseYear}</p>
              </div>
              <div className='meta-card'>
                <p className='meta-label'>Store Availability</p>
                <p>Digital download</p>
              </div>
            </section>

            <section className='details-page__block mobile-hide-on-small'>
              <h2>Editions</h2>
              <div className='details-page__requirements'>
                {editionList.map((edition) => (
                  <div key={edition.name} className='meta-card'>
                    <p className='meta-label'>{edition.name}</p>
                    <p>{edition.details}</p>
                    <p className='edition-price'>{edition.price}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className='details-page__block mobile-hide-on-small'>
              <h2>System Requirements</h2>
              <div className='details-page__requirements'>
                <div className='meta-card'>
                  <p className='meta-label'>Minimum</p>
                  <ul className='requirements-list'>
                    {minimumRequirements.map((requirement) => (
                      <li key={requirement}>{requirement}</li>
                    ))}
                  </ul>
                </div>
                <div className='meta-card'>
                  <p className='meta-label'>Recommended</p>
                  <ul className='requirements-list'>
                    {recommendedRequirements.map((requirement) => (
                      <li key={requirement}>{requirement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <aside className='details-page__aside'>
            <div className='details-page__price-box'>
              <p className='meta-label'>Price</p>
              <p className='details-page__price-value'>{formatPrice(game.price)}</p>
            </div>

            <div className='details-page__side-meta'>
              <div className='details-page__info-row'>
                <span>Release Date</span>
                <span>{releaseLabel}</span>
              </div>
              <div className='details-page__info-row'>
                <span>Genre</span>
                <span>{game.genre || 'Unknown'}</span>
              </div>
              <div className='details-page__info-row'>
                <span>Rating</span>
                <span>{game.rating ? `${game.rating}/5` : 'No score yet'}</span>
              </div>
              <div className='details-page__info-row'>
                <span>Platforms</span>
                <span>{platformText}</span>
              </div>
            </div>

            <Button variant='primary' className='full-width' onClick={handleAddToCart} icon={ShoppingCart}>
              Add to Cart
            </Button>

            {game.website ? (
              <a
                href={game.website}
                target='_blank'
                rel='noopener noreferrer'
                className='button-secondary full-width text-center'
              >
                <ExternalLink className='icon icon--md' aria-hidden />
                Official Website
              </a>
            ) : null}

            <div className='details-page__link-wrap'>
              <ButtonLink to='/games' variant='secondary' className='full-width text-center' icon={ArrowLeft}>
                Back to Games
              </ButtonLink>
            </div>
          </aside>
        </LayoutContainer>
      </section>
    </main>
  );
}
