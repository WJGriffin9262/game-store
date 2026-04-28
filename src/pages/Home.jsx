import { LayoutGrid, RotateCcw } from 'lucide-react';
import GameGrid from '../components/GameGrid';
import HomeHero from '../components/HomeHero';
import LayoutContainer from '../components/LayoutContainer';
import PageHero from '../components/PageHero';
import Button from '../components/Button';
import ButtonLink from '../components/ButtonLink';
import { useApp } from '../context/AppContext';
import { APP_NAME } from '../utils/helpers';
import { useFeaturedGames } from '../hooks/useFeaturedGames';

export default function Home() {
  const { games, fetchAllGames, addItem, showToast } = useApp();
  const { isLoading, loadError } = useFeaturedGames(fetchAllGames);

  const featuredGames = games.slice(0, 4);

  function handleAddToCart(game) {
    addItem(game);
    showToast(`Added "${game.title}" to cart`);
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
            {isLoading ? (
              <p className='home__status'>Loading featured titles…</p>
            ) : loadError ? (
              <div className='home__error'>
                <p className='home__error-text'>{loadError}</p>
                <Button variant='primary' onClick={() => window.location.reload()} icon={RotateCcw}>
                  Try again
                </Button>
              </div>
            ) : featuredGames.length > 0 ? (
              <GameGrid games={featuredGames} onAddToCart={handleAddToCart} />
            ) : (
              <p className='home__status'>No featured titles yet.</p>
            )}

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
