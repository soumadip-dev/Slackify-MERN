import { useState } from 'react';
import { useSearchParams } from 'react-router';

const CreateChannelModal = () => {
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState('public');
  const [description, setDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [_, setSearchParams] = useSearchParams();
  
  return <div>CreateChannelModal</div>;
};

export default CreateChannelModal;
