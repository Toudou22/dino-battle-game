import React from 'react';

interface SoundToggleProps {
  isMuted: boolean;
  onToggle: () => void;
}

export const SoundToggle: React.FC<SoundToggleProps> = ({ isMuted, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-3 bg-gray-800/50 backdrop-blur-sm rounded-full text-2xl hover:bg-gray-700 transition-colors"
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
    >
      {isMuted ? '🔇' : '🔊'}
    </button>
  );
};
