import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useCatalogFilters(games) {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get('search') || '');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [sortBy, setSortBy] = useState('title-asc');

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const genreOptions = useMemo(
    () => ['all', ...new Set(games.map((game) => game.genre).filter(Boolean))],
    [games],
  );

  const platformOptions = useMemo(
    () => ['all', ...new Set(games.flatMap((game) => game.platforms || []))],
    [games],
  );

  const filteredGames = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return games
      .filter((game) => {
        const matchesSearch =
          !normalizedSearch ||
          game.title.toLowerCase().includes(normalizedSearch) ||
          (game.developer || '').toLowerCase().includes(normalizedSearch) ||
          (game.genre || '').toLowerCase().includes(normalizedSearch);
        const matchesGenre = selectedGenre === 'all' || game.genre === selectedGenre;
        const matchesPlatform =
          selectedPlatform === 'all' || (game.platforms || []).includes(selectedPlatform);
        return matchesSearch && matchesGenre && matchesPlatform;
      })
      .sort((firstGame, secondGame) => {
        if (sortBy === 'price-low') return firstGame.price - secondGame.price;
        if (sortBy === 'price-high') return secondGame.price - firstGame.price;
        if (sortBy === 'rating-high') return (secondGame.rating || 0) - (firstGame.rating || 0);
        return firstGame.title.localeCompare(secondGame.title);
      });
  }, [games, searchTerm, selectedGenre, selectedPlatform, sortBy]);

  return {
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
  };
}
