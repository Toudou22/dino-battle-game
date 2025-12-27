import { GoogleGenAI } from "@google/genai";
import type { Dinosaur } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const NEGATIVE_PROMPT = "Negative: letterbox, black bars, cinematic bars, white borders, cropping, skeletons, bones, fossils, museum, flowers, text, blurry, distorted, low quality, cartoon, 3d render.";

export const generateDinosaurImage = async (prompt: string, environment?: string): Promise<string> => {
  const envText = environment ? ` in a ${environment}` : '';
  const cleanPrompt = `${prompt}${envText}. Cinematic 16:9 photorealistic nature documentary shot. No black bars. Full frame. High definition details. ${NEGATIVE_PROMPT}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: cleanPrompt }] },
      config: {
        // @ts-ignore
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
    console.warn("Flash-Image failed, using fallback.", error);
    return `https://images.unsplash.com/photo-1517926368263-5185831d3341?auto=format&fit=crop&q=80&w=1280&h=720`;
  }
};

export const generateBattleCommentary = async (winner: Dinosaur, loser: Dinosaur, environment: string): Promise<string> => {
  try {
    const prompt = `Act as an epic prehistoric battle narrator for the game "THE BATTLE OF DINOSAURS".
    WINNER: ${winner.common} (${winner.size}m)
    LOSER: ${loser.common} (${loser.size}m)
    ENVIRONMENT: ${environment}
    
    TASK: Write a 1-sentence legendary combat summary (max 20 words). Describe the definitive moment of victory using the environment. Make it sound like a high-budget nature documentary.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text?.trim() || `The ${winner.common} reigns supreme in the ${environment}.`;
  } catch (error) {
    return `The ${winner.common} asserts absolute dominance over the ${loser.common} in the ${environment}.`;
  }
};