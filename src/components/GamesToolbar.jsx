import { Search } from 'lucide-react';

export default function GamesToolbar({
  searchTerm,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedPlatform,
  onPlatformChange,
  sortBy,
  onSortChange,
  genreOptions,
  platformOptions,
  resultCount,
}) {
  return (
    <div className='games-toolbar'>
      <div className='games-toolbar__search-wrap'>
        <Search className='games-toolbar__search-icon' strokeWidth={2} aria-hidden />
        <input
          type='text'
          className='games-toolbar__input'
          placeholder='Search games…'
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>

      <div className='games-toolbar__filters mobile-filter-grid'>
        <select
          className='games-toolbar__select'
          value={selectedGenre}
          onChange={(e) => onGenreChange(e.target.value)}
        >
          {genreOptions.map((genre) => (
            <option key={genre} value={genre}>
              {genre === 'all' ? 'All Genres' : genre}
            </option>
          ))}
        </select>
        <select
          className='games-toolbar__select'
          value={selectedPlatform}
          onChange={(e) => onPlatformChange(e.target.value)}
        >
          {platformOptions.map((platform) => (
            <option key={platform} value={platform}>
              {platform === 'all' ? 'All Platforms' : platform}
            </option>
          ))}
        </select>
        <select
          className='games-toolbar__select'
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value='title-asc'>Sort: Title A-Z</option>
          <option value='price-low'>Sort: Price Low to High</option>
          <option value='price-high'>Sort: Price High to Low</option>
          <option value='rating-high'>Sort: Top Rated</option>
        </select>
      </div>

      <p className='games-toolbar__count mobile-hide-on-small'>
        {resultCount} title{resultCount !== 1 ? 's' : ''} found
      </p>
    </div>
  );
}
