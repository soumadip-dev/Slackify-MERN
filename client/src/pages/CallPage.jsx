import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

import { getStreamToken } from '../lib/api';

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';

// import styles from stream video
import '@stream-io/video-react-sdk/dist/css/styles.css';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY; // Stream API key

const CallPage = () => {
  const { id: callId } = useParams();
  const { user, isLoaded } = useUser();

  // state variables for the call
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  // fetch the Stream token for the current user
  const { data: tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: getStreamToken,
    enabled: !!user, // '!!' convert to boolean
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData.token || !user || !callId) return; // Return if any required data is missing

      try {
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: {
            id: user.id,
            name: user.fullName,
            image: user.imageUrl,
          },
          token: tokenData.token,
        });

        const callInstance = videoClient.call('default', callId);
        await callInstance.join({ create: true }); // Call will be created if it doesn't exist

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.log('Error init call:', error);
        toast.error('Cannot connect to the call.');
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();
  }, [tokenData, user, callId]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="relative w-full max-w-4xl mx-auto">CallPage</div>
    </div>
  );
};

export default CallPage;
