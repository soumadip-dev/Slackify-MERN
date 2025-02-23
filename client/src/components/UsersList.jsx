import { useQuery } from '@tanstack/react-query';
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

  if (isLoading)
    return (
      <div className="px-4 py-3 text-sm text-center text-purple-200/80 bg-purple-500/10 rounded-lg border border-purple-400/20 backdrop-blur-sm mx-3 my-1">
        Loading users...
      </div>
    );
  if (isError)
    return (
      <div className="px-4 py-3 text-sm text-center text-red-200/90 bg-red-500/10 rounded-lg border border-red-400/20 backdrop-blur-sm mx-3 my-1">
        Failed to load users
      </div>
    );
  if (!users.length)
    return (
      <div className="px-4 py-3 text-sm text-center text-purple-200/80 bg-purple-500/10 rounded-lg border border-purple-400/20 backdrop-blur-sm mx-3 my-1">
        No other users found
      </div>
    );
  return <div>UsersList</div>;
};

export default UsersList;
