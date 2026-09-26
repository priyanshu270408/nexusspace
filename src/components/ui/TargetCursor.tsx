import React, { useEffect, useState } from 'react';
import { useMission } from '../../context/MissionContext';

export const TargetCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { hoveredDestination } = useMission();

  useEffect(() => {
    // Detect touch device
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (isTouchDevice) return null;

  const isLocked = !!hoveredDestination;

  return (
    <div
      className="fixed pointer-events-none z-50 transition-transform duration-75 ease-out"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Center Target Dot */}
      <div
        className={`w-2 h-2 rounded-full transition-all duration-150 ${
          isLocked ? 'bg-[#ff0055] scale-150 shadow-[0_0_10px_#ff0055]' : 'bg-[#00f3ff] shadow-[0_0_8px_#00f3ff]'
        } ${isClicking ? 'scale-75' : ''}`}
      />

      {/* Outer Reticle Ring / Brackets */}
      <div
        className={`absolute inset-0 -top-4 -left-4 w-8 h-8 rounded-full border border-dashed transition-all duration-300 ${
          isLocked
            ? 'w-12 h-12 -top-6 -left-6 border-[#ff0055] animate-spin scale-110 shadow-[0_0_15px_rgba(255,0,85,0.4)]'
            : 'border-[#00f3ff]/40'
        } ${isClicking ? 'scale-90' : ''}`}
        style={{ animationDuration: '6s' }}
      />

      {/* Target Locked Tag */}
      {isLocked && (
        <div className="absolute left-7 -top-3 whitespace-nowrap bg-black/80 backdrop-blur-md px-2 py-0.5 border border-[#ff0055]/60 text-[10px] tracking-widest font-mono text-[#ff0055] shadow-lg">
          TARGET LOCKED: {hoveredDestination?.name}
        </div>
      )}
    </div>
  );
};
