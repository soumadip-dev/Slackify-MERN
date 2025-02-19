import { Loader2 } from 'lucide-react';

const ChannelLoadingState = ({ message = 'Loading channels...' }) => {
  return (
    <div className="px-5 py-2 text-purple-200 text-sm flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{message}</span>
    </div>
  );
};

export default ChannelLoadingState;
