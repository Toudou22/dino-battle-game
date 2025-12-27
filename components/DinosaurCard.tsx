
import React from 'react';
import type { Dinosaur } from '../types';

interface DinosaurCardProps {
  dinosaur: Dinosaur;
  image: string | null;
  onSelect?: (dino: Dinosaur) => void;
  showDetails: boolean;
  isWinner?: boolean;
  isSelected?: boolean;
  isLoser?: boolean;
}

const Stat = ({ label, value, icon }: { label: string; value: number | string; icon: string }) => (
  <div className="flex items-center text-sm bg-black/40 p-2 rounded-lg border border-white/10">
    <span className="text-xl mr-2">{icon}</span>
    <div className="flex flex-col">
      <span className="font-semibold text-teal-100">{label}</span>
      <span className="text-gray-300">{value}</span>
    </div>
  </div>
);

const ElementBadge = ({ element }: { element: string }) => {
  let icon = '🌿';
  let color = 'bg-green-900/50 text-green-300 border-green-500/30';
  
  if (element === 'Water') {
    icon = '💧';
    color = 'bg-blue-900/50 text-blue-300 border-blue-500/30';
  } else if (element === 'Sky') {
    icon = '🌪️';
    color = 'bg-purple-900/50 text-purple-300 border-purple-500/30';
  }

  return (
    <div className={`absolute bottom-2 left-2 z-10 backdrop-blur-md border px-2 py-1 rounded-full flex items-center gap-1.5 ${color} shadow-lg`}>
      <span className="text-sm">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider">{element}</span>
    </div>
  );
}

export const DinosaurCard: React.FC<DinosaurCardProps> = ({
  dinosaur,
  image,
  onSelect,
  showDetails,
  isWinner,
  isSelected,
  isLoser
}) => {
  const { common, scientific, short_desc, detailed_info, size, speed, attack, element, aliases } = dinosaur;

  const borderClass = isWinner
    ? 'border-green-500 ring-4 ring-green-500/50'
    : isLoser
    ? 'border-red-500 ring-4 ring-red-500/50'
    : 'border-white/10 hover:border-teal-400/50 hover:ring-2 hover:ring-teal-400/30';
  
  const overlayClass = isWinner
    ? 'bg-green-500/20'
    : isLoser
    ? 'bg-red-500/20'
    : '';

  return (
    <div className={`relative flex flex-col bg-gray-900/40 backdrop-blur-md rounded-xl shadow-2xl transition-all duration-500 overflow-hidden border-2 ${borderClass}`}>
      <div className="relative aspect-video bg-gray-950 group">
        <ElementBadge element={element} />
        
        {image ? (
          <img src={image} alt={`A realistic depiction of ${common}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-400"></div>
          </div>
        )}
        {showDetails && <div className={`absolute inset-0 ${overlayClass}`}></div>}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-white text-shadow-sm leading-none">{common}</h2>
          </div>
          {aliases && aliases.length > 0 && (
            <span className="text-xs text-gray-500 uppercase tracking-widest">aka {aliases.join(', ')}</span>
          )}
          <h3 className="text-lg font-light text-teal-200 italic mt-1">{scientific}</h3>
        </div>
        
        <p className="text-gray-200 mb-6 flex-grow leading-relaxed">
          {showDetails ? detailed_info : short_desc}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
            <Stat label="Size" value={`${size}m`} icon="📏" />
            <Stat label="Speed" value={`${speed}km/h`} icon="💨" />
            <Stat label="Attack" value={`${attack}/10`} icon="⚔️" />
        </div>
        
        {onSelect && !showDetails && (
          <button
            onClick={() => onSelect(dinosaur)}
            className="mt-auto w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-500 hover:to-blue-500 text-white font-bold py-3 px-4 rounded-lg transition-transform duration-200 transform hover:scale-105 shadow-lg shadow-teal-900/20 border border-white/10"
          >
            Choose as Winner
          </button>
        )}

        {showDetails && isWinner && (
          <div className="text-center font-bold text-2xl text-green-300 p-3 bg-green-900/60 rounded-lg border border-green-700">
            WINNER
          </div>
        )}
        {showDetails && isLoser && (
          <div className="text-center font-bold text-2xl text-red-300 p-3 bg-red-900/60 rounded-lg border border-red-700">
            DEFEATED
          </div>
        )}
      </div>
    </div>
  );
};
