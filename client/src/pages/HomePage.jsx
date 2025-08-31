import { UserButton } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useStreamChat } from '../hooks/useStreamChat';
import PageLoader from '../components/PageLoader';

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Check if model is open or not
  const [activeChannel, setActiveChannel] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams(); // Get search params from URL

  const { chatClient, error, isLoading } = useStreamChat(); // Get chat client from hook

  // Set active channel from URL params
  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get('channel');
      if (channelId) {
        const channel = chatClient.channel('messaging', channelId);
        setActiveChannel(channel);
      }
    }
  }, [chatClient, searchParams]);

  // todo: handle this with a better component
  if (error) return <p>Something went wrong...</p>;

  if (isLoading || !chatClient) return <PageLoader />;
  return (
    <div>
      <p>Home Page</p>
      <UserButton />
    </div>
  );
};
export default HomePage;
