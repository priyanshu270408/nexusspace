import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, ShieldCheck, Scroll, Code2, Award, Zap, Sparkles } from 'lucide-react';
import { ACHIEVEMENTS_DATA } from '../../../data/spaceData';

export const AchievementsModal: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-[#f72585]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#4cc9f0]" />;
      case 'Scroll':
        return <Scroll className="w-5 h-5 text-[#7209b7]" />;
      case 'Code2':
        return <Code2 className="w-5 h-5 text-[#f72585]" />;
      case 'Award':
        return <Award className="w-5 h-5 text-[#4cc9f0]" />;
      default:
        return <Zap className="w-5 h-5 text-[#f72585]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Horizon Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-pink-900/40">
        <div>
          <h3 className="text-xl font-orbitron font-bold text-white tracking-wide m-0">
            SINGULARITY-X // EVENT HORIZON MILESTONES
          </h3>
          <p className="text-xs font-mono text-pink-300/80 m-0">
            High-gravity technical achievements, competitive accolades, and verified credentials
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#f72585]/15 border border-[#f72585]/40 text-[#f72585] text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SINGULARITY VALIDATED</span>
        </div>
      </div>

      {/* Achievements Timeline */}
      <div className="space-y-4">
        {ACHIEVEMENTS_DATA.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="p-5 rounded-xl glass-panel-subtle border border-slate-800 hover:border-[#f72585]/60 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:shadow-[0_0_25px_rgba(247,37,133,0.25)]"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-black/60 border border-slate-800 group-hover:border-[#f72585]/50 transition shrink-0">
                {getIcon(item.icon)}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono text-pink-400 font-bold">
                    [{item.year}]
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    // {item.organization}
                  </span>
                </div>

                <h4 className="text-base font-orbitron font-bold text-white group-hover:text-[#f72585] transition-colors m-0 mb-1">
                  {item.title}
                </h4>

                <p className="text-xs font-space text-slate-300 m-0 leading-relaxed max-w-xl">
                  {item.description}
                </p>
              </div>
            </div>

            {/* Badge */}
            <div className="shrink-0 self-end sm:self-center">
              <span className="px-3 py-1 rounded-full bg-[#f72585]/10 border border-[#f72585]/40 text-[10px] font-mono font-bold text-[#f72585] tracking-widest uppercase">
                {item.badge}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Verification footer */}
      <div className="p-4 rounded-xl glass-panel-subtle border border-pink-900/30 text-xs font-mono text-slate-400 flex items-center justify-between">
        <span>SECURITY PROOF: SHA-256 SIGNATURE VALIDATED</span>
        <span className="text-[#f72585]">IMMUTABLE RECORD</span>
      </div>
    </div>
  );
};
