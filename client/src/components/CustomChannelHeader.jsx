import { HashIcon, LockIcon, UsersIcon, PinIcon, VideoIcon } from 'lucide-react';
import { useChannelStateContext } from 'stream-chat-react';
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import MembersModal from './MembersModal';
import PinnedMessagesModal from './PinnedMessagesModal';
import InviteModal from './InviteModal';

const CustomChannelHeader = () => {
  // Get the channel state
  const { channel } = useChannelStateContext();
  // Get the current user from Clerk
  const { user } = useUser();

  // Get the member count of the channel
  const memberCount = Object.keys(channel.state.members).length;

  return (
    <div className="h-14 border-b border-gray-200 flex items-center px-4 justify-between bg-white">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">CustomChannelHeader</div>
      </div>
    </div>
  );
};

export default CustomChannelHeader;
