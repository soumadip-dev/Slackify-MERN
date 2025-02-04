// lib/api.ts
import { axiosInstance } from './axios';

// API call to get a Stream token for the current user.
export async function getStreamToken() {
  const response = await axiosInstance.get('/chat/token');
  return response.data;
}
