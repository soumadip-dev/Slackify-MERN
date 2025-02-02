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

  // Function to show/hide the pinned messages modal and fetch the pinned messages
  const handleShowPinned = async () => {
    const channelState = await channel.query();
    setPinnedMessages(channelState.pinned_messages);
    setShowPinnedMessages(true);
  };

  // Function to create a video call URL and send it to the channel
  const handleVideoCall = async () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      await channel.sendMessage({
        text: `Hey! I've started a video call. Join me here: ${callUrl}`,
      });
    }
  };

  return (
    <div className="h-14 border-b border-gray-100 flex items-center px-4 justify-between bg-white shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Show different icons based on the channel type */}
          {channel.data?.private ? (
            <LockIcon className="size-4 text-gray-500" />
          ) : (
            <HashIcon className="size-4 text-gray-500" />
          )}
          {/* Show the user image if it is a DM */}
          {isDM && otherUser?.user?.image && (
            <img
              src={otherUser.user.image}
              alt={otherUser.user.name || otherUser.user.id}
              className="size-7 rounded-full object-cover mr-1"
            />
          )}
          {/* If it is a DM, show the user name, else show the channel name */}
          <span className="font-semibold text-gray-900">
            {isDM ? otherUser?.user?.name || otherUser?.user?.id : channel.data?.id}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Show the members button with the member count */}
        <button
          className="flex items-center gap-1.5 hover:bg-gray-100 py-1.5 px-2.5 rounded-lg transition-colors"
          onClick={() => setShowMembers(true)}
        >
          <UsersIcon className="size-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-600">{memberCount}</span>
        </button>
        {/* Video call button */}
        <button
          className="hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          onClick={handleVideoCall}
          title="Start Video Call"
        >
          <VideoIcon className="size-5 text-blue-600" />
        </button>

        {/* Invite button for private channels */}
        {channel.data?.private && (
          <button
            style={{ backgroundColor: '#4E1B87' }}
            className="text-white py-1.5 px-3 rounded-lg text-sm font-medium transition-colors hover:brightness-90"
            onClick={() => setShowInvite(true)}
          >
            Invite
          </button>
        )}

        {/* Pin button to open the pinned messages modal */}
        <button
          className="hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          onClick={handleShowPinned}
        >
          <PinIcon className="size-4 text-gray-600" />
        </button>
      </div>
      {/* Show the MembersModal*/}
      {showMembers && (
        <MembersModal
          members={Object.values(channel.state.members)}
          onClose={() => setShowMembers(false)}
        />
      )}

      {/* Show the PinnedMessagesModal */}
      {showPinnedMessages && (
        <PinnedMessagesModal
          pinnedMessages={pinnedMessages}
          onClose={() => setShowPinnedMessages(false)}
        />
      )}
    </div>
  );
};

export default CustomChannelHeader;
