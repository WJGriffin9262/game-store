import { useEffect } from 'react';
import { X } from 'lucide-react';
import GameGrid from '../components/GameGrid';
import GamesSkeleton from '../components/GamesSkeleton';
import GamesToolbar from '../components/GamesToolbar';
import LayoutContainer from '../components/LayoutContainer';
import PageHero from '../components/PageHero';
import Button from '../components/Button';
import { useApp } from '../context/AppContext';
import { useCatalogFilters } from '../hooks/useCatalogFilters';

export default function Games() {
  const { games, fetchAllGames, loading, addItem, showToast } = useApp();

  const {
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    selectedPlatform,
    setSelectedPlatform,
    sortBy,
    setSortBy,
    genreOptions,
    platformOptions,
    filteredGames,
  } = useCatalogFilters(games);

  useEffect(() => {
    fetchAllGames();
  }, [fetchAllGames]);

  function handleAddToCart(game) {
    addItem(game);
    showToast(`Added "${game.title}" to cart`);
  }

  const pageHero = (
    <PageHero
      title='Catalog'
      description='Chart your course through every genre—search, filter, and add games to your cart.'
    />
  );

  if (loading) {
    return (
      <main className='games-page'>
        {pageHero}
        <section className='games-page__toolbar games-page__toolbar--loading' aria-busy='true'>
          <LayoutContainer>
            <p className='games-page__loading-msg'>Loading catalog…</p>
            <GamesSkeleton />
          </LayoutContainer>
        </section>
      </main>
    );
  }

  return (
    <main className='games-page'>
      {pageHero}

      <section className='games-page__toolbar' aria-label='Catalog filters'>
        <LayoutContainer>
          <GamesToolbar
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            selectedGenre={selectedGenre}
            onGenreChange={setSelectedGenre}
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            sortBy={sortBy}
            onSortChange={setSortBy}
            genreOptions={genreOptions}
            platformOptions={platformOptions}
            resultCount={filteredGames.length}
          />
        </LayoutContainer>
      </section>

      <section className='page-section' aria-label='Game results'>
        <LayoutContainer>
          {filteredGames.length > 0 ? (
            <GameGrid games={filteredGames} onAddToCart={handleAddToCart} />
          ) : (
            <div className='games-empty'>
              <h3 className='games-empty__title'>No matches</h3>
              <p className='games-empty__text'>Try another search or adjust your filters.</p>
              <Button variant='primary' onClick={() => setSearchTerm('')} icon={X}>
                Clear Search
              </Button>
            </div>
          )}
        </LayoutContainer>
      </section>
    </main>
  );
}
