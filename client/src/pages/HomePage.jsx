import { UserButton } from '@clerk/clerk-react';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useStreamChat } from '../hooks/useStreamChat';

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Check if model is open or not
  const [activeChannel, setActiveChannel] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams(); // Get search params from URL

  const { chatClient, error, isLoading } = useStreamChat(); // Get chat client from hook

  return (
    <div>
      <p>Home Page</p>
      <UserButton />
    </div>
  );
};
export default HomePage;
