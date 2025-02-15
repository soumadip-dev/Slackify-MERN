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
        channelData.discoverable = true; // Custom property to make the channel discoverable for later use
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] animate-overlayFadeIn">
      <div className="bg-gradient-to-br from-[rgba(74,21,75,0.95)] via-[rgba(45,11,46,0.95)] to-[rgba(74,21,75,0.95)] backdrop-blur-[25px] rounded-3xl w-[560px] max-w-[90vw] max-h-[85vh] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4),0_20px_40px_rgba(116,58,213,0.2),inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.2)] border border-white/10 relative animate-modalSlideIn before:content-[''] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_20%_20%,rgba(116,58,213,0.15)_0%,transparent_50%),radial-gradient(circle_at_80%_60%,rgba(114,9,183,0.1)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,rgba(74,21,75,0.12)_0%,transparent_50%)] before:animate-subtleShimmer before:pointer-events-none">
        <div className="`flex items-center justify-between p-8 pb-6 border-b border-white/10 relative z-10`">
          <h2>Create a channel</h2>
          <button
            onClick={onClose}
            className="bg-white/10 border border-white/15 text-white/80 cursor-pointer p-2.5 rounded-xl backdrop-blur-[10px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="px-8 pb-8 relative z-10 max-h-[calc(85vh-140px)] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-white/30"
        >
          {error && (
            <div className="flex items-center gap-2 p-3.5 px-4 bg-red-500/15 border border-red-500/30 rounded-xl text-red-200/95 text-sm mb-4 backdrop-blur-[10px] animate-errorShake">
              <AlertCircleIcon className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Channel name */}
          <div className="my-6">
            <div className="relative">
              <HashIcon className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/60 z-10 w-4 h-4" />
              <input
                id="channelName"
                type="text"
                value={channelName}
                onChange={handleChannelNameChange}
                placeholder="e.g. marketing"
                className={`w-full py-4 pl-11 pr-4 border border-white/15 rounded-xl text-sm text-white/95 bg-white/8 backdrop-blur-[10px] transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-inner ${
                  error ? `border-red-500/60 bg-white/10` : ''
                }`}
                autoFocus
                maxLength={22}
              />
            </div>

            {/* channel id  preview */}
            {channelName && (
              <div className="text-xs text-white/60 mt-2 font-mono bg-white/5 py-2 px-3 rounded-lg border-l-4 border-l-[rgba(114,9,183,0.5)]">
                Channel ID will be: #
                {channelName
                  .toLowerCase()
                  .replace(/\s+/g, '-')
                  .replace(/[^a-z0-9-_]/g, '')}
              </div>
            )}
          </div>

          {/* CHANNEL TYPE */}
          <div className="my-6">
            <label>Channel type</label>
            <div className="flex items-start gap-4 p-5 border border-white/15 rounded-2xl cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white/5 backdrop-blur-[10px] relative overflow-hidden">
              <label className="flex items-start gap-4 p-5 border border-white/15 rounded-2xl cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white/5 backdrop-blur-[10px] relative overflow-hidden">
                <input
                  type="radio"
                  value="public"
                  checked={channelType === 'public'}
                  onChange={e => setChannelType(e.target.value)}
                />
                <div className="flex items-start gap-3 flex-1 relative z-10">
                  <HashIcon className="size-4" />
                  <div>
                    <div className="font-bold text-white/95 text-[0.95rem] mb-1">Public</div>
                    <div className="text-white/70 text-[0.85rem] leading-[1.4]">
                      Anyone can join this channel
                    </div>
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-4 p-5 border border-white/15 rounded-2xl cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white/5 backdrop-blur-[10px] relative overflow-hidden">
                <input
                  type="radio"
                  value="private"
                  checked={channelType === 'private'}
                  onChange={e => setChannelType(e.target.value)}
                />
                <div className="flex items-start gap-3 flex-1 relative z-10">
                  <LockIcon className="size-4" />
                  <div>
                    <div className="font-bold text-white/95 text-[0.95rem] mb-1">Private</div>
                    <div className="text-white/70 text-[0.85rem] leading-[1.4]">
                      Only invited members can join
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal;
