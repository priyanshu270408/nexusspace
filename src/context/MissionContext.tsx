import React, { createContext, useContext, useState, useEffect } from 'react';
import { DESTINATIONS } from '../data/spaceData';
import type { Destination } from '../data/spaceData';
import { sounds } from '../utils/soundEngine';

export type MissionPhase = 'BOOT' | 'INTRO' | 'EXPLORING' | 'INSPECTING';
export type CameraMode = 'FREE_ORBIT' | 'CINEMATIC';

interface MissionContextType {
  phase: MissionPhase;
  activeDestination: Destination | null;
  hoveredDestination: Destination | null;
  isWarping: boolean;
  warpFactor: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  cameraMode: CameraMode;
  bootComplete: () => void;
  startMission: () => void;
  selectDestination: (dest: Destination | string | null) => void;
  returnToOrbit: () => void;
  setHoveredDestination: (dest: Destination | null) => void;
  toggleSound: () => void;
  toggleReducedMotion: () => void;
  setCameraMode: (mode: CameraMode) => void;
}

const MissionContext = createContext<MissionContextType | undefined>(undefined);

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phase, setPhase] = useState<MissionPhase>('BOOT');
  const [activeDestination, setActiveDestination] = useState<Destination | null>(null);
  const [hoveredDestination, setHoveredDestinationState] = useState<Destination | null>(null);
  const [isWarping, setIsWarping] = useState<boolean>(false);
  const [warpFactor, setWarpFactor] = useState<number>(0);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<CameraMode>('FREE_ORBIT');

  // Detect system reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setReducedMotion(true);
    }
  }, []);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      // Escape key to return to orbit
      if (e.key === 'Escape') {
        if (activeDestination) {
          returnToOrbit();
        }
      }

      // M key toggles audio
      if (e.key.toLowerCase() === 'm') {
        toggleSound();
      }

      // Numeric keys 1 through 7 jump to destinations
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= DESTINATIONS.length && phase !== 'BOOT') {
        const target = DESTINATIONS[num - 1];
        if (target) {
          selectDestination(target);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDestination, phase]);

  const bootComplete = () => {
    setPhase('INTRO');
  };

  const startMission = () => {
    sounds.playWarp();
    setIsWarping(true);
    setWarpFactor(1);
    setPhase('EXPLORING');

    setTimeout(() => {
      setIsWarping(false);
      setWarpFactor(0);
    }, 1200);
  };

  const selectDestination = (destInput: Destination | string | null) => {
    let dest: Destination | null = null;
    if (typeof destInput === 'string') {
      dest = DESTINATIONS.find((d) => d.id === destInput) || null;
    } else {
      dest = destInput;
    }

    if (!dest) {
      returnToOrbit();
      return;
    }

    if (activeDestination?.id === dest.id) {
      return; // Already at destination
    }

    sounds.playClick();
    sounds.playWarp();

    setIsWarping(true);
    setWarpFactor(1);

    // After camera travel initiates, lock in destination and open UI panel
    setTimeout(() => {
      setActiveDestination(dest);
      setPhase('INSPECTING');
      setIsWarping(false);
      setWarpFactor(0);
    }, reducedMotion ? 200 : 900);
  };

  const returnToOrbit = () => {
    sounds.playClick();
    sounds.playChirp(700, 400, 0.15, 'triangle');
    setActiveDestination(null);
    setPhase('EXPLORING');
    setIsWarping(true);
    setWarpFactor(0.5);

    setTimeout(() => {
      setIsWarping(false);
      setWarpFactor(0);
    }, reducedMotion ? 150 : 800);
  };

  const setHoveredDestination = (dest: Destination | null) => {
    if (dest && dest.id !== hoveredDestination?.id) {
      sounds.playTargetLock();
    }
    setHoveredDestinationState(dest);
  };

  const toggleSound = () => {
    const isNowMuted = sounds.toggleMute();
    setSoundEnabled(!isNowMuted);
  };

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  return (
    <MissionContext.Provider
      value={{
        phase,
        activeDestination,
        hoveredDestination,
        isWarping,
        warpFactor,
        soundEnabled,
        reducedMotion,
        cameraMode,
        bootComplete,
        startMission,
        selectDestination,
        returnToOrbit,
        setHoveredDestination,
        toggleSound,
        toggleReducedMotion,
        setCameraMode,
      }}
    >
      {children}
    </MissionContext.Provider>
  );
};

export const useMission = () => {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
};
