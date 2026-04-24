import { useEffect, useState } from 'react';

export function useGameDetails(gameId, fetchGameById) {
  const [game, setGame] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setLoadError('');
      try {
        const data = await fetchGameById(gameId);
        setGame(data);
      } catch (err) {
        setLoadError(err.message || 'Game not found');
        setGame(null);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [gameId, fetchGameById]);

  return { game, isLoading, loadError };
}
