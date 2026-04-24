import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useCart } from '../context/CartContext';
import { useGames } from '../context/GameContext';
import { formatPrice, formatDate } from '../utils/helpers';

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const { addItem } = useCart();
  const { fetchGameById } = useGames();

  useEffect(() => {
    async function loadGameDetails() {
      setIsLoading(true);
      setLoadError('');
      try {
        const data = await fetchGameById(id);
        setGame(data);
      } catch (err) {
        setLoadError(err.message || 'Game not found');
        setGame(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadGameDetails();
  }, [id, fetchGameById]);

  function handleAddToCart() {
    addItem(game);
    alert(`Added "${game.title}" to cart`);
  }

  if (isLoading) return (
    <div className='game-details-page'>
      <LoadingSpinner message='Loading game details...' />
    </div>
  );

  if (loadError) return (
    <ErrorMessage
      message={`Game not found or failed to load: ${loadError}`}
      onRetry={() => window.location.reload()}
      title='Game Not Available'
    />
  );

  if (!game) return (
    <ErrorMessage
      message="The game you're looking for doesn't exist or has been removed."
      title='Game Not Found'
    />
  );

  const platformText = game.platforms?.join(', ') || 'N/A';
  const metacriticText = game.metacritic ? `${game.metacritic}/100` : 'N/A';
  const playtimeText = game.playtime ? `${game.playtime}h` : 'N/A';
  const releaseYear = game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'Unknown';
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

  return (
    <div className='game-details-page'>
      <section className='game-details-header'>
        <div className='container'>
          <div className='game-details-header-row'>
            <div>
              <h1>Arcade Details</h1>
              <p>Everything you need before adding this title to your lineup.</p>
            </div>
            <Link to='/games' className='button-secondary'>Back to Games</Link>
          </div>
        </div>
      </section>

      <section className='game-details-content'>
        <div className='container game-details-grid'>
          <div className='game-main-panel'>
            <div className='game-main-image'>
              <img
                src={game.image || '/placeholder-game.jpg'}
                alt={game.title}
                className='game-cover-image'
                onError={(e) => e.target.src = '/placeholder-game.jpg'}
              />
            </div>

            <div className='game-description-panel'>
              <h2>About This Title</h2>
              <p>{game.description || 'No description available.'}</p>
            </div>

            <div className='game-description-panel'>
              <h2>At a Glance</h2>
              <div className='details-facts-grid'>
                <div className='details-fact-item'>
                  <span className='details-fact-label'>Genre</span>
                  <span className='details-fact-value'>{game.genre || 'Unknown'}</span>
                </div>
                <div className='details-fact-item'>
                  <span className='details-fact-label'>Release Date</span>
                  <span className='details-fact-value'>{formatDate(game.releaseDate)}</span>
                </div>
                <div className='details-fact-item'>
                  <span className='details-fact-label'>Developer</span>
                  <span className='details-fact-value'>{game.developer || 'Unknown'}</span>
                </div>
                <div className='details-fact-item'>
                  <span className='details-fact-label'>Metacritic</span>
                  <span className='details-fact-value'>{metacriticText}</span>
                </div>
              </div>
            </div>

            {tags.length > 0 && (
              <div className='game-description-panel'>
                <h2>Keywords</h2>
                <div className='tag-list'>
                  {tags.map((tag) => (
                    <span key={tag} className='tag-chip'>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            <div className='game-meta-grid'>
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
            </div>

            <div className='game-description-panel mobile-hide-on-small'>
              <h2>Editions</h2>
              <div className='requirements-grid'>
                {editionList.map((edition) => (
                  <div key={edition.name} className='meta-card'>
                    <p className='meta-label'>{edition.name}</p>
                    <p>{edition.details}</p>
                    <p className='edition-price'>{edition.price}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className='game-description-panel mobile-hide-on-small'>
              <h2>System Requirements</h2>
              <div className='requirements-grid'>
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
            </div>
          </div>

          <aside className='game-side-panel'>
            <h2 className='game-title'>{game.title}</h2>
            <p className='game-developer-name'>{game.developer || 'Unknown developer'}</p>

            <div className='game-price-box'>
              <p className='meta-label'>Price</p>
              <p className='game-price-value'>{formatPrice(game.price)}</p>
            </div>

            <div className='game-side-meta'>
              <div className='game-info-row'>
                <span>Release Date</span>
                <span>{formatDate(game.releaseDate)}</span>
              </div>
              <div className='game-info-row'>
                <span>Genre</span>
                <span>{game.genre || 'Unknown'}</span>
              </div>
              <div className='game-info-row'>
                <span>Rating</span>
                <span>{game.rating ? `${game.rating}/5` : 'No score yet'}</span>
              </div>
              <div className='game-info-row'>
                <span>Platforms</span>
                <span>{platformText}</span>
              </div>
            </div>

            <button type='button' onClick={handleAddToCart} className='button-primary full-width'>
              Add to Cart
            </button>

            {game.website && (
              <a href={game.website} target='_blank' rel='noopener noreferrer' className='button-secondary full-width text-center'>
                Official Website
              </a>
            )}
            <div className='side-link-wrap'>
              <Link to='/games' className='button-secondary full-width text-center'>Back to Games</Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default GameDetails;
