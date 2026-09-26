import React from 'react';
import { User, Cpu, Sparkles, Target, Compass, Award } from 'lucide-react';
import { PROFILE_DATA } from '../../../data/spaceData';

export const AboutModal: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Top Banner / Callsign */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl glass-panel-subtle border border-[#00f3ff]/30">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00f3ff]/30 to-[#2563eb]/20 border border-[#00f3ff]/60 flex items-center justify-center text-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            <User className="w-7 h-7" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-[#00f3ff] tracking-widest uppercase">
              {PROFILE_DATA.callsign}
            </div>
            <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-white tracking-wide m-0">
              {PROFILE_DATA.name}
            </h3>
            <p className="text-xs sm:text-sm font-space text-slate-300 m-0">
              {PROFILE_DATA.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff]/40 text-[#00f3ff] text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-[#00f3ff] animate-ping" />
          <span>{PROFILE_DATA.status}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PROFILE_DATA.metrics.map((m, i) => (
          <div
            key={i}
            className="p-4 rounded-lg glass-panel-subtle border border-slate-700/60 hover:border-[#00f3ff]/50 transition text-center"
          >
            <div className="text-2xl sm:text-3xl font-orbitron font-extrabold text-[#00f3ff] glow-text-cyan">
              {m.value}
            </div>
            <div className="text-[11px] font-mono text-slate-400 mt-1 uppercase tracking-wider">
              {m.label}
            </div>
          </div>
        ))}
      </div>

      {/* Section: Who I Am & What I Build */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl glass-panel-subtle border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-orbitron font-bold text-[#00f3ff] tracking-wider">
            <Compass className="w-4 h-4" />
            <span>WHO I AM</span>
          </div>
          <p className="text-sm font-space text-slate-300 leading-relaxed">
            {PROFILE_DATA.bio}
          </p>
          <p className="text-xs font-mono text-slate-400 border-l-2 border-[#00f3ff] pl-3 py-1">
            "{PROFILE_DATA.whoIAm}"
          </p>
        </div>

        <div className="p-5 rounded-xl glass-panel-subtle border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-orbitron font-bold text-[#38bdf8] tracking-wider">
            <Cpu className="w-4 h-4" />
            <span>WHAT I BUILD</span>
          </div>
          <p className="text-sm font-space text-slate-300 leading-relaxed">
            {PROFILE_DATA.whatIBuild}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['WebGL 3D Engines', 'Distributed Systems', 'WebGPU Shaders', 'Autonomous AI', 'Reactive UI'].map((tag, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-slate-700 text-[10px] font-mono text-[#38bdf8]">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Section: Interests & Career Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl glass-panel-subtle border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-orbitron font-bold text-[#c084fc] tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>DEEP-TECH INTERESTS</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm font-space text-slate-300 p-0 m-0 list-none">
            {PROFILE_DATA.interests.map((interest, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c084fc]" />
                <span>{interest}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-xl glass-panel-subtle border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-orbitron font-bold text-[#06d6a0] tracking-wider">
            <Target className="w-4 h-4" />
            <span>CAREER GOALS & VISION</span>
          </div>
          <p className="text-sm font-space text-slate-300 leading-relaxed">
            {PROFILE_DATA.careerGoals}
          </p>
          <div className="p-3 rounded bg-black/40 border border-[#06d6a0]/30 text-xs font-mono text-[#06d6a0] flex items-center gap-2">
            <Award className="w-4 h-4 shrink-0" />
            <span>PRIORITY OBJECTIVE: Scale next-gen spatial platforms to 10M+ explorers.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
