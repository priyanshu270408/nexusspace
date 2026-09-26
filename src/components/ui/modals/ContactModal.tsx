import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mail, MessageSquare, Radio, CheckCircle, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../../../utils/soundEngine';

export const ContactModal: React.FC = () => {
  const [formData, setFormData] = useState({
    callsign: '',
    frequency: '',
    message: '',
  });

  const [isTransmitting, setIsTransmitting] = useState(false);
  const [transmitted, setTransmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.callsign || !formData.frequency || !formData.message) return;

    sounds.playWarp();
    setIsTransmitting(true);

    setTimeout(() => {
      setIsTransmitting(false);
      setTransmitted(true);
      sounds.playTransmissionSuccess();

      // Cosmic cyber confetti burst!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06d6a0', '#00f3ff', '#9d4edd'],
      });
    }, 1200);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('commander@nexus-orbit.dev');
    sounds.playClick();
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Comms Relay Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-emerald-900/40">
        <div>
          <h3 className="text-xl font-orbitron font-bold text-white tracking-wide m-0">
            RELAY-9 // DEEP SPACE TRANSMITTER
          </h3>
          <p className="text-xs font-mono text-emerald-300/80 m-0">
            Encrypted quantum uplink channel for collaborations, inquiries, and contracts
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 rounded bg-[#06d6a0]/15 border border-[#06d6a0]/40 text-[#06d6a0] text-xs font-mono">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>UPLINK CARRIER LOCK: 100%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Left Column: Direct Communication Channels (2 cols) */}
        <div className="md:col-span-2 space-y-4">
          <div className="text-xs font-orbitron font-bold text-[#06d6a0] tracking-wider uppercase">
            DIRECT CARRIER CHANNELS
          </div>

          {/* Email Card with Copy button */}
          <div className="p-4 rounded-xl glass-panel-subtle border border-slate-800 hover:border-[#06d6a0]/50 transition flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-black/60 border border-slate-700 text-[#06d6a0]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-slate-400">FREQUENCY ID</div>
                <div className="text-xs font-mono text-white font-semibold">commander@nexus-orbit.dev</div>
              </div>
            </div>
            <button
              onClick={handleCopyEmail}
              className="p-2 rounded hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              title="Copy Frequency"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-[#06d6a0]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            {[
              {
                name: 'LinkedIn Relay',
                url: 'https://linkedin.com',
                handle: 'in/alex-vance-nexus',
                icon: (
                  <svg className="w-4 h-4 fill-[#00f3ff]" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                ),
              },
              {
                name: 'GitHub Repository',
                url: 'https://github.com',
                handle: 'github.com/nexus-core',
                icon: (
                  <svg className="w-4 h-4 fill-[#c084fc]" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                ),
              },
              {
                name: 'Discord / Matrix Beacon',
                url: 'https://discord.com',
                handle: '@nexus_operator',
                icon: <MessageSquare className="w-4 h-4 text-[#f72585]" />,
              },
            ].map((s, idx) => (
              <a
                key={idx}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => sounds.playClick()}
                className="p-3 rounded-lg glass-panel-subtle border border-slate-800 hover:border-slate-600 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-black/50 border border-slate-800">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-xs font-orbitron font-bold text-white group-hover:text-[#06d6a0] transition-colors">
                      {s.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {s.handle}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">
                  CONNECT &gt;
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Encrypted Transmission Form (3 cols) */}
        <div className="md:col-span-3 p-5 rounded-xl glass-panel-subtle border border-emerald-500/30 relative">
          <AnimatePresence mode="wait">
            {transmitted ? (
              <motion.div
                key="received"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-10 text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-[#06d6a0]/20 border border-[#06d6a0] mx-auto flex items-center justify-center text-[#06d6a0] shadow-[0_0_30px_rgba(6,214,160,0.5)]">
                  <CheckCircle className="w-8 h-8 animate-bounce" />
                </div>
                <h4 className="text-xl font-orbitron font-bold text-white tracking-widest">
                  TRANSMISSION RECEIVED
                </h4>
                <p className="text-xs font-mono text-emerald-300 max-w-sm mx-auto leading-relaxed">
                  ENCRYPTED & LOGGED IN QUANTUM TELEMETRY BUFFER. OUR ORBITAL STATION WILL RESPOND SHORTLY.
                </p>
                <button
                  onClick={() => {
                    sounds.playClick();
                    setTransmitted(false);
                    setFormData({ callsign: '', frequency: '', message: '' });
                  }}
                  className="px-4 py-2 rounded-lg bg-black/60 border border-[#06d6a0]/50 text-xs font-mono text-[#06d6a0] hover:bg-[#06d6a0]/20 transition cursor-pointer"
                >
                  [ TRANSMIT ANOTHER SIGNAL ]
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-xs font-orbitron font-bold text-[#06d6a0] tracking-wider uppercase mb-2">
                  DISPATCH QUANTUM TELEGRAM
                </div>

                {/* Callsign / Name */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">
                    TRANSMITTER CALLSIGN // YOUR NAME
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Commander Sarah Chen"
                    value={formData.callsign}
                    onChange={(e) => setFormData({ ...formData, callsign: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-black/50 border border-slate-700 focus:border-[#06d6a0] outline-none text-xs font-mono text-white placeholder-slate-600 transition"
                  />
                </div>

                {/* Frequency / Email */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">
                    RETURN FREQUENCY // EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@mission-command.org"
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-black/50 border border-slate-700 focus:border-[#06d6a0] outline-none text-xs font-mono text-white placeholder-slate-600 transition"
                  />
                </div>

                {/* Message Payload */}
                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1">
                    SIGNAL PAYLOAD // MESSAGE CONTENT
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe mission objective, project collaboration, or engineering proposition..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-black/50 border border-slate-700 focus:border-[#06d6a0] outline-none text-xs font-space text-white placeholder-slate-600 resize-none transition"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isTransmitting}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#06d6a0] to-[#118ab2] hover:brightness-110 text-[#02040a] font-orbitron font-bold text-xs tracking-widest shadow-[0_0_20px_rgba(6,214,160,0.5)] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isTransmitting ? 'TRANSMITTING THROUGH HYPERSPACE...' : 'TRANSMIT MESSAGE'}</span>
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
