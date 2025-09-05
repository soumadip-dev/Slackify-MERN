import axios from 'axios';

// The base URL for our API depends on the environment (local server on port 8080 in dev, Vercel server in prod).
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an instance of axios with the base URL and credentials, sending cookies with requests.
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
