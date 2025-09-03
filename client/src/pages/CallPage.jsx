import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

import { getStreamToken } from '../lib/api';

const CallPage = () => {
  return <div>CallPage</div>;
};

export default CallPage;
