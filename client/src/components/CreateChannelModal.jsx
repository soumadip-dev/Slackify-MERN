import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useChatContext } from 'stream-chat-react';

const CreateChannelModal = () => {
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
    } catch (error) {
      console.log('Error creating the channel', error);
    } finally {
      setIsCreating(false);
    }
  };

  return <div>CreateChannelModal</div>;
};

export default CreateChannelModal;
