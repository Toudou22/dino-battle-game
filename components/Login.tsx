
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (username: string, isThomas: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const lowerName = username.trim().toLowerCase();
    
    // Special handling for Thomas
    if (lowerName === 'thomas') {
      if (password.toUpperCase() === 'DINO-VIP') {
        onLogin('Thomas', true);
      } else {
        setError('Incorrect Access Key for Thomas.');
      }
      return;
    }

    // General access for others
    if (username.trim()) {
      onLogin(username.trim(), false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] w-full animate-fade-in">
      <div className="bg-gray-900/60 backdrop-blur-xl p-8 rounded-2xl border border-teal-500/30 shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-teal-300 via-blue-300 to-purple-400 drop-shadow-2xl mb-2">
            DINO CLUB
          </h1>
          <p className="text-gray-400 text-sm">Enter your explorer ID and Access Key.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-teal-200 mb-2">Explorer Name</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., Thomas"
              required
            />
          </div>

          <div>
            <label htmlFor="key" className="block text-sm font-medium text-teal-200 mb-2">Access Key (Optional for Guests)</label>
            <input
              type="password"
              id="key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center animate-shake">{error}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-teal-900/20 transition-transform transform hover:scale-[1.02]"
          >
            Enter Facility
          </button>
        </form>
        <div className="mt-6 text-center text-xs text-gray-500">
          Special access enabled for Authorized Personnel.
        </div>
      </div>
    </div>
  );
};
