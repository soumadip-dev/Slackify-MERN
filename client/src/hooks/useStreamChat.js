import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useStramChat = () => {
  const { user } = useUser();
  const [chatClient, setChatClient] = useState(null);

  //  Feth the stream token for the current user
  const {
    data: tokenData,
    isLoading: tokenLoading,
    error: tokenError,
  } = useQuery({
    queryKey: ['stream-token'],
    queryFn: getStreamToken,
    enabled: !!user?.id, // this will take the value and converted to boolean
  });

  // Initialize the StreamChat client
  useEffect(() => {
    if (!tokenData?.token || !user.id || !STREAM_API_KEY) return;
    try {
      const client = StreamChat.getInstance(STREAM_API_KEY);
    } catch (error) {
      console.error('Error connecting to stream', error);
    }
  });
};
