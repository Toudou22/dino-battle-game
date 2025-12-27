
import React, { useEffect, useState, useRef } from 'react';

interface BattleConsoleProps {
  logs: string[];
  onComplete: () => void;
}

export const BattleConsole: React.FC<BattleConsoleProps> = ({ logs, onComplete }) => {
  const [visibleLogs, setVisibleLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      if (current < logs.length) {
        setVisibleLogs(prev => [...prev, logs[current]]);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1000);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [logs, onComplete]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleLogs]);

  return (
    <div className="bg-black/90 border border-teal-500/30 rounded-lg p-4 font-mono text-[10px] md:text-xs h-40 overflow-hidden relative shadow-[inset_0_0_20px_rgba(20,184,166,0.2)]">
      <div className="absolute top-2 right-2 flex gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        <div className="w-2 h-2 rounded-full bg-green-500"></div>
      </div>
      <div ref={scrollRef} className="h-full overflow-y-auto space-y-1 scrollbar-hide">
        <div className="text-teal-500/50 mb-2 border-b border-teal-500/10 pb-1">BATTLE_SIM_LOG_V3.1</div>
        {visibleLogs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-teal-700">[{new Date().toLocaleTimeString([], { hour12: false, minute: '2-digit', second: '2-digit' })}]</span>
            <span className={log.includes('CRITICAL') ? 'text-red-400 font-bold' : 'text-teal-300'}>{log}</span>
          </div>
        ))}
        <div className="text-teal-400 animate-pulse">_</div>
      </div>
    </div>
  );
};
