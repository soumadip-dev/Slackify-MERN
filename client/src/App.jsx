import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import CallPage from './pages/CallPage';

const App = () => {
  const { isSignedIn, isLoaded } = useAuth(); // Get auth status from Clerk

  if (!isLoaded) return null; // Wait until auth state is loaded

  return (
    <Routes>
      <Route
        path="/"
        element={isSignedIn ? <HomePage /> : <Navigate to={'/auth'} replace />} // Show HomePage if signed in, else redirect to /auth
      />
      <Route
        path="/auth"
        element={!isSignedIn ? <AuthPage /> : <Navigate to={'/'} replace />} // Show AuthPage if not signed in, else redirect to /
      />
      <Route
        path="/call"
        element={isSignedIn ? <CallPage /> : <Navigate to={'/auth'} replace />} // Show CallPage if signed in, else redirect to /auth
      />
      <Route
        path="*"
        element={isSignedIn ? <Navigate to={'/'} replace /> : <Navigate to={'/auth'} replace />} // Catch-all: redirect to / if signed in, else /auth
      />
    </Routes>
  );
};

export default App;
