import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

import { getStreamToken } from '../lib/api';

import { StreamVideo, StreamVideoClient, StreamCall } from '@stream-io/video-react-sdk';

// Import Stream Video default styles
import '@stream-io/video-react-sdk/dist/css/styles.css';
import CallContent from '../components/CallContent';

// Load API key from environment variable
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  // Extract `id` from the URL params (used as callId)
  const { id: callId } = useParams();

  // Get user info from Clerk
  const { user, isLoaded } = useUser();

  // State variables for Stream client and call
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  // Fetch Stream token for the logged-in user
  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!user, // only fetch token if user exists
  });

  useEffect(() => {
    const initCall = async () => {
      // Exit if required values are missing
      if (!tokenData?.token || !user || !callId) return;

      try {
        // Initialize Stream video client
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: user.id,
            name: user.fullName,
            image: user.imageUrl,
          },
          token: tokenData.token,
        });

        // Create or join a call using the callId
        const callInstance = videoClient.call('default', callId);
        await callInstance.join({ create: true }); // creates call if it doesn’t exist

        // Save client and call instance in state
        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error('Error initializing call:', error);
        toast.error('Cannot connect to the call.');
      } finally {
        setIsConnecting(false); // stop loading after attempt
      }
    };

    initCall();
  }, [tokenData, user, callId]);

  if (isConnecting || !isLoaded) {
    return <div className="h-screen flex justify-center items-center">Connecting to call...</div>;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="relative w-full max-w-4xl mx-auto">
        {' '}
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallPage;
