import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { XIcon } from 'lucide-react';

const InviteModal = ({ channel, onClose }) => {
  // Get the Stream client
  const { client } = useChatContext();

  const [selectedMembers, setSelectedMembers] = useState([]); // List of selected members
  const [isInviting, setIsInviting] = useState(false); // Flag to indicate if the members are being invited

  // Use React Query to fetch users
  const {
    data: users = [],
    isLoading: isLoadingUsers,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', channel.id], // Unique key for caching
    queryFn: async () => {
      const members = Object.keys(channel.state.members);
      const res = await client.queryUsers({ id: { $nin: members } }, { name: 1 }, { limit: 30 });
      return res.users;
    },
    enabled: !!channel && !!client, // Only run query when channel and client are available
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: 2, // Retry failed requests up to 2 times
  });

  const handleInvite = async () => {
    if (selectedMembers.length === 0) return;
    setIsInviting(true);
    try {
      await channel.addMembers(selectedMembers);
      onClose();
    } catch (error) {
      console.log('Error inviting users:', error);
      // You might want to handle this error differently
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl mx-auto border border-gray-200">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Invite Users</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="">
          {isLoadingUsers && <p>Loading users...</p>}
          {error && <p className="">Failed to load users</p>}
          {users.length === 0 && !isLoadingUsers && <p>No users found</p>}

          {users.length > 0 &&
            users.map(user => {
              const isChecked = selectedMembers.includes(user.id);

              return (
                <label
                  key={user.id}
                  className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-all shadow-sm bg-white hover:bg-[#f5f3ff] border-2 ${
                    isChecked ? 'border-[#611f69] bg-[#f3e6fa]' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="checkbox checbox-primay checkbox-sm accent-[#611f69]"
                    value={user.id}
                    onChange={e => {
                      if (e.target.checked) setSelectedMembers([...selectedMembers, user.id]);
                      else setSelectedMembers(selectedMembers.filter(id => id !== user.id));
                    }}
                  />

                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="size-9 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="size-9 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-lg">
                      {(user.name || user.id).charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="font-medium text-[#611f69] text-base">
                    {user.name || user.id}
                  </span>
                </label>
              );
            })}

          {/* ACTIONS */}
          <div className="">
            <button className="btn btn-secondary" onClick={onClose} disabled={isInviting}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleInvite}
              disabled={!selectedMembers.length || isInviting}
            >
              {isInviting ? 'Inviting...' : 'Invite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
