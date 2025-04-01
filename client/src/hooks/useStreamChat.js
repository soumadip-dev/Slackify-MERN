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
  // Get the current logged-in user from Clerk
  const { user } = useUser();

  // Local state to store the StreamChat client instance
  const [chatClient, setChatClient] = useState(null);

  // Fetch the Stream token for the current user using React Query
  const {
    data: tokenData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['streamToken'], // Unique key for caching the token
    queryFn: getStreamToken, // API call function
    enabled: !!user?.id, // Run query only if user is logged in
  });

  // Setup and teardown of StreamChat client
  useEffect(() => {
    // Don't proceed if any required data is missing
    if (!tokenData?.token || !user?.id || !STREAM_API_KEY) return;

    // Create a StreamChat client instance
    const client = StreamChat.getInstance(STREAM_API_KEY);

    // Flag to prevent state updates on unmounted component
    let cancelled = false; // Prevents state updates if component unmounts before async call finishes

    // Async function to connect the user to Stream
    const connect = async () => {
      try {
        await client.connectUser(
          {
            id: user.id, // Unique identifier for the user
            name:
              user.fullName ?? user.username ?? user.primaryEmailAddress?.emailAddress ?? user.id, // Fallback options for display name
            image: user.imageUrl ?? undefined, // User profile image if available
          },
          tokenData.token // Authentication token for Stream
        );
        if (!cancelled) {
          setChatClient(client); // Save the client in state if still mounted
        }
      } catch (error) {
        console.error('Error connecting to Stream', error);
      }
    };
    connect();

    // Cleanup when component unmounts or dependencies change
    return () => {
      cancelled = true; // Prevents state updates after unmount
      if (client) client.disconnectUser(); // Safely disconnect the Stream client
    };
  }, [tokenData?.token, user?.id]);

  // Expose the chat client, loading state, and error for consumers of this hook
  return { chatClient, isLoading, error };
};
