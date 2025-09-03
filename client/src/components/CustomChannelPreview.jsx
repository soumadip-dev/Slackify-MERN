import { HashIcon } from 'lucide-react';
import React from 'react';

const CustomChannelPreview = ({ channel, setActiveChannel, activeChannel }) => {
  const isActive = activeChannel && activeChannel.id === channel.id;
  const isDM = channel.data.member_count === 2 && channel.data.id.includes('user_');

  if (isDM) return null;

  const unreadCount = channel.countUnread();
  return (
    <button
      onClick={() => setActiveChannel(channel)}
      className={`h-[52px] my-1.5 px-4 py-3 rounded-2xl flex items-center justify-start text-left w-full text-white/85 transition-all duration-300 ease-in-out relative backdrop-blur-[15px] border border-white/10 bg-white/5 transition-colors flex items-center w-full text-left px-4 py-2 rounded-lg mb-1 font-medium hover:bg-blue-50/80 min-h-9 ${
        isActive
          ? '!bg-black/20 !hover:bg-black/20 border-l-8 border-purple-500 shadow-lg text-blue-900'
          : ''
      }`}
    >
      <HashIcon className="w-4 h-4 text-[#9b9b9b] mr-2" />
      <span className="flex-1">{channel.data.id}</span>
      {unreadCount > 0 && (
        <span className="flex items-center justify-center ml-2 size-4 text-xs rounded-full bg-red-500 ">
          {unreadCount}
        </span>
      )}
    </button>
  );
};

export default CustomChannelPreview;
