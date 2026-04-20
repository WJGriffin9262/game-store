const axios = require('axios');

// GameSpot API Test
const API_KEY = 'be1c1baa9c1ca25d554ed5de69c58a91da6926b7';
const BASE_URL = 'http://www.gamespot.com/api';

async function testGameSpotAPI() {
  console.log('Testing GameSpot API...\n');

  try {
    // Test 1: Fetch popular games
    console.log('📡 Testing popular games endpoint...');
    const response = await axios.get(`${BASE_URL}/games/`, {
      params: {
        api_key: API_KEY,
        format: 'json',
        sort: 'score:desc',
        limit: 5,
        field_list: 'id,name,deck,score,release_date,genres,image'
      },
      headers: {
        'User-Agent': 'GameStore-Test/1.0 (test@example.com)'
      }
    });

    console.log(`✅ API Response Status: ${response.status}`);
    console.log(`📊 Status Code: ${response.data.status_code}`);
    console.log(`📊 Total Results: ${response.data.number_of_total_results}`);
    console.log(`📊 Results on Page: ${response.data.number_of_page_results}\n`);

    if (response.data.status_code === 1 && response.data.results.length > 0) {
      console.log('🎮 First 5 Games from GameSpot:\n');

      response.data.results.forEach((game, index) => {
        console.log(`${index + 1}. ${game.name}`);
        console.log(`   Rating: ${game.score || 'N/A'}/5 | Released: ${game.release_date || 'TBA'}`);
        console.log(`   Genres: ${game.genres?.map(g => g.name).join(', ') || 'Unknown'}`);
        console.log(`   Description: ${game.deck || 'No description available'}\n`);
      });

      console.log('✅ GameSpot API is working correctly!');
      console.log('🎉 Your API key is valid and the integration is successful!');
    } else {
      console.log('❌ API returned error:', response.data.error);
    }

  } catch (error) {
    console.error('❌ GameSpot API Test Failed:');
    console.error('Error:', error.message);

    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Response:', error.response.data);
    }
  }
}

testGameSpotAPI();