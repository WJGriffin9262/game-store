function LoadingSpinner({ size = 'default', message = 'Loading...', fullScreen = true }) {
  const sizeClasses = {
    small: 'w-6 h-6',
    default: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const containerClasses = fullScreen
    ? 'min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8'
    : 'flex items-center justify-center py-8';

  return (
    <div className={containerClasses}>
      <div className='text-center'>
        {/* Spinner */}
        <div className={`${sizeClasses[size]} mx-auto mb-4 relative`}>
          <div className='absolute inset-0 border-4 border-gray-200 rounded-full'></div>
          <div className='absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin'></div>
        </div>

        {/* Loading Message */}
        <p className='text-gray-600 font-medium'>
          {message}
        </p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
