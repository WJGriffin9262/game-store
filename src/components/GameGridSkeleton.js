import GameCardSkeletonAdvanced from './GameCardSkeletonAdvanced';

function GameGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <GameCardSkeletonAdvanced
          key={index}
          delay={index * 150} // Staggered animation delay
        />
      ))}
    </div>
  );
}

export default GameGridSkeleton;