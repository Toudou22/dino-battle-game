import React, { useEffect, useState } from 'react';

const LOADING_MESSAGES = [
  "EXTRACTING DNA FROM AMBER...",
  "SEQUENCING GENOME...",
  "FILLING GAPS WITH FROG DNA...",
  "CALIBRATING BITE FORCE...",
  "SIMULATING PREDATORY INSTINCTS...",
  "RENDERING SCALES AND FEATHERS...",
  "ESTABLISHING CONTAINMENT FIELDS...",
  "ANALYZING COMBAT SIMULATIONS...",
  "SYNCHRONIZING TEMPORAL DATA...",
  "LOADING ATMOSPHERIC CONDITIONS...",
  "PREPARING BATTLE ARENA...",
  "BREACHING FIREWALL...",
  "ACCESSING CLASSIFIED FILES...",
];

export const LoadingScreen: React.FC = () => {
  const [message, setMessage] = useState(LOADING_MESSAGES[0]);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Rotate main status message
    const messageInterval = setInterval(() => {
      setMessage(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    }, 1500);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress >= 100) return 100;
        // Random jumps to simulate processing spikes
        const jump = Math.random() < 0.2 ? 15 : 2; 
        return Math.min(oldProgress + Math.random() * jump, 100);
      });
    }, 200);

    // Generate scrolling terminal logs
    const logInterval = setInterval(() => {
      setLogs(prev => {
        const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
        const newLog = `> PROCESS_${hex} ... OK`;
        const updatedLogs = [...prev, newLog];
        if (updatedLogs.length > 6) return updatedLogs.slice(1);
        return updatedLogs;
      });
    }, 150);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 font-mono overflow-hidden">
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <div className="relative z-10 w-full max-w-lg p-8">
        {/* DNA / Spinner Animation */}
        <div className="flex justify-center mb-12 relative">
          <div className="w-24 h-24 border-4 border-teal-900 rounded-full animate-pulse absolute"></div>
          <div className="w-24 h-24 border-t-4 border-teal-500 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-b-4 border-teal-400 rounded-full animate-spin absolute top-4" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-0 flex items-center justify-center text-4xl animate-pulse">🧬</div>
        </div>

        {/* Main Title */}
        <h2 className="text-3xl font-black text-center text-teal-500 tracking-[0.3em] mb-2 animate-pulse">
          SYSTEM PROCESSING
        </h2>

        {/* Current Status Message */}
        <div className="h-8 flex items-center justify-center mb-8">
          <p className="text-teal-300 text-lg tracking-wider truncate">
            {message}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-6 bg-gray-900 border border-teal-800 rounded-sm overflow-hidden mb-6 shadow-[0_0_15px_rgba(20,184,166,0.3)]">
          {/* Striped Background for Bar */}
          <div 
            className="h-full bg-teal-600 transition-all duration-200 ease-out relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:20px_20px] animate-[spin_1s_linear_infinite]" style={{ animation: 'slide 1s linear infinite' }}></div>
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white]"></div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex justify-between text-xs text-teal-700 mb-6 font-bold">
           <span>CPU: {Math.floor(Math.random() * 30 + 70)}%</span>
           <span>MEM: {Math.floor(Math.random() * 20 + 40)}TB</span>
           <span>NET: SECURE</span>
        </div>

        {/* Terminal Logs */}
        <div className="bg-black/80 border border-teal-900/50 p-4 rounded font-mono text-xs h-32 flex flex-col justify-end shadow-inner">
          {logs.map((log, index) => (
            <div key={index} className="text-teal-500/70 truncate font-light">
              {log}
            </div>
          ))}
           <div className="text-teal-400 animate-pulse mt-1">_</div>
        </div>

      </div>
      
      <style>{`
        @keyframes slide {
          0% { background-position: 0 0; }
          100% { background-position: 20px 20px; }
        }
      `}</style>
    </div>
  );
};
