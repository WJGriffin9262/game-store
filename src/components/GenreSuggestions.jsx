import { Link } from 'react-router-dom';

export default function GenreSuggestions({ genres, heading = 'Jump in by genre' }) {
  return (
    <div className='genre-suggest mobile-hide-on-small'>
      <h3 className='genre-suggest__title'>{heading}</h3>
      <div className='genre-suggest__chips'>
        {genres.map((genre) => (
          <Link
            key={genre}
            to={`/games?search=${encodeURIComponent(genre)}`}
            className='genre-suggest__chip'
          >
            {genre}
          </Link>
        ))}
      </div>
    </div>
  );
}
