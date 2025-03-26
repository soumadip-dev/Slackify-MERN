import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
