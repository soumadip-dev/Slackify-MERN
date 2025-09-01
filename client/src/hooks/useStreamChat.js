import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

/* This hook connects the current user to the Stream Chat API,
allowing users to see each other's messages, send messages,
and receive real-time updates.
It also handles disconnection when the user leaves the page.
*/

export const useStreamChat = () => {
  // Get the user from Clerk
  const { user } = useUser();

  // Initialize state for the StreamChat client
  const [chatClient, setChatClient] = useState(null);

  // Fetch the stream token for the current user
  const {
    data: tokenData,
    isLoading: tokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ['stream-token'],
    queryFn: getStreamToken,
    enabled: !!user?.id, // Converts user ID to a boolean to enable the query
  });

  // Initialize the StreamChat client and connect the user
  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !user.id || !STREAM_API_KEY) return;
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        // Connect the user to StreamChat
        await client.connectUser(
          {
            id: user.id,
            name: user.fullName,
            image: user.imageUrl,
          },
          tokenData.token
        );
        setChatClient(client); // Update the state
      } catch (error) {
        // Handle any errors
        console.error('Error connecting to Stream', error);
      }
    };
    initChat();

    // Cleanup
    return () => {
      if (chatClient) chatClient.disconnectUser(); // Disconnect the user when the component unmounts
    };
  }, [tokenData?.token, user?.id, chatClient]);

  // Return the chat client, loading state, and error
  return { chatClient, isLoading: tokenLoading, error: tokenError };
};
