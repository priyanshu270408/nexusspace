import React from 'react';
import { MissionProvider } from './context/MissionContext';
import { SpaceCanvas } from './components/canvas/SpaceCanvas';
import { BootIntro } from './components/ui/BootIntro';
import { HUDOverlay } from './components/ui/HUDOverlay';
import { DestinationsDock } from './components/ui/DestinationsDock';
import { DestinationModalRouter } from './components/ui/modals/DestinationModalRouter';
import { TargetCursor } from './components/ui/TargetCursor';

const MissionApp: React.FC = () => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#02040a] select-none text-slate-100">
      {/* 3D WebGL Space Canvas */}
      <SpaceCanvas />

      {/* Futuristic Boot Sequence & Hero Landing */}
      <BootIntro />

      {/* Interactive Sci-Fi HUD Overlay */}
      <HUDOverlay />

      {/* Bottom Celestial Destinations Dock */}
      <DestinationsDock />

      {/* Active Section Holographic Modal */}
      <DestinationModalRouter />

      {/* Custom Targeting Crosshair Cursor */}
      <TargetCursor />
    </div>
  );
};

export default function App() {
  return (
    <MissionProvider>
      <MissionApp />
    </MissionProvider>
  );
}
