import GameCard from '../catalog/GameCard';

export default function GameGrid({ games, onAddToCart }) {
  return (
    <div className='game-grid'>
      {games.map((game) => (
        <div key={game.id} className='game-grid__cell'>
          <GameCard game={game} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
}
