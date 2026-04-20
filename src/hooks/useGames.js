import { useContext } from 'react';
import { GameContext } from '../context/GameContext';

export function useGames() {
  const context = useContext(GameContext);
  
  if (!context) {
    throw new Error('useGames must be used within a GameProvider');
  }
  
  return context;
}
