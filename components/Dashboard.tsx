
import React from 'react';
import { UserStats, User } from '../types';

interface DashboardProps {
  stats: UserStats;
  user: User;
  onPlay: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, user, onPlay }) => {
  const isThomas = user.username.toLowerCase() === 'thomas';

  const StatCard = ({ label, value, icon, color }: { label: string; value: number | string; icon: string; color: string }) => (
    <div className="bg-gray-900/50 backdrop-blur p-6 rounded-2xl border border-white/5 flex items-center gap-4 transition-transform hover:scale-[1.02]">
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center text-2xl shadow-lg`}>
        {icon}
      </div>
      <div>
        <div className="text-gray-400 text-sm uppercase tracking-wider font-bold">{label}</div>
        <div className="text-3xl font-black text-white">{value}</div>
      </div>
    </div>
  );

  const winRate = stats.wins + stats.losses > 0 
    ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100) 
    : 0;

  return (
    <div className="max-w-6xl mx-auto w-full p-6 pt-24 md:pt-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <h2 className="text-4xl font-black text-white">Welcome, {user.username}</h2>
             {isThomas && (
               <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">LEGENDARY EXPLORER</span>
             )}
           </div>
           <p className="text-teal-400">
             {isThomas ? "All systems online. Legendary dinosaurs and exotic biomes unlocked for your review." : "Ready for your next simulation?"}
           </p>
        </div>
        <button 
          onClick={onPlay}
          className="px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-teal-900/30 w-full md:w-auto"
        >
            Enter Battle Arena ⚔️
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard label="Total Wins" value={stats.wins} icon="🏆" color="bg-yellow-600/20 text-yellow-400" />
        <StatCard label="Win Rate" value={`${winRate}%`} icon="📈" color="bg-green-600/20 text-green-400" />
        <StatCard label="Best Streak" value={stats.highestStreak} icon="🔥" color="bg-red-600/20 text-red-400" />
        <StatCard label="Discovered" value={stats.dinosDiscovered.length} icon="🦕" color="bg-blue-600/20 text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-gray-900/30 rounded-2xl p-6 border border-white/5">
           <h3 className="text-xl font-bold text-white mb-4">Recent Simulations</h3>
           <div className="space-y-3">
             {Array.isArray(stats.recentMatches) && stats.recentMatches.length > 0 ? (
                stats.recentMatches.map((match, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-lg border border-white/5 hover:bg-black/60 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${match.isPlayerCorrect ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]' : 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.8)]'}`}></div>
                      <div className="flex flex-col min-w-0">
                          <span className="text-gray-200 text-sm font-bold truncate">{match.winnerName} <span className="text-gray-600 text-xs font-normal">def.</span> {match.loserName}</span>
                          <span className="text-xs text-teal-500/70">{match.environment}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {Math.floor((Date.now() - match.timestamp) / 60000)}m ago
                    </span>
                  </div>
                ))
             ) : (
                 <div className="p-6 text-center text-gray-500 italic">
                    No battle data recorded. Start a simulation to generate data.
                 </div>
             )}
           </div>
        </div>

        {/* Battle Tips & Tricks */}
        <div className="bg-gradient-to-br from-blue-900/40 to-teal-900/40 rounded-2xl p-6 border border-teal-500/30 relative overflow-hidden">
            <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-4">Battle Intelligence</h3>
                <div className="space-y-4">
                    <div className="flex gap-3">
                        <span className="text-2xl">⚖️</span>
                        <div>
                            <p className="text-teal-200 font-bold text-sm">Mass vs. Speed</p>
                            <p className="text-gray-400 text-xs">Larger dinosaurs dominate in raw power, but agile predators (Speed 50+) can dodge attacks and win via stamina.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-2xl">🧬</span>
                        <div>
                            <p className="text-teal-200 font-bold text-sm">Genetic Traits</p>
                            <p className="text-gray-400 text-xs">Certain species have higher critical hit chances. T-Rex has a fearsome 'Killer Instinct' boost.</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <span className="text-2xl">🌍</span>
                        <div>
                            <p className="text-teal-200 font-bold text-sm">Terrain Matters</p>
                            <p className="text-gray-400 text-xs">Water-type dinosaurs like Mosasaurus get a massive advantage in aquatic biomes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
