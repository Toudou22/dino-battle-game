
import React from 'react';
import { User, AppView } from '../types';

interface SidebarProps {
  user: User;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onToggleGodMode: () => void;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, currentView, onChangeView, onToggleGodMode, onLogout, isOpen, onClose 
}) => {
  const isPremiumOrGod = user.isPremium || user.isGodMode;

  const handleViewChange = (view: AppView) => {
    onChangeView(view);
    onClose();
  };

  const NavItem = ({ view, icon, label, locked = false }: { view: AppView; icon: string; label: string; locked?: boolean }) => (
    <button
      onClick={() => handleViewChange(view)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === view
          ? 'bg-teal-900/50 text-teal-200 border border-teal-500/30'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      } ${locked ? 'opacity-70' : ''}`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
      {locked && <span className="ml-auto text-xs bg-black/50 px-2 py-0.5 rounded text-yellow-500">🔒</span>}
    </button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 z-40 transition-opacity duration-300 md:hidden backdrop-blur-sm ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-black/90 md:bg-black/80 backdrop-blur-md border-r border-white/10 flex flex-col h-screen transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:inset-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
                DINO<span className="text-white">BATTLE</span>
                </h1>
                <div className="mt-1 text-xs text-gray-500 font-mono tracking-widest">COMMAND CENTER</div>
            </div>
            {/* Mobile Close Button */}
            <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white p-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="px-4 py-2">
          <div className="bg-gray-900/50 rounded-lg p-3 flex items-center gap-3 border border-gray-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center font-bold text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-white truncate">{user.username}</div>
              <div className="text-xs text-teal-400">
                {isPremiumOrGod ? 'Premium Access' : 'Rookie Access'}
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <NavItem view="dashboard" icon="📊" label="Dashboard" />
          <NavItem view="game" icon="⚔️" label="Battle Arena" />
          <NavItem view="education" icon="📖" label="Dino-Pedia" />
          <NavItem view="biomes" icon="🌍" label="Dynamic Biomes" />
          <NavItem view="pricing" icon="💎" label="Club Membership" />
        </nav>

        <div className="p-4 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-mono uppercase">God Mode</span>
            <button
              onClick={onToggleGodMode}
              className={`w-12 h-6 rounded-full transition-colors duration-300 relative ${user.isGodMode ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
               <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${user.isGodMode ? 'translate-x-6' : ''}`}></div>
            </button>
          </div>

          <button 
              onClick={onLogout}
              className="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
          >
              <span>🚪</span> Log Out
          </button>
        </div>
      </aside>
    </>
  );
};
