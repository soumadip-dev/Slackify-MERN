import { UserButton } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useStreamChat } from '../hooks/useStreamChat';
import PageLoader from '../components/PageLoader';

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

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Check if model is open or not
  const [activeChannel, setActiveChannel] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams(); // Get search params from URL

  const { chatClient, error, isLoading } = useStreamChat(); // Get chat client from hook

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

  // todo: handle this with a better component
  if (error) return <p>Something went wrong...</p>;

  if (isLoading || !chatClient) return <PageLoader />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#16213e] via-[#0f3460] via-[#533483] to-[#7209b7] bg-[radial-gradient(ellipse_at_top_left,_rgba(116,58,213,0.15)_0%,_transparent_50%),_radial-gradient(ellipse_at_bottom_right,_rgba(74,21,75,0.15)_0%,_transparent_50%)] p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(116,58,213,0.15)_0%,transparent_40%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,21,75,0.1)_0%,transparent_40%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
      <Chat client={chatClient}>
        <div className="max-w-[1400px] mx-auto h-[calc(100vh-4rem)] flex bg-white/5 rounded-3xl backdrop-blur-[25px] border border-[rgba(116,58,213,0.2)] shadow-[0_30px_60px_rgba(0,0,0,0.3),_0_0_100px_rgba(116,58,213,0.1),_inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden relative z-10">
          {/* LEFT SIDEBAR */}
          <div className="h-full backdrop-blur-[25px] border-none overflow-hidden relative shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_inset_-1px_0_0_rgba(255,255,255,0.05)] bg-inherit w-80">
            <div className="h-full relative z-1 bg-gradient-to-b from-[#4a154b] via-[#350d36] via-[#2d0b2e] via-[#350d36] to-[#4a154b] bg-[linear-gradient(45deg,_rgba(116,58,213,0.3)_0%,_rgba(74,21,75,0.5)_30%,_rgba(114,9,183,0.4)_60%,_rgba(83,52,131,0.3)_100%)] flex flex-col">
              {/* HEADER */}
              <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between relative z-2 flex-shrink-0">
                <div className="flex items-center gap-4 relative">
                  <img
                    src="../../public/logo.png"
                    alt="Logo"
                    className="w-10 h-10 rounded-xl shadow-[0_8px_25px_rgba(74,21,75,0.4),_0_4px_15px_rgba(114,9,183,0.3),_inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_35px_rgba(74,21,75,0.5),_0_6px_20px_rgba(114,9,183,0.4),_inset_0_1px_0_rgba(255,255,255,0.25)]"
                  />
                  <span className="text-xl font-bold font-sans tracking-wide bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                    Slackify
                  </span>
                </div>
                <div className="relative z-10 p-1 rounded-lg bg-white/5 backdrop-blur-[10px] border border-white/10 transition-all duration-300 hover:bg-white/8 hover:border-white/15 hover:shadow-[0_4px_15px_rgba(74,21,75,0.2)]">
                  <UserButton />
                </div>
              </div>
              {/* CHANNELS LIST */}
              <div className="flex-1 overflow-y-auto relative z-1 py-4">
                <div className="px-5">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-lg bg-white/10 hover:bg-white/15 transition-all duration-200 text-white/90 hover:text-white text-sm font-medium border border-white/10 hover:border-white/20"
                  >
                    <PlusIcon className="size-5" />
                    <span>Create Channel</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTAINER */}
          <div className="flex-1 bg-white/98 rounded-r-3xl overflow-hidden flex flex-col">
            <Channel channel={activeChannel}>
              <Window className="h-full flex flex-col">
                {/* <CustomChannelHeader /> */}
                <div className="flex-1 overflow-hidden">
                  <MessageList />
                </div>
                <div className="p-5 border-t border-gray-100">
                  <MessageInput />
                </div>
              </Window>

              <Thread />
            </Channel>
          </div>
        </div>
        {isCreateModalOpen && (
          <CreateChannelModal
            isOpen={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
          />
        )}
      </Chat>
    </div>
  );
};
export default HomePage;
