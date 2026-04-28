export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className='loading-screen'>
      <div className='loading-screen__inner'>
        <div className='loading-screen__spinner'>
          <div className='loading-screen__track' />
          <div className='loading-screen__spin' />
        </div>
        <p className='loading-screen__message'>{message}</p>
      </div>
    </div>
  );
}
