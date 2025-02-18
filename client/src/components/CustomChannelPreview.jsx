import React from 'react';

const CustomChannelPreview = ({ channel, setActiveChannel, activeChannel }) => {
  const isActive = activeChannel && activeChannel.id === channel.id;
  const isDM = channel.data.member_count === 2 && channel.data.id.includes('user_');

  if (isDM) return null;

  const unreadCount = channel.countUnread();
};

export default CustomChannelPreview;
