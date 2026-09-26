import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Eye, EyeOff, Radio, Orbit, Crosshair, ArrowLeft } from 'lucide-react';
import { useMission } from '../../context/MissionContext';
import { sounds } from '../../utils/soundEngine';

export const HUDOverlay: React.FC = () => {
  const {
    phase,
    activeDestination,
    hoveredDestination,
    selectDestination,
    returnToOrbit,
    soundEnabled,
    toggleSound,
    reducedMotion,
    toggleReducedMotion,
  } = useMission();

  const [utcTime, setUtcTime] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 47.82, long: 91.42 });

  // Update live UTC clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subtle coordinate jitter for realism
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeDestination) {
        // Parse from active destination
        return;
      }
      setCoordinates((prev) => ({
        lat: Number((prev.lat + (Math.random() - 0.5) * 0.04).toFixed(2)),
        long: Number((prev.long + (Math.random() - 0.5) * 0.04).toFixed(2)),
      }));
    }, 800);
    return () => clearInterval(interval);
  }, [activeDestination]);

  if (phase === 'BOOT' || phase === 'INTRO') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
      {/* Sci-Fi HUD Corner Brackets */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#00f3ff]/60" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#00f3ff]/60" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#00f3ff]/60" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#00f3ff]/60" />

      {/* TOP BAR */}
      <div className="flex items-start justify-between w-full">
        {/* Top-Left: Network & Telemetry */}
        <div className="pointer-events-auto flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-ping" />
            <h1 className="text-xs sm:text-sm font-orbitron font-bold tracking-widest text-[#00f3ff] glow-text-cyan uppercase m-0">
              NEXUS // DEEP SPACE NETWORK
            </h1>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="text-slate-300">{utcTime}</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1 text-[#06d6a0]">
              <Radio className="w-3 h-3" /> PING: 14ms
            </span>
          </div>
        </div>

        {/* Top-Right: Status, Audio & Accessibility */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
          {/* Mission Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded glass-panel border border-[#00f3ff]/30 text-[11px] font-mono tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f3ff] animate-pulse" />
            <span className="text-slate-300">MISSION:</span>
            <span className="text-[#00f3ff] font-semibold">ACTIVE</span>
          </div>

          {/* Sound Toggle with Visual Equalizer */}
          <button
            onClick={() => {
              sounds.playClick();
              toggleSound();
            }}
            title={soundEnabled ? 'Mute Audio (M)' : 'Enable Audio (M)'}
            aria-label="Toggle Audio"
            className="flex items-center gap-2 px-3 py-1.5 rounded glass-panel border border-slate-700 hover:border-[#00f3ff]/50 text-xs font-mono text-slate-200 transition cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#00f3ff]" />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 h-3 bg-[#00f3ff] animate-pulse" />
                  <span className="w-0.5 h-2 bg-[#00f3ff] animate-pulse delay-75" />
                  <span className="w-0.5 h-2.5 bg-[#00f3ff] animate-pulse delay-150" />
                </div>
                <span className="hidden md:inline text-[10px]">SOUND ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline text-[10px] text-slate-400">MUTED</span>
              </>
            )}
          </button>

          {/* Reduced-Motion / FX Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              toggleReducedMotion();
            }}
            title={reducedMotion ? 'Enable Full 3D Camera FX' : 'Enable Reduced Motion'}
            aria-label="Toggle Reduced Motion"
            className="p-1.5 rounded glass-panel border border-slate-700 hover:border-[#00f3ff]/50 text-slate-300 transition cursor-pointer"
          >
            {reducedMotion ? (
              <EyeOff className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Eye className="w-3.5 h-3.5 text-[#00f3ff]" />
            )}
          </button>
        </div>
      </div>

      {/* CENTER HOVER TARGET LOCK OVERLAY */}
      <div className="flex-1 flex items-center justify-center pointer-events-none">
        <AnimatePresence>
          {hoveredDestination && !activeDestination && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto cursor-pointer p-4 rounded-lg glass-panel border border-[#00f3ff]/60 shadow-[0_0_35px_rgba(0,243,255,0.3)] max-w-sm text-center flex flex-col items-center gap-2 backdrop-blur-md"
              onClick={() => selectDestination(hoveredDestination)}
            >
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#00f3ff]">
                <Crosshair className="w-4 h-4 text-[#ff0055] animate-spin" style={{ animationDuration: '4s' }} />
                <span>TARGET ACQUIRED: {hoveredDestination.callsign}</span>
              </div>
              <h2 className="text-xl font-orbitron font-bold text-white m-0 tracking-wider">
                {hoveredDestination.name}
              </h2>
              <p className="text-xs text-slate-300 font-space line-clamp-2 m-0">
                {hoveredDestination.tagline}
              </p>
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-[#00f3ff]/20 hover:bg-[#00f3ff]/30 text-[#00f3ff] border border-[#00f3ff]/50 rounded text-xs font-mono font-bold tracking-widest transition">
                <span>[ ENGAGE & ENTER SECTOR ]</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RETURN TO ORBIT BUTTON (when inspecting any destination) */}
      <AnimatePresence>
        {activeDestination && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-6 pointer-events-auto"
          >
            <button
              onClick={() => returnToOrbit()}
              onMouseEnter={() => sounds.playHover()}
              className="flex items-center gap-2.5 px-4 py-2 rounded-md glass-panel border border-[#00f3ff]/50 text-xs font-orbitron font-bold text-[#00f3ff] hover:bg-[#00f3ff]/20 shadow-[0_0_20px_rgba(0,243,255,0.35)] transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO ORBIT</span>
              <span className="text-[10px] font-mono text-slate-400 font-normal">[ESC]</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM BAR */}
      <div className="flex items-end justify-between w-full pt-4">
        {/* Bottom-Left: Sector Info */}
        <div className="flex flex-col gap-1 text-[11px] font-mono">
          <div className="flex items-center gap-2 text-[#00f3ff]">
            <Orbit className="w-3.5 h-3.5" />
            <span className="tracking-widest uppercase">
              SECTOR: {activeDestination ? activeDestination.sector : hoveredDestination ? hoveredDestination.sector : 'UNKNOWN // ORBITAL CRUISE'}
            </span>
          </div>
          <span className="text-slate-400 hidden sm:inline">
            SYSTEM TELEMETRY: {activeDestination ? activeDestination.category.toUpperCase() : 'SURVEYING CELESTIAL BODIES'}
          </span>
        </div>

        {/* Bottom-Right: Coordinates & Warp Velocity */}
        <div className="flex flex-col items-end gap-1 text-[11px] font-mono text-slate-400">
          <div className="text-slate-200">
            <span className="text-slate-400">COORDINATES: </span>
            <span className="text-[#00f3ff] font-semibold">
              {activeDestination ? activeDestination.coordinates : `${coordinates.lat} N / ${coordinates.long} E`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span>VELOCITY:</span>
            <span className="text-[#06d6a0] font-bold">
              {activeDestination ? 'STATIONARY ORBIT' : '0.24c SUB-LIGHT'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
