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

  return <div>UsersList</div>;
};

export default UsersList;
