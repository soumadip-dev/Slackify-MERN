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

  const [showInvite, setShowInvite] = useState(false); // Flag to show/hide the invite modal
  const [showMembers, setShowMembers] = useState(false); // Flag to show/hide the members modal
  const [showPinnedMessages, setShowPinnedMessages] = useState(false); // Flag to show/hide the pinned messages modal
  const [pinnedMessages, setPinnedMessages] = useState([]); // Array of pinned messages

  // Get the other user/users in the channel
  const otherUser = Object.values(channel.state.members).find(member => member.user.id !== user.id);

  // If no of member is 2 and it include the current user then it is a DM
  const isDM = channel.data?.member_count === 2 && channel.data?.id.includes('user_');

  const handleShowPinned = async () => {
    const channelState = await channel.query();
    setPinnedMessages(channelState.pinned_messages);
    setShowPinnedMessages(true);
  };

  return (
    <div className="h-14 border-b border-gray-200 flex items-center px-4 justify-between bg-white">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">CustomChannelHeader</div>
      </div>
    </div>
  );
};

export default CustomChannelHeader;
