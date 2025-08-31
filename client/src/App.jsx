import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { Navigate, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import CallPage from './pages/CallPage';
import toast from 'react-hot-toast';
const App = () => {
  return (
    <>
      <button onClick={() => toast.success('success')}>success</button>
      <SignedIn>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<Navigate to="/" replace />} /> // replaces history instead
          of pushing new entry
          <Route path="/call" element={<CallPage />} />
        </Routes>
      </SignedIn>
      <SignedOut>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </SignedOut>
    </>
  );
};
export default App;
