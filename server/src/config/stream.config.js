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

//* Function to delete a user from Stream
export const deleteStreamUser = async userId => {
  try {
    await streamClient.deleteUser(userId);
    console.log('Stream user deleted successfully:', userId);
  } catch (error) {
    console.error('Error deleting Stream user:', error);
  }
};
