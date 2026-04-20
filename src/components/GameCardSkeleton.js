function GameCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      {/* Game Image Skeleton */}
      <div className="relative w-full h-48 sm:h-56 bg-gray-200 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse"></div>
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        {/* Genre Badge Skeleton */}
        <div className="absolute top-3 right-3 bg-gray-400 animate-pulse px-3 py-1 rounded-full">
          <div className="w-12 h-4 bg-gray-400 rounded"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-4 sm:p-6 flex flex-col h-full">
        {/* Title Skeleton */}
        <div className="mb-2">
          <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded mb-1"></div>
          <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded w-3/4"></div>
        </div>

        {/* Description Skeleton */}
        <div className="mb-3">
          <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded mb-1"></div>
          <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded w-5/6"></div>
        </div>

        {/* Rating Skeleton */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
          <div className="w-8 h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></div>
        </div>

        {/* Price and Actions Skeleton */}
        <div className="mt-auto space-y-3 border-t pt-4">
          {/* Price Skeleton */}
          <div className="flex justify-between items-center">
            <div className="w-20 h-8 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded"></div>
          </div>

          {/* Button Skeleton */}
          <div className="flex gap-2">
            <div className="flex-1 h-10 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded-lg"></div>
          </div>

          {/* Link Skeleton */}
          <div className="w-24 h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 animate-pulse rounded mx-auto"></div>
        </div>
      </div>
    </div>
  );
}

export default GameCardSkeleton;