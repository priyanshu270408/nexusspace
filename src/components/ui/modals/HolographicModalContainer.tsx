import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft } from 'lucide-react';
import { useMission } from '../../../context/MissionContext';
import { sounds } from '../../../utils/soundEngine';

interface Props {
  children: React.ReactNode;
}

export const HolographicModalContainer: React.FC<Props> = ({ children }) => {
  const { activeDestination, returnToOrbit } = useMission();

  if (!activeDestination) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6 md:p-8 pointer-events-none">
        {/* Subtle dark backdrop click-off */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => returnToOrbit()}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        />

        {/* Hologram Card Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-4xl max-h-[85vh] rounded-2xl glass-panel border border-[#00f3ff]/40 shadow-[0_0_60px_rgba(0,243,255,0.2)] flex flex-col pointer-events-auto overflow-hidden animate-hologram"
          style={{
            borderColor: `${activeDestination.color}80`,
            boxShadow: `0 0 50px ${activeDestination.color}30`,
          }}
        >
          {/* Scanline pattern */}
          <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

          {/* Sci-Fi Decorative Corner Accents */}
          <div
            className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2"
            style={{ borderColor: activeDestination.color }}
          />
          <div
            className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2"
            style={{ borderColor: activeDestination.color }}
          />
          <div
            className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2"
            style={{ borderColor: activeDestination.color }}
          />
          <div
            className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2"
            style={{ borderColor: activeDestination.color }}
          />

          {/* MODAL HEADER */}
          <div
            className="relative px-6 py-4 border-b flex items-center justify-between bg-black/40 backdrop-blur-md"
            style={{ borderColor: `${activeDestination.color}30` }}
          >
            <div className="flex items-center gap-3">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: activeDestination.color }}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-orbitron font-bold text-white tracking-widest uppercase m-0">
                    {activeDestination.name}
                  </h2>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded border uppercase"
                    style={{
                      borderColor: `${activeDestination.color}60`,
                      color: activeDestination.color,
                      backgroundColor: `${activeDestination.color}15`,
                    }}
                  >
                    {activeDestination.category}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-400 m-0 tracking-wider">
                  {activeDestination.callsign} // {activeDestination.sector}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => returnToOrbit()}
                onMouseEnter={() => sounds.playHover()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded glass-panel-subtle text-xs font-mono text-slate-300 hover:text-white hover:border-[#00f3ff]/50 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ORBIT [ESC]</span>
              </button>

              <button
                onClick={() => returnToOrbit()}
                aria-label="Close Modal"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* MODAL SCROLLABLE CONTENT BODY */}
          <div className="relative p-5 sm:p-8 overflow-y-auto flex-1 text-slate-200">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
