import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './providers/AuthProvider.jsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
          <Toaster position="top-right" />
        </BrowserRouter>
      </ClerkProvider>
    </QueryClientProvider>
  </StrictMode>
);
