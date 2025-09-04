import { XIcon } from 'lucide-react';

const MembersModal = ({ members, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 border border-gray-100">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Channel Members</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <XIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* MEMBERS LIST */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {members.map(member => (
            <div
              key={member.user.id}
              className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0"
            >
              {member.user?.image ? (
                <img
                  src={member.user.image}
                  alt={member.user.name}
                  className="size-10 rounded-full object-cover ring-2 ring-gray-100"
                />
              ) : (
                <div className="flex size-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {(member.user.name || member.user.id).charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {member.user.name || member.user.id}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembersModal;
