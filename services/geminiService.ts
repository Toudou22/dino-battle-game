
import { GoogleGenAI, Modality } from "@google/genai";
import type { Dinosaur } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Strict Negative constraints to prevent modern objects, multiple subjects, and poor quality
// Specifically reinforced to prevent "Cinematic Letterboxing"
const NEGATIVE_PROMPT = "Negative constraints: NO letterbox, NO black bars, NO cinematic bars, NO widescreen bars, NO pillarbox, NO white borders, NO cropping, NO film strip, NO frames, NO black edges. NO electric wires, NO power lines, NO cables, NO utility poles, NO buildings, NO city, NO modern architecture, NO houses, NO ruins, NO walls, NO fences, NO concrete, NO roads, NO vehicles, NO cars, NO ships, NO boats, NO human presence, NO people. NO skeletons, NO bones, NO fossils, NO museum exhibits. NO flowers (unless prehistoric), NO text, NO watermarks, NO logos, NO brand names, NO copyright symbol, NO signature. NO split screen, NO multiple panels, NO blurry background, NO distortion.";

// Helper to extract the visual description of the dinosaur from its generation prompt
// excluding technical camera instructions and negative prompts.
const extractVisualDescription = (fullPrompt: string): string => {
    return fullPrompt
        .replace(/^Cinematic wide landscape shot of (a|an)\s+/i, '')
        .replace(/16:9 aspect ratio.*/i, '')
        .replace(/Negative:.*/i, '')
        .replace(/\${NEGATIVE_PROMPT_SUFFIX}/, '')
        .replace(/no black bars.*/i, '')
        .replace(/no cropping.*/i, '')
        .replace(/full frame.*/i, '')
        .trim();
};

const addCinematicLegend = async (base64Image: string, text: string): Promise<string> => {
  if (typeof window === 'undefined') return base64Image; // Guard for server-side rendering if applicable

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64Image);
        return;
      }

      // 1. Draw the original AI image
      ctx.drawImage(img, 0, 0);

      // --- Text Layout Logic ---
      const fullText = text.toUpperCase();
      const padding = canvas.width * 0.05;
      const maxWidth = canvas.width - (padding * 2);
      
      let isStacked = false;
      let line1 = "";
      let line2 = ""; // VS
      let line3 = "";
      
      // Calculate initial main font size
      let mainFontSize = Math.floor(canvas.width * 0.05);
      ctx.font = `900 ${mainFontSize}px "Inter", "Roboto", sans-serif`;
      const fullWidth = ctx.measureText(fullText).width;

      // Logic: If text is too wide...
      if (fullWidth > maxWidth) {
          // If it's a "VS" battle, we prefer stacking
          if (fullText.includes(" VS ")) {
               isStacked = true;
               const parts = fullText.split(" VS ");
               line1 = parts[0];
               line2 = "VS";
               line3 = parts[1];
          } else {
               // For single lines (e.g. Victorious), just scale down
               while (ctx.measureText(fullText).width > maxWidth && mainFontSize > 12) {
                   mainFontSize -= 2;
                   ctx.font = `900 ${mainFontSize}px "Inter", "Roboto", sans-serif`;
               }
          }
      }

      // 2. Add a cinematic gradient at the bottom (taller if stacked)
      const gradientHeight = isStacked ? canvas.height * 0.35 : canvas.height * 0.25;
      const gradient = ctx.createLinearGradient(0, canvas.height - gradientHeight, 0, canvas.height);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, 'rgba(0,0,0,0.8)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.95)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, canvas.height - gradientHeight, canvas.width, gradientHeight);

      // 3. Configure Shared Typography Settings
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 15;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      // 4. Draw Subtitle (Anchored at the bottom)
      const subFontSize = Math.floor(canvas.width * 0.025);
      const bottomMargin = Math.floor(canvas.width * 0.02); // Padding from bottom edge
      
      ctx.font = `500 ${subFontSize}px "Inter", sans-serif`;
      ctx.fillStyle = '#99f6e4'; // Teal-200
      ctx.fillText("BATTLE OF DINOSAURS", canvas.width / 2, canvas.height - bottomMargin);

      // 5. Draw Main Text (Above subtitle)
      const mainTextBottomMargin = bottomMargin + subFontSize + (canvas.height * 0.02);

      if (isStacked) {
          // Draw Stacked Text
          const maxNameWidth = canvas.width * 0.9;
          
          // -- Bottom Name (Line 3) --
          let name2Size = Math.floor(canvas.width * 0.06);
          ctx.font = `900 ${name2Size}px "Inter", "Roboto", sans-serif`;
          while (ctx.measureText(line3).width > maxNameWidth && name2Size > 12) {
              name2Size -= 1;
              ctx.font = `900 ${name2Size}px "Inter", "Roboto", sans-serif`;
          }
          ctx.fillStyle = '#fcd34d'; // Amber
          const name2Y = canvas.height - mainTextBottomMargin;
          ctx.fillText(line3, canvas.width / 2, name2Y);

          // -- VS (Line 2) --
          const vsSize = Math.floor(canvas.width * 0.03);
          ctx.font = `900 ${vsSize}px "Inter", "Roboto", sans-serif`;
          ctx.fillStyle = '#ffffff'; // White
          const vsY = name2Y - name2Size - (canvas.height * 0.005);
          ctx.fillText(line2, canvas.width / 2, vsY);

          // -- Top Name (Line 1) --
          let name1Size = Math.floor(canvas.width * 0.06);
          ctx.font = `900 ${name1Size}px "Inter", "Roboto", sans-serif`;
          while (ctx.measureText(line1).width > maxNameWidth && name1Size > 12) {
              name1Size -= 1;
              ctx.font = `900 ${name1Size}px "Inter", "Roboto", sans-serif`;
          }
          ctx.fillStyle = '#fcd34d'; // Amber
          const name1Y = vsY - vsSize - (canvas.height * 0.005);
          ctx.fillText(line1, canvas.width / 2, name1Y);

      } else {
          // Draw Single Line Text
          ctx.font = `900 ${mainFontSize}px "Inter", "Roboto", sans-serif`;
          ctx.fillStyle = '#fcd34d'; // Amber-300
          ctx.fillText(fullText, canvas.width / 2, canvas.height - mainTextBottomMargin);
      }

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    
    img.onerror = () => {
      console.warn("Failed to load image for text overlay");
      resolve(base64Image);
    };

    img.src = base64Image;
  });
};

