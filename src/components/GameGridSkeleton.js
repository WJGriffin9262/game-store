function GameGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="relative w-full h-48 sm:h-56 bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-gray-300"></div>
            <div className="absolute top-3 right-3 bg-gray-400 px-3 py-1 rounded-full">
              <div className="w-12 h-4 bg-gray-400 rounded"></div>
            </div>
          </div>
          <div className="p-4 sm:p-6 flex flex-col h-full">
            <div className="mb-2">
              <div className="h-5 sm:h-6 bg-gray-300 rounded mb-1"></div>
              <div className="h-5 sm:h-6 bg-gray-300 rounded w-3/4"></div>
            </div>
            <div className="mb-3">
              <div className="h-4 bg-gray-300 rounded mb-1"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, starIndex) => (
                  <div key={starIndex} className="w-4 h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
              <div className="w-8 h-4 bg-gray-300 rounded"></div>
            </div>
            <div className="mt-auto space-y-3 border-t pt-4">
              <div className="flex justify-between items-center">
                <div className="w-20 h-8 bg-gray-300 rounded"></div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-300 rounded-lg"></div>
              </div>
              <div className="w-24 h-4 bg-gray-300 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GameGridSkeleton;