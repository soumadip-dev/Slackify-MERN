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

const CallPage = () => {
  return <div>CallPage</div>;
};

export default CallPage;
