import { useState } from 'react';
import { GameCardSkeleton, GameCardSkeletonAdvanced, GameGridSkeleton } from '../components';

function SkeletonDemo() {
  const [showSkeletons, setShowSkeletons] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Skeleton Loading Components</h1>
          <p className="text-lg text-gray-600 mb-8">
            Beautiful loading animations for game cards using Tailwind CSS
          </p>
          <button
            onClick={() => setShowSkeletons(!showSkeletons)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {showSkeletons ? 'Hide Skeletons' : 'Show Skeletons'}
          </button>
        </div>

        {showSkeletons && (
          <div className="space-y-16">
            {/* Single Game Card Skeleton */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Single Game Card Skeleton</h2>
              <div className="max-w-sm mx-auto">
                <GameCardSkeleton />
              </div>
            </div>

            {/* Advanced Game Card Skeleton */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Advanced Game Card Skeleton (with staggered animations)</h2>
              <div className="max-w-sm mx-auto">
                <GameCardSkeletonAdvanced />
              </div>
            </div>

            {/* Game Grid Skeleton */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Game Grid Skeleton (6 cards with staggered loading)</h2>
              <GameGridSkeleton count={6} />
            </div>

            {/* Large Grid Skeleton */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Large Game Grid Skeleton (12 cards)</h2>
              <GameGridSkeleton count={12} />
            </div>
          </div>
        )}

        {!showSkeletons && (
          <div className="text-center py-20">
            <div className="inline-block p-8 bg-gray-200 rounded-full mb-6">
              <span className="text-6xl">🎮</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Skeletons Hidden</h3>
            <p className="text-gray-600">Click the button above to see the skeleton loading animations</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SkeletonDemo;