import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Globe, Brain, Terminal, Shield, CheckCircle2 } from 'lucide-react';
import { SKILLS_DATA } from '../../../data/spaceData';
import { sounds } from '../../../utils/soundEngine';

type SkillCategory = 'programming' | 'webDevelopment' | 'aiAndData' | 'toolsAndDevOps';

export const SkillsModal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SkillCategory>('programming');

  const tabs: { key: SkillCategory; label: string; icon: React.ReactNode }[] = [
    { key: 'programming', label: 'PROGRAMMING', icon: <Code className="w-4 h-4" /> },
    { key: 'webDevelopment', label: 'WEB DEVELOPMENT', icon: <Globe className="w-4 h-4" /> },
    { key: 'aiAndData', label: 'AI & DATA', icon: <Brain className="w-4 h-4" /> },
    { key: 'toolsAndDevOps', label: 'TOOLS & DEVOPS', icon: <Terminal className="w-4 h-4" /> },
  ];

  const currentSkills = SKILLS_DATA[activeTab];

  return (
    <div className="space-y-6">
      {/* Station Subsystems Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-cyan-900/40">
        <div>
          <h3 className="text-xl font-orbitron font-bold text-white tracking-wide m-0">
            CITADEL-X // CORE CAPABILITIES
          </h3>
          <p className="text-xs font-mono text-cyan-300/80 m-0">
            Hardware & software proficiencies verified via orbital telemetry tests
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-[#00f3ff] text-xs font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>ALL SUBSYSTEMS GREEN</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              sounds.playClick();
              setActiveTab(tab.key);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-orbitron font-bold tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-[#00f3ff]/20 to-[#0284c7]/30 border border-[#00f3ff] text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.3)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Holographic Skill Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentSkills.map((skill, idx) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-4 rounded-xl glass-panel-subtle border border-slate-800 hover:border-[#00f3ff]/50 transition group"
          >
            {/* Header: Skill Name & Highlight */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00f3ff]" />
                <span className="font-orbitron font-bold text-sm text-white group-hover:text-[#00f3ff] transition-colors">
                  {skill.name}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-[#00f3ff]">
                {skill.highlight}
              </span>
            </div>

            {/* Experience tenure & Percentage Readout */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>EXP: {skill.experience}</span>
              <span className="text-[#00f3ff] font-bold">{skill.level}% POWER</span>
            </div>

            {/* Futuristic Segmented Holographic Gauge Bar */}
            <div className="h-2 w-full bg-slate-900 rounded overflow-hidden border border-slate-800 p-0.5 flex gap-1">
              {Array.from({ length: 10 }).map((_, barIdx) => {
                const filled = (barIdx + 1) * 10 <= skill.level;
                return (
                  <div
                    key={barIdx}
                    className={`h-full flex-1 rounded-sm transition-all duration-500 ${
                      filled
                        ? 'bg-gradient-to-r from-[#00f3ff] to-[#38bdf8] shadow-[0_0_8px_rgba(0,243,255,0.7)]'
                        : 'bg-slate-800/40'
                    }`}
                  />
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Subsystem Telemetry Footer */}
      <div className="p-4 rounded-xl glass-panel-subtle border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div>
          DIAGNOSTIC STATUS: <span className="text-[#06d6a0]">OPTIMAL FREQUENCY</span>
        </div>
        <div>
          FRAMEWORK RESILIENCE: <span className="text-[#00f3ff]">99.98% COMPILED</span>
        </div>
      </div>
    </div>
  );
};
