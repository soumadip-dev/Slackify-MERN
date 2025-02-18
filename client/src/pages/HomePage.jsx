import { UserButton } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useStreamChat } from '../hooks/useStreamChat';
import PageLoader from '../components/PageLoader';
import ErrorDisplay from '../components/ErrorDisplay';

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

  if (error) return <ErrorDisplay error={error} onRetry={() => window.location.reload()} />;

  if (isLoading || !chatClient) return <PageLoader />;
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#0f3460] to-[#7209b7] bg-[radial-gradient(ellipse_at_top_left,_rgba(116,58,213,0.15)_0%,_transparent_50%),_radial-gradient(ellipse_at_bottom_right,_rgba(74,21,75,0.15)_0%,_transparent_50%)] p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(116,58,213,0.15)_0%,transparent_40%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,21,75,0.1)_0%,transparent_40%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <Chat client={chatClient}>
        <div className="max-w-[1400px] mx-auto h-[calc(100vh-4rem)] flex bg-purple-900/20 rounded-3xl backdrop-blur-[25px] border border-purple-500/30 shadow-[0_30px_60px_rgba(0,0,0,0.3),_0_0_100px_rgba(116,58,213,0.1),_inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden relative z-10">
          {/* LEFT SIDEBAR */}
          <div className="h-full backdrop-blur-[25px] border-none overflow-hidden relative shadow-[inset_0_1px_0_rgba(255,255,255,0.1),_inset_-1px_0_0_rgba(255,255,255,0.05)] bg-inherit w-80">
            <div className="h-full relative z-1 bg-gradient-to-b from-[#2D1B4E] via-[#1E103C] via-[#1A0B2E] via-[#1E103C] to-[#2D1B4E] bg-[linear-gradient(45deg,_rgba(116,58,213,0.3)_0%,_rgba(74,21,75,0.5)_30%,_rgba(114,9,183,0.4)_60%,_rgba(83,52,131,0.3)_100%)] flex flex-col">
              {/* HEADER */}
              <div className="px-6 py-6 border-b border-purple-400/20 flex items-center justify-between relative z-2 flex-shrink-0">
                <div className="flex items-center gap-4 relative">
                  <img
                    src="../../public/logo.png"
                    alt="Logo"
                    className="w-10 h-10 rounded-xl shadow-[0_8px_25px_rgba(74,21,75,0.4),_0_4px_15px_rgba(114,9,183,0.3),_inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_35px_rgba(74,21,75,0.5),_0_6px_20px_rgba(114,9,183,0.4),_inset_0_1px_0_rgba(255,255,255,0.25)]"
                  />
                  <span className="text-xl font-bold font-sans tracking-wide bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                    Slackify
                  </span>
                </div>
                <div className="relative z-10 p-1 rounded-lg bg-purple-500/20 backdrop-blur-[10px] border border-purple-400/30 transition-all duration-300 hover:bg-purple-500/30 hover:border-purple-400/40 hover:shadow-[0_4px_15px_rgba(74,21,75,0.2)]">
                  <UserButton />
                </div>
              </div>

              {/* CHANNELS SECTION */}
              <div className="flex-1 overflow-y-auto relative z-1 py-4">
                {/* CREATE CHANNEL BUTTON */}
                <div className="px-5 mb-4">
                  <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-all duration-200 text-purple-100 hover:text-white text-sm font-medium border border-purple-400/30 hover:border-purple-400/40 shadow-sm hover:shadow-md"
                  >
                    <PlusIcon className="size-5" />
                    <span>Create Channel</span>
                  </button>
                </div>

                {/* CHANNEL LIST */}
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
                    <div className="relative z-1">
                      <div className="px-6 pt-6 pb-3 relative">
                        <div className="flex items-center gap-[0.75rem] text-white text-2xl font-bold">
                          <HashIcon className="size-4" />
                          <span>Channels</span>
                        </div>
                      </div>
                      {loading && <div className="">Loading channels...</div>}
                      {error && <div className="">Error loading channels</div>}

                      <div className="py-0.5 px-1 pb-1 relative">{children}</div>
                      <div className="relative pt-6 pb-2 px-6 mt-10 border-t border-gray-200 dark:border-gray-700 ">
                        <div className="flex items-center gap-3 text-white/90 font-bold text-[0.8rem] uppercase tracking-[0.1em] relative px-3 py-2 bg-white/5 rounded-lg backdrop-blur-md border border-white/10 shadow-[0_2px_10px_rgba(74,21,75,0.2),_inset_0_1px_0_rgba(255,255,255,0.1)]">
                          <UsersIcon className="size-4" />
                          <span>Direct Messages</span>
                        </div>
                      </div>
                      {/* <UsersList activeChannel={activeChannel} /> */}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* RIGHT CONTAINER */}
          <div className="flex-1 bg-gray-50 rounded-r-3xl overflow-hidden flex flex-col">
            <Channel channel={activeChannel}>
              <Window className="h-full flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <MessageList />
                </div>
                <div className="p-5 border-t border-gray-200">
                  <MessageInput />
                </div>
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
    </div>
  );
};
export default HomePage;
