
import React, { useState, useEffect } from 'react';
import { DINOSAURS } from '../constants';
import { Dinosaur } from '../types';
import { generateDinosaurImage } from '../services/geminiService';

interface EducationProps {
    isPremium: boolean;
    onUpgrade: () => void;
}

export const Education: React.FC<EducationProps> = ({ isPremium, onUpgrade }) => {
    const [selectedDino, setSelectedDino] = useState<Dinosaur | null>(null);
    const [filter, setFilter] = useState<string>('All');
    const [dinoImages, setDinoImages] = useState<Record<string, string>>(() => {
        // Load cached images from local storage to save API calls
        const saved = localStorage.getItem('dino_pedia_images');
        return saved ? JSON.parse(saved) : {};
    });
    const [isGenerating, setIsGenerating] = useState(false);

    const categories = ['All', 'Earth', 'Water', 'Sky', 'Legendary'];

    const filteredDinos = DINOSAURS.filter(d => {
        if (filter === 'All') return true;
        if (filter === 'Legendary') return d.tier === 'legendary';
        return d.element === filter;
    }).sort((a, b) => a.common.localeCompare(b.common));

    // Save images to cache whenever they update
    useEffect(() => {
        try {
            localStorage.setItem('dino_pedia_images', JSON.stringify(dinoImages));
        } catch (e) {
            console.warn("Local storage full, cannot cache more images");
        }
    }, [dinoImages]);

    // Generate image when a dino is selected if we don't have it yet
    useEffect(() => {
        if (selectedDino && !dinoImages[selectedDino.common] && !isGenerating) {
            const fetchImage = async () => {
                setIsGenerating(true);
                try {
                    // Use a specific "Portrait" style prompt or reuse the existing robust one
                    const imageUrl = await generateDinosaurImage(selectedDino.imagePrompt, "neutral lighting");
                    setDinoImages(prev => ({ ...prev, [selectedDino.common]: imageUrl }));
                } catch (error) {
                    console.error("Failed to generate encyclopedia image", error);
                } finally {
                    setIsGenerating(false);
                }
            };
            fetchImage();
        }
    }, [selectedDino, dinoImages]);

    const handleDinoClick = (dino: Dinosaur) => {
        if (dino.tier === 'legendary' && !isPremium) {
            onUpgrade();
        } else {
            setSelectedDino(dino);
        }
    };

    return (
        <div className="max-w-6xl mx-auto w-full p-6 pt-24 md:pt-6 animate-fade-in h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <div>
                    <h2 className="text-4xl font-black text-white mb-2">Dino-Pedia Database</h2>
                    <p className="text-gray-400">Field notes and classified biological data.</p>
                </div>
                
                {/* Filter Tabs */}
                <div className="flex bg-gray-900/50 p-1 rounded-xl border border-white/10 mt-4 md:mt-0 overflow-x-auto max-w-full">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors whitespace-nowrap ${
                                filter === cat 
                                ? 'bg-teal-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
                {filteredDinos.map((dino) => {
                    const isLocked = dino.tier === 'legendary' && !isPremium;
                    const hasCachedImage = !!dinoImages[dino.common];

                    return (
                        <button
                            key={dino.common}
                            onClick={() => handleDinoClick(dino)}
                            className={`group relative bg-gray-900/40 border ${
                                isLocked 
                                ? 'border-yellow-500/30 hover:border-yellow-500' 
                                : 'border-white/10 hover:border-teal-500'
                            } p-4 rounded-xl text-left transition-all duration-200 hover:bg-gray-800/60 hover:-translate-y-1 overflow-hidden`}
                        >
                            <div className="flex justify-between items-start mb-2 relative z-10">
                                <div className="text-2xl">{dino.element === 'Water' ? '💧' : dino.element === 'Sky' ? '🌪️' : '🌿'}</div>
                                {isLocked && <div className="text-yellow-500 text-xs font-bold border border-yellow-500/50 px-2 py-1 rounded bg-yellow-900/20">CLASSIFIED</div>}
                                {dino.tier === 'legendary' && !isLocked && <div className="text-yellow-400 text-xl">⭐</div>}
                            </div>
                            
                            <h3 className={`text-lg font-bold relative z-10 ${isLocked ? 'text-gray-500' : 'text-white group-hover:text-teal-300'}`}>
                                {dino.common}
                            </h3>
                            <p className="text-xs text-gray-500 italic mb-3 relative z-10">{dino.scientific}</p>
                            
                            <div className="flex gap-2 mt-auto relative z-10">
                                <div className="bg-black/60 px-2 py-1 rounded text-xs text-gray-400 border border-white/5">
                                    📏 {dino.size}m
                                </div>
                                <div className="bg-black/60 px-2 py-1 rounded text-xs text-gray-400 border border-white/5">
                                    ⚔️ {dino.attack}
                                </div>
                                {hasCachedImage && (
                                    <div className="ml-auto text-teal-500 text-xs flex items-center gap-1">
                                        <span>📷</span> Data Loaded
                                    </div>
                                )}
                            </div>

                            {/* Subtle background glow if image is cached */}
                            {hasCachedImage && !isLocked && (
                                <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-cover bg-center" style={{ backgroundImage: `url(${dinoImages[dino.common]})` }}></div>
                            )}

                            {isLocked && (
                                <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center rounded-xl group-hover:backdrop-blur-none transition-all z-20">
                                    <span className="text-2xl drop-shadow-lg">🔒</span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Detail Modal */}
            {selectedDino && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setSelectedDino(null)}>
                    <div className="bg-gray-900 border border-teal-500/50 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        
                        {/* Image Header */}
                        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                            {dinoImages[selectedDino.common] ? (
                                <img 
                                    src={dinoImages[selectedDino.common]} 
                                    alt={selectedDino.common} 
                                    className="w-full h-full object-cover animate-fade-in"
                                />
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-teal-400 font-mono text-sm animate-pulse uppercase tracking-widest">
                                        Generating Visual Data...
                                    </p>
                                </div>
                            )}
                            
                            {/* Overlay Gradient for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

                            <button onClick={() => setSelectedDino(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center backdrop-blur-md transition-colors z-20">
                                ✕
                            </button>

                            <div className="absolute bottom-4 left-6 z-10">
                                <h2 className="text-4xl font-black text-white uppercase tracking-wide drop-shadow-lg">{selectedDino.common}</h2>
                                <p className="text-teal-300 italic font-serif text-lg drop-shadow-md">{selectedDino.scientific}</p>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 overflow-y-auto">
                            <div className="flex flex-wrap gap-2 mb-6">
                                <span className="px-3 py-1 rounded-full bg-teal-900/30 text-teal-300 text-xs font-bold border border-teal-500/20">
                                    Type: {selectedDino.element}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-blue-900/30 text-blue-300 text-xs font-bold border border-blue-500/20">
                                    Speed: {selectedDino.speed} km/h
                                </span>
                                <span className="px-3 py-1 rounded-full bg-purple-900/30 text-purple-300 text-xs font-bold border border-purple-500/20">
                                    Size: {selectedDino.size}m
                                </span>
                                {selectedDino.aliases && selectedDino.aliases.length > 0 && (
                                    <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-400 text-xs border border-gray-700">
                                        aka: {selectedDino.aliases.join(', ')}
                                    </span>
                                )}
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <h4 className="text-white font-bold uppercase text-sm tracking-widest mb-2 border-l-2 border-teal-500 pl-3">Description</h4>
                                <p className="text-gray-300 leading-relaxed mb-6">
                                    {selectedDino.detailed_info}
                                </p>

                                <h4 className="text-white font-bold uppercase text-sm tracking-widest mb-2 border-l-2 border-purple-500 pl-3">Combat Analysis</h4>
                                <div className="bg-black/30 rounded-lg p-4 mb-6">
                                    <div className="mb-2">
                                        <div className="flex justify-between text-xs mb-1 text-gray-400">
                                            <span>Attack Power</span>
                                            <span>{selectedDino.attack}/10</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500" style={{ width: `${selectedDino.attack * 10}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <div className="flex justify-between text-xs mb-1 text-gray-400">
                                            <span>Agility</span>
                                            <span>{selectedDino.speed > 60 ? 'High' : selectedDino.speed > 30 ? 'Medium' : 'Low'}</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-yellow-500" style={{ width: `${Math.min(selectedDino.speed, 80) / 0.8}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
