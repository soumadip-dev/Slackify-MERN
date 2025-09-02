import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// this hook is used to connect the current user to the Stream Chat API
// so that users can see each other's messages, send messages to each other, get realtime updates, etc.
// it also handles  the disconnection when the user leaves the page

export const useStreamChat = () => {
  // get the user from Clerk
  const { user } = useUser();

  // Initialize the state for the StreamChat client
  const [chatClient, setChatClient] = useState(null);

  //  Fetch the stream token for the current user
  const {
    data: tokenData,
    isLoading: tokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ['stream-token'],
    queryFn: getStreamToken,
    enabled: !!user?.id, // this will take the value and converted to boolean
  });

  // Initialize the StreamChat client and connect the user
  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !user.id || !STREAM_API_KEY) return;
      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);
        // connect the user to the StreamChat
        await client.connectUser(
          {
            id: user.id,
            name: user.fullName,
            image: user.imageUrl,
          },
          tokenData.token
        );
        setChatClient(client); // update the state
      } catch (error) {
        // handle the error
        console.error('Error connecting to stream', error);
      }
    };
    initChat();

    // cleanup
    return () => {
      if (chatClient) chatClient.disconnectUser(); // disconnect the user if the component is unmounted to handle online-offline functionality
    };
  }, [tokenData?.token, user?.id, chatClient]);

  // Return the chat client and loading state and error
  return { chatClient, isLoading: tokenLoading, error: tokenError };
};
