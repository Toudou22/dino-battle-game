import React from 'react';
import { SOUNDS } from '../constants/sounds';

type SoundKey = keyof typeof SOUNDS;

export const useSound = () => {
  const [isMuted, setIsMuted] = React.useState(false);

  const playSound = React.useCallback(
    (key: SoundKey) => {
      if (isMuted || !SOUNDS[key]) return;
      
      try {
        const audio = new Audio(SOUNDS[key]);
        audio.play().catch((e) => {
          // This warning is helpful for developers to diagnose autoplay issues.
          console.warn(`Audio playback for "${key}" was blocked. User interaction is required to enable sound.`, e);
        });
      } catch (e) {
        console.error(`Could not create or play sound for key: ${key}`, e);
      }
    },
    [isMuted]
  );

  const toggleMute = React.useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  return { playSound, isMuted, toggleMute };
};
