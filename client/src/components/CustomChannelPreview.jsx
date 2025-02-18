import { HashIcon } from 'lucide-react';
import React from 'react';

const CustomChannelPreview = ({ channel, setActiveChannel, activeChannel }) => {
  const isActive = activeChannel && activeChannel.id === channel.id;
  const isDM = channel.data.member_count === 2 && channel.data.id.includes('user_');

  if (isDM) return null;

  const unreadCount = channel.countUnread();
  return (
    <div className="px-5 py-1">
      <button
        onClick={() => setActiveChannel(channel)}
        className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition-all duration-200 ease-in-out relative ${
          isActive
            ? 'bg-purple-600/40 border border-purple-400/30 text-white shadow-lg'
            : 'text-purple-100/90 hover:bg-purple-500/20 hover:text-white border border-transparent'
        }`}
      >
        <HashIcon className={`w-4 h-4 mr-3 ${isActive ? 'text-white' : 'text-purple-300/70'}`} />
        <span className="flex-1 truncate font-medium text-sm">
          {channel.data.name || channel.data.id}
        </span>
        {unreadCount > 0 && (
          <span className="flex items-center justify-center ml-2 min-w-5 h-5 text-xs rounded-full bg-red-500 text-white px-1">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export default CustomChannelPreview;
