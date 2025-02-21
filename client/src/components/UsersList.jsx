import { useSearchParams } from 'react-router';
import { useChatContext } from 'stream-chat-react';

const UsersList = () => {
  const { client } = useChatContext();
  const [_, setSearchParams] = useSearchParams();
  return <div>UsersList</div>;
};

export default UsersList;
