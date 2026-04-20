# RAWG API Integration Guide

This project uses the [RAWG Video Games Database API](https://rawg.io/api) to fetch real game data.

## Setup Instructions

### 1. Get Your API Key

1. Visit [https://rawg.io/api](https://rawg.io/api)
2. Create a free account
3. Copy your API key from the API page

### 2. Create .env File

Create a `.env` file in the project root (copy from `.env.example`):

```bash
REACT_APP_RAWG_API_KEY=your_api_key_here
```

**Important:** 
- Never commit your API key to version control
- The `.env` file is already in `.gitignore`

### 3. Restart Development Server

```bash
npm start
```

## Available API Functions

### Fetch Popular Games

```javascript
import { fetchPopularGames } from './services/rawgService';

const data = await fetchPopularGames(
  page = 1,           // Page number
  pageSize = 20,      // Results per page (max: 40)
  ordering = '-rating' // Sort order
);

// Returns: { count, next, previous, results }
```

### Search Games

```javascript
import { searchGames } from './services/rawgService';

const results = await searchGames('Elden Ring', pageSize = 20);

// Returns: Array of game objects
```

### Fetch Single Game

```javascript
import { fetchGameById } from './services/rawgService';

const game = await fetchGameById(3498); // Game ID from RAWG

// Returns: Detailed game object
```

### Fetch Games by Platform

```javascript
import { fetchGamesByPlatform } from './services/rawgService';

// Platform IDs: 1 (PC), 2 (PlayStation), 3 (Xbox), 7 (Nintendo), etc.
const games = await fetchGamesByPlatform(1); // PC games

// Returns: Array of game objects
```

### Fetch Games by Genre

```javascript
import { fetchGamesByGenre } from './services/rawgService';

// Genre IDs: 4 (Action), 51 (Indie), 3 (Adventure), etc.
const games = await fetchGamesByGenre(4); // Action games

// Returns: Array of game objects
```

### Advanced Search with Filters

```javascript
import { advancedSearch } from './services/rawgService';

const results = await advancedSearch({
  search: 'Cyberpunk',
  ordering: '-rating',
  platforms: [1, 2], // PC and PlayStation
  genres: [4, 6],    // Action and RPG
  page: 1,
  page_size: 20
});

// Returns: { count, next, previous, results }
```

## Sorting Options

- `-rating` - Highest rated first (default)
- `-added` - Most recently added
- `-created` - Newest releases first
- `released` - Oldest releases first

## Common Platform IDs

| ID | Platform |
|----|----------|
| 1 | PC |
| 2 | PlayStation |
| 3 | Xbox |
| 7 | Nintendo |
| 4 | iOS |
| 8 | Android |

## Common Genre IDs

| ID | Genre |
|----|-------|
| 4 | Action |
| 51 | Indie |
| 3 | Adventure |
| 5 | RPG |
| 10 | Strategy |
| 83 | Puzzle |

## Error Handling

All API functions include built-in error handling:

```javascript
try {
  const games = await fetchPopularGames();
} catch (error) {
  console.error('API Error:', error.message);
  // Handle error appropriately
}
```

## Game Object Structure

```javascript
{
  id: 3498,
  title: "Elden Ring",
  image: "https://...",
  price: 59.99,
  genre: "RPG",
  genres: ["RPG", "Adventure"],
  rating: 4.5,
  description: "...",
  developer: "FromSoftware",
  developers: ["FromSoftware"],
  releaseDate: "2022-02-25",
  platforms: ["PC", "PlayStation 4", "PlayStation 5"],
  publisher: "Bandai Namco Entertainment",
  tags: ["open-world", "souls-like", ...],
  metacritic: 96,
  playtime: 60,           // Only in detailed view
  achievements: 50,       // Only in detailed view
  website: "https://...", // Only in detailed view
  reddit_url: "https://..."
}
```

## Notes

- RAWG API is free and doesn't require authentication for basic requests
- Rate limit: 20 requests per minute for free tier
- All prices in the game object are mock prices (not from RAWG)
- Images are cached by the API for better performance

## API Documentation

For more information, visit: [RAWG API Documentation](https://api.rawg.io/)
