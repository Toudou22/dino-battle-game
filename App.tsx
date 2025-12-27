
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
import { DINOSAURS, ACHIEVEMENTS, ENVIRONMENTS, BASIC_ENVIRONMENTS } from './constants';
import { generateDinosaurImage } from './services/geminiService';
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

const calculateBattleResult = (dino1: Dinosaur, dino2: Dinosaur, environment: string): BattleResult => {
    let score1 = 0;
    let score2 = 0;
    const logs: string[] = ["INITIATING NEURAL LINK...", `BIOME DETECTED: ${environment.toUpperCase()}`];

    const massScore1 = Math.pow(dino1.size, 2.8) * 10; 
    const massScore2 = Math.pow(dino2.size, 2.8) * 10;
    logs.push(`CALCULATING MASS: ${dino1.common} (${dino1.size}m) VS ${dino2.common} (${dino2.size}m)`);

    const combatScore1 = Math.pow(dino1.attack, 2) * 15;
    const combatScore2 = Math.pow(dino2.attack, 2) * 15;
    logs.push(`COMBAT POWER READINGS: ${dino1.attack}/10 VS ${dino2.attack}/10`);

    const agilityScore1 = dino1.speed * 5;
    const agilityScore2 = dino2.speed * 5;

    const sizeRatio = dino1.size > dino2.size ? dino1.size / dino2.size : dino2.size / dino1.size;
    
    if (sizeRatio > 2.5) {
        logs.push("WARNING: MASSIVE SCALE MISMATCH DETECTED.");
        if (dino1.size > dino2.size) score1 += 50000; 
        else score2 += 50000;
    }

    score1 += massScore1 + combatScore1 + agilityScore1;
    score2 += massScore2 + combatScore2 + agilityScore2;

    const critChance1 = 0.05 + (dino1.attack / 50);
    const critChance2 = 0.05 + (dino2.attack / 50);
    const isCrit1 = Math.random() < critChance1;
    const isCrit2 = Math.random() < critChance2;

    if (isCrit1) { score1 *= 1.5; logs.push(`CRITICAL STRIKE: ${dino1.common} LANDED VITAL HIT!`); }
    if (isCrit2) { score2 *= 1.5; logs.push(`CRITICAL STRIKE: ${dino2.common} LANDED VITAL HIT!`); }

    if (environment.includes("Swamp") || environment.includes("River") || environment.includes("Ocean")) {
        if (dino1.element === 'Water') { score1 *= 1.2; logs.push(`AQUATIC BUFF: ${dino1.common} HAS TERRAIN ADVANTAGE.`); }
        if (dino2.element === 'Water') { score2 *= 1.2; logs.push(`AQUATIC BUFF: ${dino2.common} HAS TERRAIN ADVANTAGE.`); }
    }

    const winner = score1 >= score2 ? dino1 : dino2;
    const loser = score1 >= score2 ? dino2 : dino1;
    logs.push("SIMULATION STABILIZED.");
    logs.push(`VICTOR IDENTIFIED: ${winner.common.toUpperCase()}`);

    let commentary = `The ${winner.common} dominated the arena with superior stats.`;
    if (isCrit1 || isCrit2) commentary = `A legendary critical hit secured the victory for the ${winner.common}.`;
    if (sizeRatio > 2.0 && winner.size > loser.size) commentary = `Sheer colossal size was the deciding factor. The ${loser.common} had no chance against such mass.`;

    return { winner, commentary, simulationLogs: logs };
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
    const { playSound, isMuted, toggleMute } = useSound();
    const [battleEnvironment, setBattleEnvironment] = useState<string>('');

    const [userStats, setUserStats] = useState<UserStats>(() => {
        const defaultStats = { wins: 0, losses: 0, currentStreak: 0, highestStreak: 0, dinosDiscovered: [], recentMatches: [] };
        const saved = localStorage.getItem('dino_stats');
        return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
    });

    useEffect(() => { localStorage.setItem('dino_stats', JSON.stringify(userStats)); }, [userStats]);

    const handleLogin = (username: string, isThomas: boolean) => {
        setUser({ username, isPremium: isThomas || username.toLowerCase() === 'god', isGodMode: username.toLowerCase() === 'god' });
        setCurrentView('dashboard');
        if (isThomas) setTimeout(() => playSound('win'), 500);
    };

    const handleLogout = () => { 
        setUser(null); 
        setCurrentView('login'); 
        setGameState(GameState.START); 
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

        const env = (user.isPremium ? ENVIRONMENTS : BASIC_ENVIRONMENTS)[Math.floor(Math.random() * (user.isPremium ? ENVIRONMENTS.length : BASIC_ENVIRONMENTS.length))];
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

    const handleSelectDinosaur = (dino: Dinosaur) => {
        if (!fighters || battleResult) return;
        playSound('click');
        setPlayerChoice(dino);
        const result = calculateBattleResult(fighters[0], fighters[1], battleEnvironment);
        setBattleResult(result);
        setIsSimulating(true);
    };

    const finalizeBattle = () => {
        if (!battleResult || !fighters || !playerChoice) return;
        
        setIsSimulating(false);
        const isCorrect = playerChoice.common === battleResult.winner.common;
        const loser = battleResult.winner.common === fighters[0].common ? fighters[1] : fighters[0];

        setUserStats(prev => {
            const newStats = { ...prev };
            if (isCorrect) {
                newStats.wins++;
                newStats.currentStreak++;
                newStats.highestStreak = Math.max(newStats.highestStreak, newStats.currentStreak);
            } else {
                newStats.losses++;
                newStats.currentStreak = 0;
            }
            
            newStats.recentMatches = [{
                timestamp: Date.now(),
                winnerName: battleResult.winner.common,
                loserName: loser.common,
                isPlayerCorrect: isCorrect,
                environment: battleEnvironment
            }, ...newStats.recentMatches.slice(0, 19)];
            
            return newStats;
        });

        playSound(isCorrect ? 'win' : 'lose');
        playSound(battleResult.winner.soundKey as SoundKey);
        setGameState(GameState.RESULT);
    };

    return (
        <div className="flex min-h-screen bg-transparent">
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
                        onLogout={handleLogout} 
                        isOpen={isSidebarOpen} 
                        onClose={() => setIsSidebarOpen(false)} 
                    />
                    <main className="flex-1 flex flex-col relative overflow-y-auto h-screen">
                        {isLoading && <LoadingScreen />}
                        
                        {currentView === 'dashboard' && <Dashboard stats={userStats} user={user} onPlay={() => setCurrentView('game')} />}
                        
                        {currentView === 'game' && (
                            <div className="w-full max-w-6xl mx-auto p-6 pt-20">
                                {gameState === GameState.START && (
                                    <div className="h-full flex flex-col items-center justify-center py-20">
                                        <h1 className="text-7xl font-black text-teal-400 mb-8 tracking-tighter text-center">DINO BATTLE</h1>
                                        <button onClick={startGame} className="bg-teal-600 hover:bg-teal-500 text-white font-black px-12 py-5 rounded-full text-2xl shadow-2xl transition-transform hover:scale-110">START SIMULATION</button>
                                    </div>
                                )}
                                {(gameState === GameState.BATTLE || gameState === GameState.RESULT) && fighters && (
                                    <div className="space-y-8">
                                        {isSimulating && battleResult && (
                                            <div className="max-w-xl mx-auto">
                                                <BattleConsole logs={battleResult.simulationLogs} onComplete={finalizeBattle} />
                                            </div>
                                        )}
                                        
                                        {gameState === GameState.RESULT && battleResult && (
                                            <div className="bg-gray-900/80 p-8 rounded-2xl border border-teal-500/50 animate-tada text-center">
                                                <h2 className="text-5xl font-black text-white mb-2">{battleResult.winner.common} WINS!</h2>
                                                <p className="text-teal-400 italic mb-6 text-xl">"{battleResult.commentary}"</p>
                                                <button onClick={startGame} className="bg-white text-black font-black px-8 py-3 rounded-full hover:bg-teal-400 transition-colors">NEXT BATTLE</button>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <DinosaurCard
                                                dinosaur={fighters[0]}
                                                image={images[0]}
                                                onSelect={!battleResult ? handleSelectDinosaur : undefined}
                                                showDetails={gameState === GameState.RESULT}
                                                isWinner={battleResult?.winner.common === fighters[0].common}
                                            />
                                            <DinosaurCard
                                                dinosaur={fighters[1]}
                                                image={images[1]}
                                                onSelect={!battleResult ? handleSelectDinosaur : undefined}
                                                showDetails={gameState === GameState.RESULT}
                                                isWinner={battleResult?.winner.common === fighters[1].common}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {currentView === 'pricing' && <Pricing onUpgrade={() => setUser(prev => prev ? {...prev, isPremium: true} : null)} isPremium={user.isPremium} />}
                        {currentView === 'education' && <Education isPremium={user.isPremium} onUpgrade={() => setCurrentView('pricing')} />}
                    </main>
                </>
             )}
             <SoundToggle isMuted={isMuted} onToggle={toggleMute} />
        </div>
    );
};

export default App;
