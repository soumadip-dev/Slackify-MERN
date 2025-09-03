import { AlertCircleIcon } from 'lucide-react';

const ErrorDisplay = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] via-[#0f3460] to-[#7209b7] flex items-center justify-center p-8">
      <div className="bg-purple-900/20 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 shadow-xl max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-red-500/20 rounded-full">
            <AlertCircleIcon className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white text-center mb-4">Something went wrong</h2>

        <p className="text-purple-200/80 text-center mb-6">
          We encountered an error while loading the application. Please try again.
        </p>

        {error && (
          <details className="mb-6">
            <summary className="text-purple-300/70 text-sm cursor-pointer">
              Technical details
            </summary>
            <pre className="mt-2 p-3 bg-purple-900/30 rounded-lg text-xs text-purple-200/60 overflow-auto">
              {error.toString()}
            </pre>
          </details>
        )}

        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay;
