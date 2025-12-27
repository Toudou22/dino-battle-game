import { GoogleGenAI, Modality } from "@google/genai";
import type { Dinosaur } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const NEGATIVE_PROMPT = "Negative constraints: NO letterbox, NO black bars, NO cinematic bars, NO widescreen bars, NO pillarbox, NO white borders, NO cropping, NO film strip, NO frames, NO black edges. NO electric wires, NO power lines, NO cables, NO utility poles, NO buildings, NO city, NO modern architecture, NO houses, NO ruins, NO walls, NO fences, NO concrete, NO roads, NO vehicles, NO cars, NO ships, NO boats, NO human presence, NO people. NO skeletons, NO bones, NO fossils, NO museum exhibits. NO flowers (unless prehistoric), NO text, NO watermarks, NO logos, NO brand names, NO copyright symbol, NO signature. NO split screen, NO multiple panels, NO blurry background, NO distortion.";

export const generateDinosaurImage = async (prompt: string, environment?: string): Promise<string> => {
  const envText = environment ? ` in a ${environment}` : '';
  const cleanBase = prompt
    .replace(/^Cinematic wide landscape shot of (a|an) /i, '')
    .replace(/\b(pack|herd|flock|swarm|group)\b/gi, 'single specimen');
  
  const enhancedPrompt = `Cinematic wide landscape shot of A SINGLE SOLITARY ${cleanBase}${envText}. 
  Format: 16:9 wide-angle landscape shot, filling the entire frame completely. 
  MANDATORY: NO black bars. NO letterboxing.
  Style: High-end prehistoric nature documentary. ${NEGATIVE_PROMPT}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: enhancedPrompt }] },
      config: {
          imageConfig: { aspectRatio: "16:9" }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated");
  } catch (error) {
    console.warn("Image generation failed, using fallback.", error);
    return "https://picsum.photos/1280/720?grayscale&blur=2"; 
  }
};

/**
 * Generates unique battle commentary using Gemini 3 Flash.
 */
export const generateBattleCommentary = async (winner: Dinosaur, loser: Dinosaur, environment: string): Promise<string> => {
  try {
    const prompt = `Act as an epic prehistoric battle narrator.
    WINNER: ${winner.common} (Size ${winner.size}m, Speed ${winner.speed}km/h, Attack ${winner.attack}/10)
    LOSER: ${loser.common} (Size ${loser.size}m, Speed ${loser.speed}km/h, Attack ${loser.attack}/10)
    ENVIRONMENT: ${environment}
    
    Task: Write a single, short, high-intensity sentence (max 25 words) describing the final blow or the deciding factor of this battle. Make it sound cinematic and legendary. Avoid cheesy cliches; make it feel like a real nature documentary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || `The ${winner.common} overcame the ${loser.common} through sheer brute force.`;
  } catch (error) {
    console.error("Commentary generation failed:", error);
    return `The ${winner.common} emerged victorious in the prehistoric arena.`;
  }
};