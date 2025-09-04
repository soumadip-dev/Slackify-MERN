import { useQuery } from '@tanstack/react-query';
import { CircleIcon, Loader2, AlertCircle } from 'lucide-react';
import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { useChatContext } from 'stream-chat-react';

const UsersList = ({ activeChannel }) => {
  const { client } = useChatContext();
  const [_, setSearchParams] = useSearchParams();

  // Fetch users from Stream except the current user and sort by name and limit to 20
  const fetchUsers = useCallback(async () => {
    if (!client?.user) return;

    const response = await client.queryUsers(
      { id: { $ne: client.user.id } },
      { name: 1 },
      { limit: 20 }
    );

    // Filter out the recording users
    const usersOnly = response.users.filter(user => !user.id.startsWith('recording-'));

    return usersOnly;
  }, [client]);

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['users-list', client?.user?.id], // Unique key for caching the users
    queryFn: fetchUsers,
    enabled: !!client?.user, // Run query only if client and user are available
    staleTime: 1000 * 60 * 5, // tells React Query the data is "fresh" for 5 minutes, during these 5 minutes, React Query will not refetch the data automatically
  });

  const startDirectMessage = async targetUser => {
    if (!targetUser || !client?.user) return;

    try {
      // Create a unique channel ID for the two users.
      // Example:
      //   Current user = "12"
      //   Target user = "34"
      //   ["12", "34"].sort() => ["12", "34"]
      //   join("-") => "12-34"
      // Sorting ensures the ID is the same no matter who starts the chat.
      // Slice(0, 64) makes sure the ID is within Stream's 64-character limit.
      const channelId = [client.user.id, targetUser.id].sort().join('-').slice(0, 64);

      // Create a messaging channel with these two members.
      const channel = client.channel('messaging', channelId, {
        members: [client.user.id, targetUser.id],
      });

      // Watch the channel to listen for new messages.
      await channel.watch();

      // Update the URL with the channel ID so the UI knows which chat to show.
      setSearchParams({ channel: channel.id });
    } catch (error) {
      console.log('Error creating DM', error);
    }
  };

  if (isLoading)
    return (
      <div className="px-5 py-2 text-purple-200 text-sm flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Loading users...</span>
      </div>
    );
  if (isError)
    return (
      <div className="px-5 py-2 text-red-300 text-sm flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>Error loading users</span>
      </div>
    );
  if (!users.length)
    return (
      <div className="px-5 py-2 text-purple-200 text-sm">
        <span>No other users found</span>
      </div>
    );
  return (
    <div className="px-1 py-0.5">
      {users.map(user => {
        const channelId = [client.user.id, user.id].sort().join('-').slice(0, 64);
        const channel = client.channel('messaging', channelId, {
          members: [client.user.id, user.id],
        });
        const unreadCount = channel.countUnread();
        const isActive = activeChannel && activeChannel.id === channelId;

        return (
          <button
            key={user.id}
            onClick={() => startDirectMessage(user)}
            className={`w-full text-left px-4 py-3 rounded-xl flex items-center transition-all duration-200 ease-in-out relative ${
              isActive
                ? 'bg-purple-600/40 border border-purple-400/30 text-white shadow-lg'
                : 'text-purple-100/90 hover:bg-purple-500/20 hover:text-white border border-transparent'
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="relative">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || user.id}
                    className="w-6 h-6 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-[0_2px_8px_rgba(116,58,213,0.3)]">
                    <span className="text-xs text-white font-medium">
                      {(user.name || user.id).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <CircleIcon
                  className={`w-2 h-2 absolute -bottom-0.5 -right-0.5 ${
                    user.online
                      ? 'text-green-400 fill-green-400 drop-shadow-[0_0_4px_rgba(74,222,128,0.5)]'
                      : 'text-gray-400 fill-gray-400'
                  }`}
                />
              </div>

              <span className="flex-1 truncate text-sm font-medium">{user.name || user.id}</span>
              {unreadCount > 0 && (
                <span className="flex items-center justify-center ml-2 min-w-5 h-5 text-xs rounded-full bg-red-500 text-white px-1 shadow-sm">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default UsersList;
