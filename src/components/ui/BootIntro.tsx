import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Compass, Shield, Terminal, Volume2, VolumeX } from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { sounds } from '../../utils/soundEngine';

export const BootIntro: React.FC = () => {
  const { phase, bootComplete, startMission, soundEnabled, toggleSound } = useMission();
  const [progress, setProgress] = useState(0);
  const [bootLogIndex, setBootLogIndex] = useState(0);

  const bootLogs = [
    'SYSTEM INITIALIZING...',
    'CONNECTING TO NEXUS NETWORK...',
    'CALIBRATING NAVIGATION SYSTEM...',
    'MISSION STATUS: READY',
  ];

  // Boot sequence counter 0-100%
  useEffect(() => {
    if (phase !== 'BOOT') return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            bootComplete();
          }, 400);
          return 100;
        }
        const increment = Math.floor(Math.random() * 8) + 3;
        const next = Math.min(100, prev + increment);

        // Update log index as percentage advances
        if (next >= 85) setBootLogIndex(3);
        else if (next >= 55) setBootLogIndex(2);
        else if (next >= 25) setBootLogIndex(1);

        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [phase, bootComplete]);

  if (phase === 'EXPLORING' || phase === 'INSPECTING') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-auto bg-[#02040a]/90 backdrop-blur-sm">
      {/* Scanline pattern */}
      <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

      <AnimatePresence mode="wait">
        {phase === 'BOOT' ? (
          /* Boot sequence terminal */
          <motion.div
            key="boot"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md p-6 mx-4 glass-panel rounded-lg border border-[#00f3ff]/30 shadow-[0_0_50px_rgba(0,243,255,0.15)] font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#00f3ff]/20 text-[#00f3ff]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 animate-pulse" />
                <span className="tracking-widest font-semibold">NEXUS BOOT LOADER v4.8</span>
              </div>
              <span className="text-[10px] text-slate-400">SEC-OK</span>
            </div>

            {/* Terminal log messages */}
            <div className="my-6 space-y-2 text-slate-300">
              {bootLogs.slice(0, bootLogIndex + 1).map((log, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[#00f3ff]">&gt;</span>
                  <span className={i === bootLogIndex ? 'text-[#00f3ff] font-semibold' : 'text-slate-400'}>
                    {log}
                  </span>
                  {i === bootLogIndex && <span className="inline-block w-1.5 h-3 bg-[#00f3ff] animate-pulse" />}
                </div>
              ))}
            </div>

            {/* Progress Bar & Percentage */}
            <div className="space-y-2">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>BUFFERING QUANTUM STATE</span>
                <span className="text-[#00f3ff] font-bold">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-[#00f3ff] via-[#9d4edd] to-[#ff0055] transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          /* Intro Hero Screen with [ENTER MISSION] */
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4 max-w-2xl"
          >
            {/* Mission Network Tag */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border border-[#00f3ff]/40 text-[#00f3ff] text-xs font-mono tracking-widest mb-6"
            >
              <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
              <span>DEEP SPACE NETWORK ONLINE</span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-6xl sm:text-8xl font-orbitron font-extrabold tracking-wider bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 drop-shadow-[0_0_35px_rgba(0,243,255,0.4)] m-0 mb-2"
            >
              NEXUS
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-2xl font-orbitron tracking-[0.35em] text-[#00f3ff] font-semibold m-0 mb-4 glow-text-cyan uppercase"
            >
              BEYOND THE KNOWN
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm sm:text-base text-slate-300 max-w-md mx-auto mb-10 font-space"
            >
              An interactive journey through the digital universe. Navigate planetary systems, space stations, and deep-space telemetry.
            </motion.p>

            {/* Audio Toggle hint & Enter Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => {
                  sounds.playClick();
                  startMission();
                }}
                onMouseEnter={() => sounds.playHover()}
                className="group relative px-8 py-3.5 rounded-md font-orbitron font-bold tracking-widest text-sm text-[#02040a] bg-gradient-to-r from-[#00f3ff] to-[#38bdf8] hover:to-[#a855f7] shadow-[0_0_30px_rgba(0,243,255,0.6)] hover:shadow-[0_0_45px_rgba(168,85,247,0.8)] transition-all duration-300 flex items-center gap-3 cursor-pointer"
              >
                <span>ENTER MISSION</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                <span className="absolute -inset-0.5 rounded-md bg-gradient-to-r from-[#00f3ff] to-[#a855f7] opacity-30 blur group-hover:opacity-75 transition" />
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  toggleSound();
                }}
                className="px-4 py-3 rounded-md glass-panel border border-slate-700 text-xs font-mono text-slate-300 hover:text-[#00f3ff] hover:border-[#00f3ff]/50 transition flex items-center gap-2 cursor-pointer"
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-[#00f3ff]" />
                    <span>AUDIO: ACTIVE</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-slate-400" />
                    <span>AUDIO: OFF (CLICK TO ENABLE)</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* Footer telemetry info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-12 flex items-center justify-center gap-6 text-[11px] font-mono text-slate-400"
            >
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#00f3ff]" /> 256-BIT ENCRYPTED
              </span>
              <span>•</span>
              <span>SECTOR GRID: ACTIVE</span>
              <span>•</span>
              <span>60 FPS CAPABLE</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
