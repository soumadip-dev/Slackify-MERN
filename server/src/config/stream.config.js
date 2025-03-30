import { StreamChat } from 'stream-chat';
import { ENV } from '../config/env.config.js';

const streamClient = StreamChat.getInstance(ENV.STREAM_API_KEY, ENV.STREAM_API_SECRET);

//* Function to upsert a user in Stream
export const upsertStreamUser = async userData => {
  try {
    await streamClient.upsertUser(userData);
    console.log('Stream user upserted successfully:', userData.name);
    return userData;
  } catch (error) {
    console.log('Error upserting Stream user:', error);
  }
};
