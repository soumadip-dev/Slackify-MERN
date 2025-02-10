import { XIcon } from 'lucide-react';

const PinnedMessagesModal = ({ pinnedMessages, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-auto border border-gray-200">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pinned Messages</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* MESSAGES LIST */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {pinnedMessages.map(msg => (
            <div key={msg.id} className="py-5 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start gap-3 mb-2">
                <img
                  src={msg.user.image}
                  alt={msg.user.name}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">{msg.user.name}</div>
                  <div className="text-base text-gray-800 whitespace-pre-line break-words leading-relaxed mt-1">
                    {msg.text}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {pinnedMessages.length === 0 && (
            <div className="text-center text-gray-500 py-10 text-base">No pinned messages</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinnedMessagesModal;
