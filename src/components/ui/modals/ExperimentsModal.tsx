import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Sliders } from 'lucide-react';
import { EXPERIMENTS_DATA } from '../../../data/spaceData';
import { sounds } from '../../../utils/soundEngine';

export const ExperimentsModal: React.FC = () => {
  const [selectedExp, setSelectedExp] = useState(EXPERIMENTS_DATA[0]);
  const [waveSpeed, setWaveSpeed] = useState(1.5);
  const [particleDensity, setParticleDensity] = useState(60);
  const [colorMode, setColorMode] = useState<'PURPLE' | 'CYAN' | 'MAGENTA'>('PURPLE');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Live procedural 2D/3D generative canvas simulator for the experiment sandbox!
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02 * waveSpeed;
      ctx.fillStyle = '#05020a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      // Draw generative particle ripples based on selected experiment
      const count = particleDensity;
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + t * 0.5;
        const dist = 40 + Math.sin(t * 2 + i * 0.3) * 35 + (i % 3) * 20;

        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;

        const size = 1.5 + Math.sin(t + i) * 1.5;

        let col = '#d946ef';
        if (colorMode === 'CYAN') col = '#00f3ff';
        if (colorMode === 'MAGENTA') col = '#f43f5e';

        ctx.fillStyle = col;
        ctx.shadowColor = col;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.5, size), 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby nodes
        if (i % 4 === 0) {
          ctx.strokeStyle = `${col}33`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x, y);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [waveSpeed, particleDensity, colorMode, selectedExp]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-purple-900/40">
        <div>
          <h3 className="text-xl font-orbitron font-bold text-white tracking-wide m-0">
            KEPLER-186F // EXPERIMENTAL LAB
          </h3>
          <p className="text-xs font-mono text-purple-300/80 m-0">
            Higher-dimensional math, generative GLSL shaders, and complex emergence models
          </p>
        </div>
        <div className="px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>PROTOTYPE ENGINE ACTIVE</span>
        </div>
      </div>

      {/* Interactive Live Sandbox Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 rounded-xl glass-panel-subtle border border-purple-500/30">
        {/* Left: Generative Canvas Sandbox */}
        <div className="lg:col-span-2 relative flex flex-col items-center justify-center bg-black/60 rounded-lg p-2 border border-purple-500/20 overflow-hidden min-h-[260px]">
          <canvas
            ref={canvasRef}
            width={520}
            height={260}
            className="w-full h-full max-h-[260px] object-cover rounded"
          />

          <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded bg-black/70 border border-purple-500/40 text-[10px] font-mono text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
            <span>REALTIME SANDBOX: {selectedExp.title}</span>
          </div>

          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-400">
            60 FPS GPU-SYNCED
          </div>
        </div>

        {/* Right: Interactive Sandbox Controls */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-orbitron font-bold text-purple-300">
              <Sliders className="w-3.5 h-3.5" />
              <span>LIVE PARAMETERS</span>
            </div>

            {/* Wave Speed Slider */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                <span>Phase Frequency:</span>
                <span className="text-purple-400">{waveSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="4"
                step="0.1"
                value={waveSpeed}
                onChange={(e) => setWaveSpeed(parseFloat(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>

            {/* Particle Density Slider */}
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-300 mb-1">
                <span>Entity Density:</span>
                <span className="text-purple-400">{particleDensity}</span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="5"
                value={particleDensity}
                onChange={(e) => setParticleDensity(parseInt(e.target.value, 10))}
                className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded"
              />
            </div>

            {/* Harmonic Palette */}
            <div>
              <div className="text-[11px] font-mono text-slate-300 mb-1.5">Harmonic Resonance:</div>
              <div className="flex items-center gap-2">
                {(['PURPLE', 'CYAN', 'MAGENTA'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => {
                      sounds.playHover();
                      setColorMode(mode);
                    }}
                    className={`flex-1 py-1 text-[10px] font-mono rounded border transition cursor-pointer ${
                      colorMode === mode
                        ? 'border-purple-400 bg-purple-500/20 text-white font-bold'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-400 border-t border-purple-900/40 pt-2">
            Click any experiment below to inspect theoretical schematics.
          </div>
        </div>
      </div>

      {/* Experiment Cards Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {EXPERIMENTS_DATA.map((exp) => (
          <div
            key={exp.id}
            onClick={() => {
              sounds.playClick();
              setSelectedExp(exp);
            }}
            className={`p-4 rounded-xl glass-panel-subtle border transition-all cursor-pointer ${
              selectedExp.id === exp.id
                ? 'border-purple-500 bg-purple-950/20 shadow-[0_0_20px_rgba(217,70,239,0.3)]'
                : 'border-slate-800/80 hover:border-purple-500/50'
            }`}
          >
            <div className="flex items-center justify-between text-[11px] font-mono text-purple-400 mb-1">
              <span>{exp.type}</span>
              <span className="text-slate-500">{exp.id.toUpperCase()}</span>
            </div>
            <h4 className="text-sm font-orbitron font-bold text-white mb-2">
              {exp.title}
            </h4>
            <p className="text-xs font-space text-slate-300 mb-3 leading-relaxed">
              {exp.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {exp.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-purple-900/30 border border-purple-700/40 text-[10px] font-mono text-purple-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
