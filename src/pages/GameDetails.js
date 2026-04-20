import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LoadingSpinner, ErrorMessage } from '../components';
import { useCart, useGames } from '../hooks';
import { formatPrice, formatDate } from '../utils';

function GameDetails() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addItem } = useCart();
  const { fetchGameById } = useGames();

  useEffect(() => {
    const loadGame = async () => {
      try {
        const data = await fetchGameById(id);
        setGame(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Game not found');
        setGame(null);
      } finally {
        setLoading(false);
      }
    };

    loadGame();
  }, [id, fetchGameById]);

  const handleAddToCart = () => {
    if (game) {
      addItem(game);
      alert(`${game.title} added to cart!`);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <LoadingSpinner message="Loading game details..." />
    </div>
  );

  if (error) return (
    <ErrorMessage
      message={`Game not found or failed to load: ${error}`}
      onRetry={() => window.location.reload()}
      title="Game Not Available"
    />
  );

  if (!game) return (
    <ErrorMessage
      message="The game you're looking for doesn't exist or has been removed."
      title="Game Not Found"
    />
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Game Details</h1>
              <p className="text-gray-300">Discover everything about this game</p>
            </div>
            <Link to="/games" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors px-4 py-2 rounded-lg hover:bg-white/10">
              ← Back to Games
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Image */}
          <div className="lg:col-span-2">
            <div className="bg-gray-200 rounded-lg overflow-hidden mb-6">
              <img 
                src={game.image || '/placeholder-game.jpg'} 
                alt={game.title}
                className="w-full h-auto object-cover"
                onError={(e) => e.target.src = '/placeholder-game.jpg'}
              />
            </div>

            {/* Description - Prominent Display */}
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-md border-l-4 border-blue-500">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900">About This Game</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg mb-4">
                  {game.description}
                </p>
                {game.description && game.description.length > 200 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-800 text-sm font-medium mb-2">💡 Game Highlights:</p>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Engaging gameplay mechanics</li>
                      <li>• Stunning visuals and sound design</li>
                      <li>• Hours of immersive entertainment</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-lg p-4 shadow-md">
                <p className="text-sm text-gray-600">Platforms</p>
                <p className="text-lg font-semibold text-gray-900">
                  {game.platforms?.slice(0, 2).join(', ') || 'N/A'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <p className="text-sm text-gray-600">Publishers</p>
                <p className="text-lg font-semibold text-gray-900">
                  {game.publisher || 'Unknown'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <p className="text-sm text-gray-600">Metacritic Score</p>
                <p className="text-lg font-semibold text-gray-900">
                  {game.metacritic ? `${game.metacritic}/100` : 'N/A'}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-md">
                <p className="text-sm text-gray-600">Playing Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {game.playtime ? `${game.playtime}h` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Tags */}
            {game.tags && game.tags.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-md mt-6">
                <h3 className="text-lg font-bold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {game.tags.slice(0, 10).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-lg p-6 shadow-lg sticky top-24">
              {/* Game Title */}
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 leading-tight">{game.title}</h1>
              <p className="text-gray-300 mb-6 text-sm">{game.developer}</p>

              {/* Game Image */}
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={game.image || '/placeholder-game.jpg'}
                  alt={game.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => e.target.src = '/placeholder-game.jpg'}
                />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex text-yellow-400 text-xl">
                  {'⭐'.repeat(Math.floor(game.rating || 0))}
                  {'☆'.repeat(5 - Math.floor(game.rating || 0))}
                </div>
                <span className="text-lg font-semibold text-white">
                  {game.rating ? `${game.rating}/5` : 'No rating'}
                </span>
              </div>

              {/* Price - Prominent Display */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-4 mb-6 text-center">
                <p className="text-white/80 text-sm mb-1 font-medium">Price</p>
                <p className="text-4xl font-bold text-white">
                  {formatPrice(game.price)}
                </p>
                <p className="text-white/90 text-xs mt-1">Mock pricing for demo</p>
              </div>

              {/* Key Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Release Date</span>
                  <span className="text-white font-medium">
                    {formatDate(game.releaseDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">Genre</span>
                  <span className="text-white font-medium">
                    {game.genre || 'Unknown'}
                  </span>
                </div>
                {game.metacritic && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 text-sm">Metacritic</span>
                    <span className="text-green-400 font-bold">
                      {game.metacritic}/100
                    </span>
                  </div>
                )}
              </div>

              {/* Add to Cart Button - Prominent */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 px-6 rounded-lg font-bold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg mb-4"
              >
                🛒 Add to Cart - {formatPrice(game.price)}
              </button>

              {/* Additional Actions */}
              <div className="space-y-3">
                {game.website && (
                  <a
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 px-4 rounded-lg border-2 border-cyan-400 text-cyan-400 font-semibold hover:bg-cyan-400/10 transition-colors"
                  >
                    🌐 Official Website
                  </a>
                )}

                <Link
                  to="/games"
                  className="block w-full text-center py-3 px-4 rounded-lg border-2 border-gray-400 text-gray-300 font-semibold hover:bg-gray-400/10 transition-colors"
                >
                  ← Back to Games
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameDetails;
