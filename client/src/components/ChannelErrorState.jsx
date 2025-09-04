import { AlertCircle } from 'lucide-react';

const ChannelErrorState = ({ message = 'Error loading channels' }) => {
  return (
    <div className="px-5 py-2 text-red-300 text-sm flex items-center gap-2">
      <AlertCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};

export default ChannelErrorState;
