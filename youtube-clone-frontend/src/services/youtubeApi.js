import axios from 'axios';


const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const fetchVideos = async (query = '', maxResults = 50) => {
  try {
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: 'snippet',
        maxResults,
        q: query || 'popular videos',
        type: 'video',
        key: API_KEY
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching videos:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    }
    throw error;
  }
};

// export const fetchSubscriptions = async (accessToken) => {
//   try {
//     const response = await axios.get(`${BASE_URL}/subscriptions`, {
//       params: {
//         part: 'snippet',
//         mine: true,
//         maxResults: 50,
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

//     return response.data.items.map(item => ({
//       id: item.id,
//       name: item.snippet.title,
//       avatar: item.snippet.thumbnails.default.url
//     }));
//   } catch (error) {
//     console.error('Error fetching subscriptions:', error);
//     return [];
//   }
// };