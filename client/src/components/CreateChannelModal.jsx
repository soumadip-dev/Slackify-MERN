import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useChatContext } from 'stream-chat-react';
import toast from 'react-hot-toast';
import { AlertCircleIcon, HashIcon, LockIcon, UsersIcon, XIcon } from 'lucide-react';

const CreateChannelModal = ({ onClose }) => {
  const [channelName, setChannelName] = useState(''); // Name of the channel
  const [channelType, setChannelType] = useState('public'); // Type of the channel (public or private)
  const [description, setDescription] = useState(''); // Description of the channel
  const [isCreating, setIsCreating] = useState(false); // Flag to indicate if the channel is being created
  const [error, setError] = useState(''); // Error message
  const [users, setUsers] = useState([]); // List of users
  const [selectedMembers, setSelectedMembers] = useState([]); // List of selected members
  const [loadingUsers, setLoadingUsers] = useState(false); // Flag to indicate if users are being loaded from stream

  const [_, setSearchParams] = useSearchParams(); // URL search params

  const { client, setActiveChannel } = useChatContext();

  // Fetch users for member selection
  useEffect(() => {
    const fetchUsers = async () => {
      if (!client?.user) return; // Return if client or user is not available
      setLoadingUsers(true); // Set loading state to true
      try {
        // Fetch users from Stream except the current user and sort by name and limit to 100
        const response = await client.queryUsers(
          { id: { $ne: client.user.id } },
          { name: 1 },
          { limit: 100 }
        );

        setUsers(response.users || []);
      } catch (error) {
        console.log('Error fetching users', error);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [client]);

  // Reset state when the modal is closed (NOT NIDDED)
  useEffect(() => {
    setChannelName('');
    setDescription('');
    setChannelType('public');
    setError('');
    setSelectedMembers([]);
  }, []);

  // If channel type is public, set selected members to all users
  useEffect(() => {
    if (channelType === 'public') {
      setSelectedMembers(users.map(user => user.id));
    } else {
      setSelectedMembers([]);
    }
  }, [channelType, users]);

  // Function to validate the channel name
  const validateChannelName = name => {
    if (!name.trim()) return 'Channel name is required';
    if (name.length < 3) return 'Channel name must be at least 3 characters';
    if (name.length > 22) return 'Channel name must be less than 22 characters';

    return '';
  };

  // Function to handle channel name change
  const handleChannelNameChange = e => {
    const value = e.target.value;
    setChannelName(value);
    setError(validateChannelName(value)); // set error message based on channel name from the above function
  };

  // Function to handle member toggle
  const handleMemberToggle = id => {
    if (selectedMembers.includes(id)) {
      setSelectedMembers(selectedMembers.filter(uid => uid !== id));
    } else {
      setSelectedMembers([...selectedMembers, id]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationError = validateChannelName(channelName); // validate channel name
    if (validationError) return setError(validationError); // return if there is an error in name validation
    if (isCreating || !client?.user) return; // return if creating or client or user is not available
    setIsCreating(true); // set creating state to true
    setError(''); // clear error message
    try {
      // MY COOL CHANNEL !#1 => my-cool-channel-1
      const channelId = channelName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-_]/g, '')
        .slice(0, 20);

      // Prepare the channeldata
      const channelData = {
        name: channelName.trim(),
        created_by_id: client.user.id,
        members: [client.user.id, ...selectedMembers],
      };

      // Add description to channel data if it exists
      if (description) channelData.description = description;

      // Set channel type (public or private) and visibility
      if (channelType === 'private') {
        channelData.private = true;
        channelData.visibility = 'private';
      } else {
        channelData.visibility = 'public';
        channelData.discoverable = true; // Custom property to make the channel discoverable
      }

      // Create the channel
      const channel = client.channel('messaging', channelId, channelData);

      // Real-time updates for the channel
      await channel.watch();

      // Set the active channel
      setActiveChannel(channel);
      toast.success(`Channel "${channelName}" created successfully!`);

      // Close the modal
      onClose();
    } catch (error) {
      console.log('Error creating the channel', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[1000]">
      <div className="bg-gradient-to-br from-[#2D1B4E] via-[#1E103C] to-[#2D1B4E] backdrop-blur-xl rounded-3xl w-[560px] max-w-[90vw] max-h-[85vh] overflow-hidden shadow-2xl border border-purple-500/20 relative">
        <div className="flex items-center justify-between p-6 border-b border-purple-400/20">
          <h2 className="text-xl font-semibold text-white">Create a channel</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-purple-500/20 border border-purple-400/30 text-white hover:bg-purple-500/30 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 max-h-[calc(85vh-80px)] overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-500/20 border border-red-400/40 rounded-xl text-red-100 text-sm">
              <AlertCircleIcon className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-6">
            <div className="relative">
              <HashIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-300/80" />
              <input
                id="channelName"
                type="text"
                value={channelName}
                onChange={handleChannelNameChange}
                placeholder="e.g. marketing"
                className={`w-full pl-10 pr-4 py-3 border rounded-xl text-white bg-purple-900/30 backdrop-blur-sm placeholder:text-purple-200/50 ${
                  error ? 'border-red-400/60' : 'border-purple-400/30'
                } focus:outline-none focus:ring-2 focus:ring-purple-500/50`}
                autoFocus
                maxLength={22}
              />
            </div>
            {channelName && (
              <div className="text-xs text-purple-200/80 mt-2 font-mono bg-purple-900/30 py-2 px-3 rounded-lg border-l-4 border-l-purple-500">
                Channel ID will be: #
                {channelName
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-_]/g, '')}
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-purple-100 text-sm mb-2">Channel type</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col p-4 border border-purple-400/30 rounded-xl cursor-pointer bg-purple-900/20 hover:bg-purple-800/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="radio"
                    value="public"
                    checked={channelType === 'public'}
                    onChange={e => setChannelType(e.target.value)}
                    className="accent-purple-500"
                  />
                  <HashIcon className="w-4 h-4 text-purple-300" />
                  <span className="font-medium text-white">Public</span>
                </div>
                <p className="text-xs text-purple-200/70">Anyone can join this channel</p>
              </label>

              <label className="flex flex-col p-4 border border-purple-400/30 rounded-xl cursor-pointer bg-purple-900/20 hover:bg-purple-800/30 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="radio"
                    value="private"
                    checked={channelType === 'private'}
                    onChange={e => setChannelType(e.target.value)}
                    className="accent-purple-500"
                  />
                  <LockIcon className="w-4 h-4 text-purple-300" />
                  <span className="font-medium text-white">Private</span>
                </div>
                <p className="text-xs text-purple-200/70">Only invited members can join</p>
              </label>
            </div>
          </div>

          {channelType === 'private' && (
            <div className="mb-6">
              <label className="block text-purple-100 text-sm mb-2">Add members</label>
              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setSelectedMembers(users.map(u => u.id))}
                  disabled={loadingUsers || users.length === 0}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-purple-900/30 border border-purple-400/30 rounded-lg text-purple-100 hover:bg-purple-800/40 transition-colors disabled:opacity-50"
                >
                  <UsersIcon className="w-4 h-4" />
                  Select Everyone
                </button>
                <span className="text-sm text-purple-100 bg-purple-900/30 py-2 px-3 rounded-lg">
                  {selectedMembers.length} selected
                </span>
              </div>
              <div className="max-h-48 overflow-y-auto border border-purple-400/30 rounded-xl p-3 bg-purple-900/20 space-y-2">
                {loadingUsers ? (
                  <p className="text-purple-200/70 text-center py-4">Loading users...</p>
                ) : users.length === 0 ? (
                  <p className="text-purple-200/70 text-center py-4">No users found</p>
                ) : (
                  users.map(user => (
                    <label
                      key={user.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-800/30 transition-colors cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(user.id)}
                        onChange={() => handleMemberToggle(user.id)}
                        className="accent-purple-500"
                      />
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || user.id}
                          className="w-8 h-8 rounded-full border-2 border-purple-400/30"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full border-2 border-purple-400/30 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-semibold text-sm">
                          {(user.name || user.id).charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-white font-medium text-sm">{user.name || user.id}</span>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="description" className="block text-purple-100 text-sm mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What's this channel about?"
              className="w-full p-3 border border-purple-400/30 rounded-xl text-white bg-purple-900/30 placeholder:text-purple-200/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-purple-400/20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-purple-200 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!channelName.trim() || isCreating}
              className="px-6 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isCreating ? 'Creating...' : 'Create Channel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal;
