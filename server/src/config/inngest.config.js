import { Inngest } from 'inngest';
import { connectDb } from './db.config.js';
import { User } from '../models/user.models.js';
import { deleteStreamUser, upsertStreamUser } from './stream.config.js';

// Create a client to send and receive events
export const inngest = new Inngest({ id: 'slackify' });

// Create a function to
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

    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.image,
    });
  }
);

const deleteUserFromDB = inngest.createFunction(
  { id: 'delete-user-from-db' },
  { event: 'clerk/user.deleted' },
  async ({ event }) => {
    await connectDb();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });

    await deleteStreamUser(id.toString());
  }
);

// Export the functions
export const functions = [syncUser, deleteUserFromDB];
