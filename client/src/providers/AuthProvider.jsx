import { createContext, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  // getToken is a function that retrieves the current user's authentication token
  const { getToken } = useAuth();

  useEffect(() => {
    // Interceptor acts as a checkpoint or middleman for HTTP requests.
    // Axios allows you to intercept (catch) requests or responses before they are sent or received.
    // Here, we always need to attach a token to requests so the server knows who you are.
    // Instead of manually adding it to every request, an interceptor does it automatically.
    const interceptor = axiosInstance.interceptors.request.use(
      // This sets up a request interceptor on your Axios instance.
      // It has two parts:
      // 1. Success function
      async config => {
        try {
          const token = await getToken();
          if (token) config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          if (error.message?.includes('auth') || error.message?.includes('token')) {
            toast.error('Authentication issue. Please refresh the page.');
          }
          console.log('Error getting token:', error);
        }
        return config; // Important: always return the config object
      },
      // 2. Error function
      error => {
        console.error('Axios request error:', error);
        return Promise.reject(error);
      }
    );

    // Remove the interceptor on unmount to prevent adding duplicates,
    // which can cause duplicate requests or memory leaks over time.
    return () => axiosInstance.interceptors.request.eject(interceptor);
  }, [getToken]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
}
