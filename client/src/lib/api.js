import axios from 'axios';

export async function getStreamToken() {
  const response = await axios.get('/chat/token');
  return response.data;
}
