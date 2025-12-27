import React, { useState, useCallback, useEffect } from 'react';
import { DinosaurCard } from './components/DinosaurCard';
import { LoadingScreen } from './components/LoadingScreen';
import { SoundToggle } from './components/SoundToggle';
import { Sidebar } from './components/Sidebar';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Pricing } from './components/Pricing';
import { Education } from './components/Education';
import { BattleConsole } from './components/BattleConsole';
import { DINOSAURS, ENVIRONMENTS, BASIC_ENVIRONMENTS } from './constants';
import { generateDinosaurImage, generateBattleCommentary } from './services/geminiService';
import type { Dinosaur, UserStats, User, AppView } from './types';
import { GameState } from './types';
import { useSound } from './hooks/useSound';
import { SOUNDS } from './constants/sounds';

type SoundKey = keyof typeof SOUNDS;

interface BattleResult {
    winner: Dinosaur;
    commentary: string;
    simulationLogs: string[];
}

const calculateBattleLogic = (dino1: Dinosaur, dino2: Dinosaur, environment: string): Omit<BattleResult, 'commentary'> => {
    let score1 = 0;
    let score2 = 0;
    const logs: string[] = ["INITIATING NEURAL LINK...", `BIOME DETECTED: ${environment.toUpperCase()}`];

    // Combat Formula
    const power1 = (Math.pow(dino1.size, 1.4) * 6) + (dino1.attack * 110);
    const power2 = (Math.pow(dino2.size, 1.4) * 6) + (dino2.attack * 110);
    
    score1 += power1 + (dino1.speed * 12);
    score2 += power2 + (dino2.speed * 12);

    // Habitat Bonuses
    if (environment.toLowerCase().includes("river") || environment.toLowerCase().includes("ocean")) {
        if (dino1.element === 'Water') score1 += 600;
        if (dino2.element === 'Water') score2 += 600;
    }

    const winner = score1 >= score2 ? dino1 : dino2;
    logs.push("CALCULATING PHYSICAL VECTORS...");
    logs.push("SIMULATING LETHAL ENGAGEMENT...");
    logs.push(`VICTOR IDENTIFIED: ${winner.common.toUpperCase()}`);

    return { winner, simulationLogs: logs };
};

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [currentView, setCurrentView] = useState<AppView>('login');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [gameState, setGameState] = useState<GameState>(GameState.START);
    const [fighters, setFighters] = useState<[Dinosaur, Dinosaur] | null>(null);
    const [images, setImages] = useState<[string | null, string | null]>([null, null]);
    const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
    const [playerChoice, setPlayerChoice] = useState<Dinosaur | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSimulating, setIsSimulating] = useState<boolean>(false);
    const [battleEnvironment, setBattleEnvironment] = useState<string>('');
    const { playSound, isMuted, toggleMute } = useSound();

    const [userStats, setUserStats] = useState<UserStats>(() => {
        const saved = localStorage.getItem('dino_stats');
        return saved ? JSON.parse(saved) : { wins: 0, losses: 0, currentStreak: 0, highestStreak: 0, dinosDiscovered: [], recentMatches: [] };
    });

    useEffect(() => { localStorage.setItem('dino_stats', JSON.stringify(userStats)); }, [userStats]);

    const handleLogin = (username: string, isThomas: boolean) => {
        setUser({ username, isPremium: isThomas || username.toLowerCase() === 'god', isGodMode: username.toLowerCase() === 'god' });
        setCurrentView('dashboard');
        if (isThomas) setTimeout(() => playSound('win'), 500);
    };

    const startGame = useCallback(async () => {
        if (!user) return;
        playSound('start');
        setIsLoading(true);
        setGameState(GameState.BATTLE);
        setFighters(null);
        setImages([null, null]);
        setBattleResult(null);
        setPlayerChoice(null);
        setIsSimulating(false);

        const envs = user.isPremium ? ENVIRONMENTS : BASIC_ENVIRONMENTS;
        const env = envs[Math.floor(Math.random() * envs.length)];
        setBattleEnvironment(env);

        const allowedDinos = DINOSAURS.filter(d => user.isPremium || d.tier !== 'legendary');
        const d1 = allowedDinos[Math.floor(Math.random() * allowedDinos.length)];
        const d2 = allowedDinos.filter(d => d.common !== d1.common)[Math.floor(Math.random() * (allowedDinos.length - 1))];

        setFighters([d1, d2]);
        try {
            const [img1, img2] = await Promise.all([
                generateDinosaurImage(d1.imagePrompt, env),
                generateDinosaurImage(d2.imagePrompt, env)
            ]);
            setImages([img1, img2]);
        } finally {
            setIsLoading(false);
        }
    }, [playSound, user]);

    const handleSelectDinosaur = async (dino: Dinosaur) => {
        if (!fighters || playerChoice) return;
        playSound('click');
        setPlayerChoice(dino);
        setIsSimulating(true);

        const logic = calculateBattleLogic(fighters[0], fighters[1], battleEnvironment);
        const loser = logic.winner.common === fighters[0].common ? fighters[1] : fighters[0];
        
        const story = await generateBattleCommentary(logic.winner, loser, battleEnvironment);
        setBattleResult({ ...logic, commentary: story });
    };

    const finalizeBattle = () => {
        if (!battleResult || !fighters || !playerChoice) return;
        setIsSimulating(false);
        const isCorrect = playerChoice.common === battleResult.winner.common;
        const loser = battleResult.winner.common === fighters[0].common ? fighters[1] : fighters[0];

        setUserStats(prev => ({
            ...prev,
            wins: isCorrect ? prev.wins + 1 : prev.wins,
            losses: !isCorrect ? prev.losses + 1 : prev.losses,
            currentStreak: isCorrect ? prev.currentStreak + 1 : 0,
            highestStreak: isCorrect ? Math.max(prev.highestStreak, prev.currentStreak + 1) : prev.highestStreak,
            recentMatches: [{
                timestamp: Date.now(),
                winnerName: battleResult.winner.common,
                loserName: loser.common,
                isPlayerCorrect: isCorrect,
                environment: battleEnvironment
            }, ...prev.recentMatches.slice(0, 19)]
        }));

        playSound(isCorrect ? 'win' : 'lose');
        playSound(battleResult.winner.soundKey as SoundKey);
        setGameState(GameState.RESULT);
    };

    return (
        <div className={`flex min-h-screen bg-transparent transition-all duration-300 ${isSimulating ? 'shake-active' : ''}`}>
             {!user ? (
                 <div className="flex-1 flex items-center justify-center p-6">
                    <Login onLogin={handleLogin} />
                 </div>
             ) : (
                <>
                    <Sidebar 
                        user={user} 
                        currentView={currentView} 
                        onChangeView={setCurrentView} 
                        onToggleGodMode={() => setUser(prev => prev ? {...prev, isGodMode: !prev.isGodMode} : null)} 
                        onLogout={() => setUser(null)} 
                        isOpen={isSidebarOpen} 
                        onClose={() => setIsSidebarOpen(false)} 
                    />
                    <main className="flex-1 flex flex-col relative overflow-y-auto h-screen">
                        {isLoading && <LoadingScreen />}
                        
                        {currentView === 'dashboard' && <Dashboard stats={userStats} user={user} onPlay={() => setCurrentView('game')} />}
                        
                        {currentView === 'game' && (
                            <div className="w-full max-w-6xl mx-auto p-6 pt-20">
                                {gameState === GameState.START && (
                                    <div className="h-full flex flex-col items-center justify-center py-20 text-center">
                                        <h1 className="text-8xl font-black text-teal-400 mb-2 tracking-tighter font-gaming drop-shadow-[0_0_20px_rgba(45,212,191,0.6)]">THE BATTLE</h1>
                                        <h2 className="text-4xl font-bold text-amber-500 mb-8 tracking-widest font-gaming uppercase">Of Dinosaurs</h2>
                                        <button onClick={startGame} className="bg-teal-600 hover:bg-teal-500 text-white font-black px-12 py-5 rounded-full text-2xl shadow-2xl transition-all hover:scale-110 active:scale-95 border-b-4 border-teal-800">LAUNCH SIMULATOR</button>
                                    </div>
                                )}

                                {(gameState === GameState.BATTLE || gameState === GameState.RESULT) && fighters && (
                                    <div className="space-y-8">
                                        {!playerChoice && (
                                            <div className="flex flex-col items-center animate-bounce mb-4">
                                                <div className="text-teal-400 font-gaming text-xs tracking-[0.4em] mb-2 uppercase opacity-70">Detecting Potential Victor</div>
                                                <div className="text-7xl font-black text-amber-500 bg-black/60 px-12 py-4 rounded-full border-2 border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.3)] font-gaming">VS</div>
                                            </div>
                                        )}

                                        {isSimulating && (
                                            <div className="max-w-xl mx-auto">
                                                <BattleConsole logs={battleResult?.simulationLogs || ["PREPARING COMBAT..."]} onComplete={finalizeBattle} />
                                            </div>
                                        )}

                                        {gameState === GameState.RESULT && battleResult && (
                                            <div className="bg-gray-900/90 p-8 rounded-[2.5rem] border-2 border-teal-500/50 animate-tada text-center shadow-[0_0_120px_rgba(20,184,166,0.3)] relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent"></div>
                                                <h3 className="text-teal-500 font-gaming text-xs tracking-widest mb-4">SIMULATION COMPLETE</h3>
                                                <h2 className="text-7xl font-black text-white mb-4 font-gaming leading-tight uppercase">{battleResult.winner.common}</h2>
                                                <div className="bg-black/40 p-6 rounded-2xl mb-8 border border-white/5 backdrop-blur-sm">
                                                    <p className="text-teal-100 text-2xl italic font-medium leading-relaxed">"{battleResult.commentary}"</p>
                                                </div>
                                                <button onClick={startGame} className="bg-white text-black font-black px-16 py-5 rounded-full hover:bg-teal-400 transition-all hover:scale-105 shadow-2xl uppercase tracking-tighter">NEXT MATCHUP</button>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <DinosaurCard
                                                dinosaur={fighters[0]}
                                                image={images[0]}
                                                onSelect={!playerChoice ? handleSelectDinosaur : undefined}
                                                showDetails={gameState === GameState.RESULT}
                                                isWinner={battleResult?.winner.common === fighters[0].common}
                                                isLoser={battleResult && battleResult.winner.common !== fighters[0].common}
                                            />
                                            <DinosaurCard
                                                dinosaur={fighters[1]}
                                                image={images[1]}
                                                onSelect={!playerChoice ? handleSelectDinosaur : undefined}
                                                showDetails={gameState === GameState.RESULT}
                                                isWinner={battleResult?.winner.common === fighters[1].common}
                                                isLoser={battleResult && battleResult.winner.common !== fighters[1].common}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {currentView === 'pricing' && <Pricing onUpgrade={() => setUser(prev => prev ? {...prev, isPremium: true} : null)} isPremium={user?.isPremium || false} />}
                        {currentView === 'education' && <Education isPremium={user?.isPremium || false} onUpgrade={() => setCurrentView('pricing')} />}
                    </main>
                </>
             )}
             <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
        </div>
    );
};

export default App;