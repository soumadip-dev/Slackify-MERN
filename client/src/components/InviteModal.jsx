import { useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { XIcon } from 'lucide-react';

const InviteModal = ({ channel, onClose }) => {
  // Get the Stream client
  const { client } = useChatContext();

  const [users, setUsers] = useState([]); // List of users
  const [selectedMembers, setSelectedMembers] = useState([]); // List of selected members
  const [isLoadingUsers, setIsLoadingUsers] = useState(true); // Flag to indicate if users are being loaded
  const [error, setError] = useState(''); // Error message
  const [isInviting, setIsInviting] = useState(false); // Flag to indicate if the members are being invited

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setError('');

      try {
        const members = Object.keys(channel.state.members);
        const res = await client.queryUsers({ id: { $nin: members } }, { name: 1 }, { limit: 30 });
        setUsers(res.users);
      } catch (error) {
        console.log('Error fetching users', error);
        setError('Failed to load users');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, [channel, client]);

  const handleInvite = async () => {
    if (selectedMembers.length === 0) return; // Return if no members are selected
    setIsInviting(true); // Set inviting state to true
    setError(''); // Clear error message
    try {
      await channel.addMembers(selectedMembers);
      onClose();
    } catch (error) {
      setError('Failed to invite users');
      console.log('Error inviting users:', error);
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
          {error && <p className="">{error}</p>}
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
