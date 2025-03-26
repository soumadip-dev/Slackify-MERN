import axios from 'axios';

// API call to get a Stream token for the current user.
export async function getStreamToken() {
  const response = await axios.get('/chat/token');
  return response.data;
}
