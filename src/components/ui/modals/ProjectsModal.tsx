import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Flame } from 'lucide-react';
import { PROJECTS_DATA } from '../../../data/spaceData';
import { sounds } from '../../../utils/soundEngine';

export const ProjectsModal: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'FEATURED' | 'GRAPHICS' | 'SYSTEMS'>('ALL');

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (filter === 'ALL') return true;
    if (filter === 'FEATURED') return p.featured;
    if (filter === 'GRAPHICS') return p.tech.some((t) => t.includes('WebGPU') || t.includes('Three.js'));
    if (filter === 'SYSTEMS') return p.tech.some((t) => t.includes('Rust') || t.includes('C++') || t.includes('Go'));
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header controls & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h3 className="text-xl font-orbitron font-bold text-white tracking-wide m-0">
            ARES FORGE // PROJECT ARCHIVE
          </h3>
          <p className="text-xs font-mono text-slate-400 m-0">
            Verified production platforms, graphics engines, and distributed nodes
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-slate-800 text-[11px] font-mono">
          {(['ALL', 'FEATURED', 'GRAPHICS', 'SYSTEMS'] as const).map((tag) => (
            <button
              key={tag}
              onClick={() => {
                sounds.playHover();
                setFilter(tag);
              }}
              className={`px-2.5 py-1 rounded transition cursor-pointer ${
                filter === tag
                  ? 'bg-[#ff5533] text-white font-bold shadow-[0_0_12px_rgba(255,85,51,0.5)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="group p-5 rounded-xl glass-panel-subtle border border-slate-800 hover:border-[#ff5533]/60 transition-all duration-300 flex flex-col justify-between hover:shadow-[0_0_25px_rgba(255,85,51,0.25)] relative overflow-hidden"
          >
            {/* Top Tag & Status */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ff5533]/15 text-[#ff5533] border border-[#ff5533]/40 tracking-wider">
                  {project.status}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  REF-{idx + 101}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h4 className="text-base font-orbitron font-bold text-white group-hover:text-[#ff5533] transition-colors m-0 mb-1">
                {project.name}
              </h4>
              <div className="text-xs font-mono text-[#ff9900] mb-3">
                {project.subtitle}
              </div>

              {/* Description */}
              <p className="text-xs font-space text-slate-300 leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Key Metric Telemetry */}
              <div className="px-3 py-1.5 rounded bg-black/50 border border-slate-800 text-[11px] font-mono text-slate-300 mb-4 flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-[#ff5533] shrink-0" />
                <span>{project.metrics}</span>
              </div>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-[10px] font-mono text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons: GitHub & Demo */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.playClick()}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-[#ff5533] to-[#ea580c] hover:brightness-110 text-white font-orbitron font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(255,85,51,0.4)] transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>LIVE DEMO</span>
              </a>

              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.playClick()}
                className="flex items-center gap-2 py-2 px-3 rounded-lg glass-panel border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white font-mono text-xs transition"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>CODE</span>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
