import { Inngest } from 'inngest';
import { connectDb } from './db.config.js';
import { User } from '../models/user.models.js';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'slackify' });

// Create a function
const syncUser = inngest.createFunction(
  { id: 'sync-user' },
  { event: 'clerk/user.created' },
  async ({ event }) => {
    await connectDb();

    // Destructure the event data comming from Clerk
    const { id, email_addresses, first_name, last_name, image_url } = event.data;

    // Create a new user in our DB
    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ''} ${last_name || ''}`,
      image: image_url,
    };
    await User.create(newUser);

    //TODO: Do More things here
  }
);

// Export the functions
export const functions = [syncUser];
