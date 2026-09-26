import React from 'react';
import { Globe, Flame, Sparkles, Building2, Disc, Radio, Terminal } from 'lucide-react';
import { DESTINATIONS } from '../../data/spaceData';
import type { Destination } from '../../data/spaceData';
import { useMission } from '../../context/MissionContext';
import { sounds } from '../../utils/soundEngine';

export const DestinationsDock: React.FC = () => {
  const { phase, activeDestination, selectDestination } = useMission();

  if (phase === 'BOOT' || phase === 'INTRO') return null;

  // Icon mapping for each destination
  const getIcon = (id: string) => {
    switch (id) {
      case 'earth':
        return <Globe className="w-3.5 h-3.5" />;
      case 'mars':
        return <Flame className="w-3.5 h-3.5" />;
      case 'alien':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'station':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'blackhole':
        return <Disc className="w-3.5 h-3.5" />;
      case 'satellite':
        return <Radio className="w-3.5 h-3.5" />;
      case 'missioncontrol':
        return <Terminal className="w-3.5 h-3.5" />;
      default:
        return <Globe className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-25 max-w-[95vw] pointer-events-auto">
      <div className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-xl glass-panel border border-[#00f3ff]/30 shadow-[0_4px_30px_rgba(0,0,0,0.8)] overflow-x-auto no-scrollbar">
        <div className="hidden lg:flex items-center px-2 py-1 border-r border-slate-700/60 text-[10px] font-mono tracking-widest text-[#00f3ff]">
          DESTINATIONS
        </div>

        {DESTINATIONS.map((dest: Destination, idx: number) => {
          const isActive = activeDestination?.id === dest.id;
          return (
            <button
              key={dest.id}
              onClick={() => {
                selectDestination(dest);
              }}
              onMouseEnter={() => sounds.playHover()}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-[#00f3ff]/20 to-[#9d4edd]/20 border border-[#00f3ff] text-white shadow-[0_0_15px_rgba(0,243,255,0.4)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span
                style={{ color: dest.color }}
                className={isActive ? 'animate-pulse' : ''}
              >
                {getIcon(dest.id)}
              </span>
              <span className="font-medium">{dest.name}</span>
              <span className="hidden md:inline-block text-[9px] px-1 py-0.2 rounded bg-black/40 text-slate-400 font-mono">
                {idx + 1}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
