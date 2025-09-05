import { UserButton } from '@clerk/clerk-react';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { useStreamChat } from '../hooks/useStreamChat';
import PageLoader from '../components/PageLoader';
import ErrorDisplay from '../components/ErrorDisplay';
import 'stream-chat-react/dist/css/v2/index.css';

import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react';
import { HashIcon, PlusIcon, UsersIcon } from 'lucide-react';
import CreateChannelModal from '../components/CreateChannelModal';
import CustomChannelPreview from '../components/CustomChannelPreview';
import ChannelLoadingState from '../components/ChannelLoadingState';
import ChannelErrorState from '../components/ChannelErrorState';
import UsersList from '../components/UsersList';
import CustomChannelHeader from '../components/CustomChannelHeader';

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [channelsHeight, setChannelsHeight] = useState('auto');
  const channelsContainerRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const { chatClient, error, isLoading } = useStreamChat();

  // Set active channel from URL params
  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get('channel');
      if (channelId) {
        const channel = chatClient.channel('messaging', channelId);
        setActiveChannel(channel);
      }
    }
  }, [chatClient, searchParams]);

  if (error) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;

  if (isLoading || !chatClient) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#0f3460] to-[#7209b7] bg-[radial-gradient(ellipse_at_top_left,_rgba(116,58,213,0.15)_0%,_transparent_50%),_radial-gradient(ellipse_at_bottom_right,_rgba(74,21,75,0.15)_0%,_transparent_50%)] p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(116,58,213,0.15)_0%,transparent_40%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,21,75,0.1)_0%,transparent_40%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <Chat client={chatClient}>
        <div className="max-w-[1400px] mx-auto h-[calc(100vh-2rem)] flex bg-purple-900/20 rounded-2xl backdrop-blur-[25px] border border-purple-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.3),_0_0_100px_rgba(116,58,213,0.1),_inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden relative z-10">
          {/* LEFT SIDEBAR */}
          <div className="backdrop-blur-[25px] border-none overflow-hidden relative shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_inset_-1px_0_0_rgba(255,255,255,0.05)] bg-inherit w-80">
            <div className="h-full relative z-1 bg-gradient-to-b from-[#2D1B4E] via-[#1E103C] via-[#1A0B2E] via-[#1E103C] to-[#2D1B4E] bg-[linear-gradient(45deg,_rgba(116,58,213,0.3)_0%,_rgba(74,21,75,0.5)_30%,_rgba(114,9,183,0.4)_60%,_rgba(83,52,131,0.3)_100%)] flex flex-col">
              {/* HEADER */}
              <div className="header-section px-5 py-5 border-b border-purple-400/20 flex items-center justify-between relative z-2 flex-shrink-0">
                <div className="flex items-center gap-3 relative">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-9 h-9 rounded-xl shadow-[0_8px_25px_rgba(74,21,75,0.4),_0_4px_15px_rgba(114,9,183,0.3),_inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_35px_rgba(74,21,75,0.5),_0_6px_20px_rgba(114,9,183,0.4),_inset_0_1px_0_rgba(255,255,255,0.25)]"
                  />
                  <span className="text-xl font-bold font-sans tracking-wide bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                    Slackify
                  </span>
                </div>
                <div className="relative z-10 p-1 rounded-lg bg-purple-500/20 backdrop-blur-[10px] border border-purple-400/30 transition-all duration-300 hover:bg-purple-500/30 hover:border-purple-400/40 hover:shadow-[0_4px_15px_rgba(74,21,75,0.2)]">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: 'w-8 h-8',
                      },
                    }}
                  />
                </div>
              </div>

              {/* CHANNELS SECTION */}
              <div
                ref={channelsContainerRef}
                className="flex-1 overflow-hidden relative z-1 py-4 flex flex-col"
              >
                {/* CREATE CHANNEL BUTTON */}
                <div className="create-button-section px-4 mb-4 flex-shrink-0">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-200 text-purple-100 hover:text-white text-sm font-medium border border-purple-400/30 hover:border-purple-400/40 shadow-sm hover:shadow-md"
                  >
                    <PlusIcon className="size-4" />
                    <span>Create Channel</span>
                  </button>
                </div>

                {/* CHANNEL LIST */}
                <div className="flex-1 overflow-hidden">
                  <ChannelList
                    filters={{ members: { $in: [chatClient?.user?.id] } }}
                    options={{ state: true, watch: true }}
                    Preview={({ channel }) => (
                      <CustomChannelPreview
                        channel={channel}
                        activeChannel={activeChannel}
                        setActiveChannel={channel => setSearchParams({ channel: channel.id })}
                      />
                    )}
                    List={({ children, loading, error }) => (
                      <div className="relative z-1 h-full flex flex-col">
                        <div className="px-5 pt-5 pb-2 relative flex-shrink-0">
                          <div className="flex items-center gap-2 text-white text-xl font-bold">
                            <HashIcon className="size-4" />
                            <span>Channels</span>
                          </div>
                        </div>
                        {loading && <ChannelLoadingState />}
                        {error && <ChannelErrorState />}

                        <div
                          className="py-0.5 px-1 pb-1 relative flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/40 scrollbar-track-transparent scrollbar-thumb-rounded-full hover:scrollbar-thumb-purple-500/60"
                          style={{ maxHeight: channelsHeight }}
                        >
                          {children}
                        </div>

                        <div className="dm-section relative pt-5 pb-2 mt-8 border-t border-purple-400/20 flex-shrink-0">
                          <div className="px-5 pt-5 pb-2 relative">
                            <div className="flex items-center gap-2 text-white text-xl font-bold">
                              <UsersIcon className="size-4" />
                              <span>Direct Messages</span>
                            </div>
                          </div>
                          <UsersList activeChannel={activeChannel} />
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTAINER */}
          <div className="flex-1 bg-white/98 rounded-r-2xl overflow-hidden">
            <Channel channel={activeChannel}>
              <Window>
                <CustomChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </div>
        </div>

        {/* CREATE CHANNEL MODAL */}
        {isCreateModalOpen && (
          <CreateChannelModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
        )}
      </Chat>

      {/* Custom scrollbar styles */}
      <style>
        {`
.str-chat__channel-list {
  background-color: inherit;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thumb-rounded-full::-webkit-scrollbar-thumb {
  border-radius: 10px;
}
.scrollbar-track-transparent::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thumb-purple-500\\/40::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.4);
}
.hover\\:scrollbar-thumb-purple-500\\/60:hover::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.6);
}
`}
      </style>
    </div>
  );
};
export default HomePage;
