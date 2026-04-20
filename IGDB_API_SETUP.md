# IGDB API Integration Guide

This project now uses the **Internet Game Database (IGDB) API** to fetch real video game data.

## Setup Instructions

### 1. Get Your IGDB API Key

1. Visit [https://api.igdb.com/](https://api.igdb.com/)
2. Sign up for a free account
3. Go to your account dashboard
4. Create a new API key
5. Copy the **API Key** (also called Client-ID)

### 2. Update .env File

Edit `.env` in the project root and replace:

```env
REACT_APP_IGDB_API_KEY=YOUR_IGDB_API_KEY_HERE
```

With your actual IGDB API key:

```env
REACT_APP_IGDB_API_KEY=abc123xyz789abc123xyz789
```

**Important:** 
- Never commit your API key to GitHub
- The `.env` file is already in `.gitignore`

### 3. Restart Development Server

```bash
npm start
```

The app will now fetch real games from IGDB!

## API Features

### Available Functions

1. **`fetchPopularGames(offset, limit)`**
   - Fetches top-rated games sorted by popularity
   - Default: 20 games per request
   - Uses offset-based pagination

2. **`searchGames(query, limit)`**
   - Search for games by title or keywords
   - Full-text search across IGDB database
   - Returns up to 500 results per request

3. **`fetchGameById(gameId)`**
   - Get detailed information about a specific game
   - Includes artworks, screenshots, videos, and more
   - Returns complete game metadata

4. **`fetchGamesByGenre(genreId, limit)`**
   - Filter games by specific genre
   - Returns games sorted by rating

5. **`fetchGamesByPlatform(platformId, limit)`**
   - Filter games by platform (PC, PlayStation, Xbox, etc.)
   - Returns games sorted by rating

6. **`fetchGenres()`**
   - Get all available game genres
   - Returns: name, slug for each genre

7. **`fetchPlatforms()`**
   - Get all available gaming platforms
   - Returns: name, slug, platform_family

## Data Transformation

The `transformGame()` function automatically maps IGDB response data to your app format:

```javascript
{
  id,                    // IGDB game ID
  title,                 // Game name
  image,                 // Cover art URL
  price,                 // Calculated pricing (based on rating)
  genre,                 // Primary genre
  genres,                // All genres array
  rating,                // Converted to 0-10 scale
  description,           // Game summary
  developer,             // Lead developer
  publisher,             // Publisher name
  releaseDate,           // Release date (YYYY-MM-DD)
  platforms,             // Available platforms
  ageRating,             // Age rating category
  slug,                  // URL-friendly game slug
  
  // Detailed info (only when fetching single game):
  artworks,              // Promotional artwork URLs
  screenshots,           // Game screenshot URLs
  videos,                // Video IDs (YouTube)
  websites,              // Official websites
  multiplayerModes       // Multiplayer information
}
```

## IGDB Query Language

IGDB uses a custom query language for complex requests. Examples:

### Get Popular Games
```
fields name, rating, cover.url, genres.name;
sort popularity desc;
limit 20;
where rating != null;
```

### Search Games
```
fields name, summary, rating;
search "Zelda";
limit 50;
```

### Filter by Genre
```
fields name, rating, platforms.name;
where genres = 5;
sort rating desc;
```

## Error Handling

✅ **Comprehensive error handling:**
- API authentication errors
- Network connection errors
- Invalid query syntax
- Fallback to mock data when API fails
- Graceful error messages to users

## IGDB vs RAWG

| Aspect | IGDB | RAWG |
|--------|------|------|
| **Games** | 100,000+ | 898,814+ |
| **Game Info** | Very detailed | Good |
| **Metadata** | Screenshots, videos, artworks | Limited media |
| **Coverage** | Industry standard | Crowd-sourced |
| **Rate Limits** | 4 req/sec (free tier) | Generous |
| **Cost** | Free tier available | Free |

## Rate Limits

- **Free Tier**: 4 requests per second
- **Limit**: 500 results per request

If you hit rate limits, the app will fallback to mock data automatically.

## Troubleshooting

### "API Key is required" Error
- Make sure you have an IGDB API key
- Verify it's correctly added to `.env`
- Restart the dev server after updating `.env`

### "401 Unauthorized"
- Your API key is invalid or expired
- Generate a new key from IGDB dashboard
- Update `.env` file

### "429 Too Many Requests"
- You've hit the rate limit (4 req/sec)
- App will automatically use mock data
- Wait a moment and refresh

### Games Not Loading
- Check browser console (F12) for errors
- Verify `.env` file has your API key
- Try searching - search has different rate limits
- Check your IGDB account is still active

## API Reference

For more information, visit: [IGDB API Documentation](https://igdb.docs.apiary.io/)

## Next Steps

1. ✅ Sign up at https://api.igdb.com/
2. ✅ Get your API key
3. ✅ Update `.env` file
4. ✅ Run `npm start`
5. ✅ Browse 100,000+ real games!

---

**Questions?** Check the IGDB docs or test the API at: https://api.igdb.com/
