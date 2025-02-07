import { useState } from 'react';
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

  

  // Function to validate the channel name
  const validateChannelName = name => {
    if (!name.trim()) return 'Channel name is required';
    if (name.length < 3) return 'Channel name must be at least 3 characters';
    if (name.length > 22) return 'Channel name must be less than 22 characters';

    return '';
  };

  return <div>CreateChannelModal</div>;
};

export default CreateChannelModal;
