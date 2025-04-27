import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim() && username.trim()) {
      navigate(
        `/room/${roomId.trim()}?username=${encodeURIComponent(username.trim())}`
      );
    } else {
      alert("Please enter both Room ID and Username.");
    }
  };

  const handleCreateRoom = () => {
    if (!username.trim()) {
      alert("Please enter a Username before creating a room.");
      return;
    }
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(
      `/room/${newRoomId}?username=${encodeURIComponent(username.trim())}`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg
              className="w-8 h-8 text-indigo-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              <path d="M2 2l7.586 7.586" />
              <circle cx="11" cy="11" r="2" />
            </svg>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              Canvas Flow
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="hover:text-indigo-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">
              How It Works
            </a>
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
            >
              Join Room
            </button>
          </div>
          <button
            onClick={() => setIsJoinModalOpen(true)}
            className="md:hidden px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Join
          </button>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Collaborative Drawing in{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                Real-Time
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Create, collaborate, and share your ideas visually with anyone, anywhere.
              Perfect for brainstorming, teaching, or just having fun together.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setIsJoinModalOpen(true)}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-lg font-medium"
              >
                Start Drawing
              </button>
              <a
                href="#features"
                className="px-8 py-3 bg-transparent border border-gray-500 hover:border-gray-300 rounded-lg transition-colors text-lg font-medium"
              >
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg blur-lg opacity-75"></div>
              <div className="relative bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                <div className="w-full h-[400px] bg-gradient-to-br from-purple-800 to-indigo-900 flex items-center justify-center p-8 rounded-lg">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <g fill="none" stroke="white" strokeWidth="2">
                      <circle cx="100" cy="100" r="80" stroke="white" strokeOpacity="0.2" />
                      <circle cx="100" cy="100" r="60" stroke="white" strokeOpacity="0.4" />
                      <circle cx="100" cy="100" r="40" stroke="white" strokeOpacity="0.6" />
                      <path d="M30,100 C30,50 170,50 170,100 C170,150 30,150 30,100 Z" strokeLinecap="round" />
                      <path d="M60,60 L140,140" strokeLinecap="round" />
                      <path d="M140,60 L60,140" strokeLinecap="round" />
                      <rect x="70" y="70" width="60" height="60" rx="10" strokeDasharray="4 2" />
                    </g>
                    <text x="100" y="170" textAnchor="middle" fill="white" fontSize="16">Collaborative Drawing</text>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">3 users collaborating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Canvas Flow provides all the tools you need for seamless real-time collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Collaboration</h3>
              <p className="text-gray-300">
                Work together with teammates in real-time, seeing changes as they happen without delays.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Intuitive Drawing Tools</h3>
              <p className="text-gray-300">
                Easy-to-use tools for shapes, freehand drawing, and text to bring your ideas to life visually.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Rooms</h3>
              <p className="text-gray-300">
                Create private rooms with unique IDs to control who can access and contribute to your drawings.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Persistent Storage</h3>
              <p className="text-gray-300">
                Your drawings are automatically saved, so you can continue where you left off anytime.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Customizable Experience</h3>
              <p className="text-gray-300">
                Change colors, brush sizes, and shapes to match your exact needs for any project.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 backdrop-blur-sm border border-gray-700/50">
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">No Installation Required</h3>
              <p className="text-gray-300">
                Works in any modern browser without plugins or installations, making collaboration instant.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto">
              Start collaborating in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold mb-3">Create a Room</h3>
              <p className="text-gray-300">
                Click "Create New Room" to get a unique room ID that you can share with others.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold mb-3">Share the Link</h3>
              <p className="text-gray-300">
                Send the room ID or direct link to anyone you want to collaborate with.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold mb-3">Draw Together</h3>
              <p className="text-gray-300">
                Start drawing and see everyone's changes in real-time as they happen.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => setIsJoinModalOpen(true)}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors text-lg font-medium"
            >
              Try It Now
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <svg
                className="w-8 h-8 text-indigo-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
              <span className="text-xl font-bold">Canvas Flow</span>
            </div>
            <div className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Canvas Flow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {isJoinModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl p-6 md:p-8 w-full max-w-md relative">
            <button
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">Join Drawing Room</h2>

            <form onSubmit={handleJoinRoom} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label htmlFor="roomId" className="block text-sm font-medium mb-2">
                  Room ID (optional)
                </label>
                <input
                  id="roomId"
                  type="text"
                  placeholder="Enter room ID or leave empty to create new"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors font-medium"
                >
                  Join Room
                </button>
                <button
                  type="button"
                  onClick={handleCreateRoom}
                  className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium"
                >
                  Create New Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
