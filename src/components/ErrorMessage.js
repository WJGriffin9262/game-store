function ErrorMessage({ message, onRetry, title = 'Oops! Something went wrong' }) {
  const handleGoHome = () => {
    window.location.assign('/');
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full bg-white rounded-xl shadow-lg border border-red-100 overflow-hidden'>
        {/* Error Icon */}
        <div className='bg-red-50 p-6 text-center'>
          <div className='w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4'>
            <svg className='w-8 h-8 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            {title}
          </h2>
        </div>

        {/* Error Message */}
        <div className='px-6 pb-6'>
          <p className='text-gray-600 text-center mb-6 leading-relaxed'>
            {message || 'We encountered an unexpected error. Please try again or contact support if the problem persists.'}
          </p>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            {onRetry && (
              <button
                onClick={onRetry}
                className='flex-1 sm:flex-none px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
              >
                Try Again
              </button>
            )}
            <button
              onClick={handleGoHome}
              className='flex-1 sm:flex-none px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
            >
              Go Home
            </button>
          </div>

          {/* Additional Help */}
          <div className='mt-6 pt-4 border-t border-gray-200 text-center'>
            <p className='text-sm text-gray-500'>
              Need help? <a href='mailto:support@gamestore.com' className='text-blue-600 hover:text-blue-800 font-medium'>Contact Support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;
