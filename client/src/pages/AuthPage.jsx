import { SignInButton } from '@clerk/clerk-react';

const AuthPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#0f0a1f] via-[#1a1b3f] to-[#2d3a6b] overflow-hidden relative">
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(116,58,213,0.15)_0%,transparent_40%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(74,21,75,0.1)_0%,transparent_40%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      {/* Left side - Content */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-10 relative z-10 order-2 md:order-1">
        <div className="max-w-[500px] w-full text-white p-8 sm:p-10 md:p-12 bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] rounded-2xl backdrop-blur-xl border border-[rgba(255,255,255,0.1)] shadow-2xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#7e22ce] to-[#6b21a8] rounded-xl flex items-center justify-center shadow-lg">
              <img src="/logo.png" alt="Slackify" className="w-8 h-8" />
            </div>
            <span className="text-3xl sm:text-4xl font-bold font-sans uppercase bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent tracking-tight">
              Slackify
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-8 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
            Where Work <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] to-[#c084fc]">
              Happens
            </span>
          </h1>

          <p className="text-lg text-gray-300 mb-10 leading-relaxed font-light">
            Connect with your team instantly through secure, real-time messaging. Experience
            seamless collaboration with powerful features designed for modern teams.
          </p>

          <div className="flex flex-col gap-4 mb-10">
            <div className="flex items-center gap-4 p-4 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              <span className="text-xl w-10 h-10 flex items-center justify-center bg-[rgba(168,85,247,0.15)] rounded-full backdrop-blur-sm">
                💬
              </span>
              <span className="text-base font-medium">Real-time messaging</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              <span className="text-xl w-10 h-10 flex items-center justify-center bg-[rgba(168,85,247,0.15)] rounded-full backdrop-blur-sm">
                🎥
              </span>
              <span className="text-base font-medium">Video calls & meetings</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[rgba(255,255,255,0.03)] rounded-xl border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
              <span className="text-xl w-10 h-10 flex items-center justify-center bg-[rgba(168,85,247,0.15)] rounded-full backdrop-blur-sm">
                🔒
              </span>
              <span className="text-base font-medium">Secure & private</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <SignInButton mode="modal">
              <button className="w-full bg-gradient-to-r from-[#7e22ce] to-[#6b21a8] text-white font-semibold py-4 px-6 rounded-xl border border-[rgba(255,255,255,0.1)] hover:brightness-110 transition-all text-base shadow-lg hover:shadow-xl">
                Get Started
              </button>
            </SignInButton>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 md:p-10 lg:p-12 relative z-10 order-1 md:order-2 mt-8 md:mt-0">
        <div className="max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border border-[rgba(255,255,255,0.1)] bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.02)] backdrop-blur-xl p-1">
          <div className="rounded-xl overflow-hidden">
            <img
              src="/auth-page.png"
              alt="Team collaboration"
              className="w-full h-full object-cover rounded-xl"
              style={{ aspectRatio: '4/3' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
