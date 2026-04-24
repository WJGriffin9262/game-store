import { useEffect, useState } from 'react';

export function useFeaturedGames(fetchAllGames) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setLoadError('');
      try {
        await fetchAllGames();
      } catch (err) {
        setLoadError(err.message || 'Failed to load games.');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [fetchAllGames]);

  return { isLoading, loadError };
}
