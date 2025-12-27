
import React from 'react';
import { LEGENDARY_DINO_NAMES } from '../constants';

interface PricingProps {
  onUpgrade: () => void;
  isPremium: boolean;
}

export const Pricing: React.FC<PricingProps> = ({ onUpgrade, isPremium }) => {
  return (
    <div className="max-w-5xl mx-auto w-full p-6 pt-24 md:pt-6 animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black text-white mb-4">Join the Dino Club</h2>
        <p className="text-xl text-gray-400">Unlock the most dangerous creatures and exotic environments.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Free Tier */}
        <div className="bg-gray-900/40 backdrop-blur-md rounded-2xl p-8 border border-white/10 opacity-80 hover:opacity-100 transition-opacity">
          <h3 className="text-2xl font-bold text-gray-300 mb-2">Rookie Explorer</h3>
          <div className="text-4xl font-black text-white mb-6">Free</div>
          <ul className="space-y-4 text-gray-400 mb-8">
            <li className="flex items-center gap-2"><span>✓</span> Standard Roster (40+ Species)</li>
            <li className="flex items-center gap-2"><span>✓</span> Basic Environments</li>
            <li className="flex items-center gap-2"><span>✓</span> Standard Stats Tracking</li>
            <li className="flex items-center gap-2"><span>✓</span> Access to Dino-Pedia</li>
            <li className="flex items-center gap-2 opacity-50"><span>✕</span> No Legendary Beasts</li>
            <li className="flex items-center gap-2 opacity-50"><span>✕</span> No Exotic Biomes</li>
          </ul>
          <button className="w-full py-3 rounded-lg bg-gray-700 text-gray-300 font-bold cursor-default">
            Current Plan
          </button>
        </div>

        {/* Premium Tier */}
        <div className="relative bg-gradient-to-b from-teal-900/80 to-black rounded-2xl p-8 border-2 border-teal-500 shadow-[0_0_50px_rgba(20,184,166,0.3)] transform md:scale-105">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-black px-4 py-1 rounded-full text-sm uppercase tracking-wider shadow-lg">
            Best Value
          </div>
          
          <h3 className="text-2xl font-bold text-teal-200 mb-2">Paleo Pro</h3>
          <div className="text-4xl font-black text-white mb-6">$2.99 <span className="text-lg font-normal text-gray-400">/ lifetime</span></div>
          
          <ul className="space-y-4 text-gray-200 mb-8">
            <li className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-yellow-400">
                    <span>⭐</span> Unlock All {LEGENDARY_DINO_NAMES.length} Legendary Dinos
                </div>
                <div className="bg-black/30 rounded-lg p-4 border border-yellow-500/20">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {LEGENDARY_DINO_NAMES.map(name => (
                            <div key={name} className="flex items-center gap-2 text-xs text-yellow-100">
                                <span className="text-yellow-500">✓</span> {name}
                            </div>
                        ))}
                    </div>
                </div>
            </li>
            <li className="flex items-center gap-2 text-teal-200">
                <span>🌍</span> Access Exotic Biomes
            </li>
            <li className="text-xs text-gray-400 pl-7 -mt-2">Space Stations, Underwater Cities, Lava Fields</li>
            <li className="flex items-center gap-2"><span>🎓</span> Full Classified Database Access</li>
            <li className="flex items-center gap-2"><span>🎨</span> High-Res Battle Posters</li>
          </ul>

          {isPremium ? (
             <button className="w-full py-4 rounded-xl bg-green-600 text-white font-bold flex items-center justify-center gap-2 cursor-default">
                <span>✅</span> Member Active
             </button>
          ) : (
            <button 
                onClick={onUpgrade}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-400 hover:to-blue-400 text-white font-black text-lg shadow-xl transition-all hover:scale-105"
            >
                UNLOCK EVERYTHING
            </button>
          )}
          
          <p className="text-center text-xs text-gray-500 mt-4">
            Secure payment. One-time purchase. No ads.
          </p>
        </div>
      </div>
    </div>
  );
};