export const generateDinosaurImage = async (prompt: string, environment?: string): Promise<string> => {
  const envText = environment ? ` in a ${environment}` : '';
  // Remove "pack", "herd", "flock" from the prompt to ensure single subject
  const cleanBase = prompt
    .replace(/^Cinematic wide landscape shot of (a|an) /i, '')
    .replace(/\b(pack|herd|flock|swarm|group)\b/gi, 'single specimen');
  
  const enhancedPrompt = `Cinematic wide landscape shot of A SINGLE SOLITARY ${cleanBase}${envText}. 
  Format: 16:9 wide-angle landscape shot, filling the entire frame completely from edge to edge. 
  MANDATORY: NO black bars at top or bottom. NO letterbox framing. 
  Style: High-end prehistoric nature documentary, 8k resolution, photorealistic CGI, highly detailed texture. 
  Content: Living, breathing animal with full skin/scales/feathers. Focus on a SINGLE dinosaur.
  Environment: Purely prehistoric nature. NO man-made objects.
  ${NEGATIVE_PROMPT}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: enhancedPrompt },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
          // @ts-ignore
          imageConfig: {
            aspectRatio: "16:9"
          }
      },
    });

    const part = response.candidates?.[0]?.content?.parts?.[0];
    if (part && part.inlineData) {
      const base64ImageBytes = part.inlineData.data;
      const mimeType = part.inlineData.mimeType || 'image/png';
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }
    throw new Error("No image generated from Flash-Image");

  } catch (error: any) {
    console.warn("Gemini Flash-Image generation failed, attempting fallback to Imagen model...", error);
    
    try {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: enhancedPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      }
      throw new Error("No image generated from Imagen");

    } catch (fallbackError) {
      console.error("All image generation attempts failed:", fallbackError);
      return "https://picsum.photos/1280/720?grayscale&blur=2"; 
    }
  }
};

export const generateBattlePoster = async (dino1: Dinosaur, dino2: Dinosaur, environment: string): Promise<string> => {
  // Ensure the environment implies prehistoric nature if the name is ambiguous
  const naturalEnv = environment.includes("City") || environment.includes("Base") ? "Prehistoric Wilderness" : environment;

  const d1Desc = extractVisualDescription(dino1.imagePrompt);
  const d2Desc = extractVisualDescription(dino2.imagePrompt);

  const prompt = `Epic cinematic battle poster. 16:9 wide aspect ratio. 
  FULL FRAME IMAGE: No black bars, no letterbox, no borders. The action fills the entire frame from edge to edge.
  COMBATANT A: ${d1Desc}. (Must look exactly like this description).
  COMBATANT B: ${d2Desc}. (Must look exactly like this description).
  ACTION: They are fighting face to face in a ${naturalEnv}.
  Dynamic angles, dramatic lighting, particle effects (dust, debris, or splash). High contrast. 
  Style: Movie Poster, Masterpiece, 8k resolution, incredibly detailed skin textures and lighting. 
  Content: Two living, breathing dinosaurs fighting. 
  NEGATIVE: Buildings, modern structures, wires, fences, human elements.
  ${NEGATIVE_PROMPT}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
        // @ts-ignore
        imageConfig: {
          aspectRatio: "16:9"
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        const mimeType = part.inlineData.mimeType || 'image/png';
        const rawImage = `data:${mimeType};base64,${base64EncodeString}`;
        
        // Overlay Legend
        return await addCinematicLegend(rawImage, `${dino1.common} VS ${dino2.common}`);
      }
    }
    throw new Error("No image data in response");

  } catch (error) {
    console.error("Poster generation failed:", error);
    return generateDinosaurImage(`${dino1.common} fighting ${dino2.common}`, environment);
  }
};

export const generateWinnerPoster = async (dino: Dinosaur, environment: string): Promise<string> => {
    const dDesc = extractVisualDescription(dino.imagePrompt);

    const prompt = `Epic victory poster. 16:9 wide aspect ratio.
    FULL FRAME IMAGE: No black bars, no letterbox, no borders. The subject fills the entire frame from edge to edge.
    Subject: ${dDesc}. (Must look exactly like this description).
    Pose: Standing triumphant in a ${environment}. Heroic pose, low angle shot looking up, cinematic lighting, god rays, majestic atmosphere. Center frame, Full body visible.
    Style: High-end movie character poster, 8k resolution, hyper-realistic. 
    Content: One living, breathing dinosaur in a winning stance. 
    ${NEGATIVE_PROMPT}`;
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { text: prompt },
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
          // @ts-ignore
          imageConfig: {
            aspectRatio: "16:9"
          }
        },
      });
  
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          const rawImage = `data:${mimeType};base64,${base64EncodeString}`;

          // Overlay Legend
          return await addCinematicLegend(rawImage, `${dino.common} VICTORIOUS`);
        }
      }
      throw new Error("No image data in response");
  
    } catch (error) {
      console.error("Winner poster generation failed:", error);
      return generateDinosaurImage(`${dino.common} triumphant`, environment);
    }
  };
