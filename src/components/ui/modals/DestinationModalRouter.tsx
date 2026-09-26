import React from 'react';
import { useMission } from '../../../context/MissionContext';
import { HolographicModalContainer } from './HolographicModalContainer';
import { AboutModal } from './AboutModal';
import { ProjectsModal } from './ProjectsModal';
import { ExperimentsModal } from './ExperimentsModal';
import { SkillsModal } from './SkillsModal';
import { AchievementsModal } from './AchievementsModal';
import { ContactModal } from './ContactModal';
import { ResumeModal } from './ResumeModal';
import { Search } from 'lucide-react';

export const DestinationModalRouter: React.FC = () => {
  const { activeDestination } = useMission();

  if (!activeDestination) return null;

  const renderContent = () => {
    switch (activeDestination.id) {
      case 'earth':
        return <AboutModal />;
      case 'mars':
        return <ProjectsModal />;
      case 'alien':
        return <ExperimentsModal />;
      case 'station':
        return <SkillsModal />;
      case 'blackhole':
        return <AchievementsModal />;
      case 'satellite':
        return <ContactModal />;
      case 'missioncontrol':
        return <ResumeModal />;
      default:
        return (
          // Error / Empty State Requirement (Section 15)
          <div className="py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400">
              <Search className="w-8 h-8 animate-pulse" />
            </div>
            <h4 className="text-lg font-orbitron font-bold text-white tracking-widest">
              MISSION DATA CURRENTLY UNAVAILABLE
            </h4>
            <div className="w-48 h-1 bg-slate-800 rounded mx-auto overflow-hidden relative">
              <div className="absolute inset-y-0 w-16 bg-amber-400 animate-pulse" />
            </div>
            <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
              Scanning orbital sectors for telemetry packets. Please re-engage primary communications channel.
            </p>
          </div>
        );
    }
  };

  return <HolographicModalContainer>{renderContent()}</HolographicModalContainer>;
};
