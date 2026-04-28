import { useEffect, useState } from 'react';
import { LayoutGrid, RotateCcw } from 'lucide-react';
import GameGrid from '../components/games/GameGrid';
import HomeHero from '../components/home/HomeHero';
import LayoutContainer from '../components/layout/LayoutContainer';
import PageHero from '../components/layout/PageHero';
import Button from '../components/ui/Button';
import ButtonLink from '../components/ui/ButtonLink';
import { useApp } from '../context/AppContext';
import { APP_NAME } from '../utils/helpers';

export default function Home() {
  const { games, fetchAllGames, addItem, showToast } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setIsLoading(true);
      setLoadError('');
      try {
        await fetchAllGames();
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Failed to load games.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [fetchAllGames]);

  const featuredGames = games.slice(0, 4);

  function handleAddToCart(game) {
    addItem(game);
    showToast(`Added "${game.title}" to cart`);
  }

  let featuredBody;
  if (isLoading) {
    featuredBody = <p className='home__status'>Loading featured titles…</p>;
  } else if (loadError) {
    featuredBody = (
      <div className='home__error'>
        <p className='home__error-text'>{loadError}</p>
        <Button variant='primary' onClick={() => window.location.reload()} icon={RotateCcw}>
          Try again
        </Button>
      </div>
    );
  } else if (featuredGames.length > 0) {
    featuredBody = <GameGrid games={featuredGames} onAddToCart={handleAddToCart} />;
  } else {
    featuredBody = <p className='home__status'>No featured titles yet.</p>;
  }

  return (
    <main className='home'>
      <HomeHero />

      <section className='home__section' aria-labelledby='featured-heading'>
        <PageHero
          title='Featured titles'
          description={`Hand-picked highlights from the catalog—see what's new on ${APP_NAME}.`}
          headingTag='h2'
          headingId='featured-heading'
        />

        <div className='home__featured-intro'>
          <LayoutContainer>
            {featuredBody}

            <div className='home__featured-actions'>
              <ButtonLink to='/games' variant='secondary' icon={LayoutGrid}>
                View full catalog
              </ButtonLink>
            </div>
          </LayoutContainer>
        </div>
      </section>
    </main>
  );
}
