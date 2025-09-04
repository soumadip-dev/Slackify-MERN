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
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {isLoadingUsers && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}

          {error && (
            <div className="py-4 text-center">
              <p className="text-red-500 mb-2">Failed to load users</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {users.length === 0 && !isLoadingUsers && !error && (
            <p className="text-center text-gray-500 py-8">No users available to invite</p>
          )}

          <div className="space-y-3">
            {users.map(user => {
              const isChecked = selectedMembers.includes(user.id);

              return (
                <label
                  key={user.id}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                    isChecked
                      ? 'bg-purple-50 border border-purple-200'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                    checked={isChecked}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedMembers([...selectedMembers, user.id]);
                      } else {
                        setSelectedMembers(selectedMembers.filter(id => id !== user.id));
                      }
                    }}
                  />

                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {(user.name || user.id).charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="font-medium text-gray-900 text-base flex-1">
                    {user.name || user.id}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            onClick={onClose}
            disabled={isInviting}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 rounded-lg text-white transition-colors"
            onClick={handleInvite}
            disabled={selectedMembers.length === 0 || isInviting}
          >
            {isInviting ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Inviting...
              </span>
            ) : (
              `Invite ${selectedMembers.length > 0 ? `(${selectedMembers.length})` : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
