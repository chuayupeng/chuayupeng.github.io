
import React from 'react';
import { ArrowLeft, ArrowRight, User } from 'lucide-react';
import CharacterStats from '@/components/CharacterStats';

interface CharacterStatsPanelProps {
  level: number;
  currentLevelXP: number;
  skills: Record<string, number>;
  statsVisible: boolean;
  statsPosition: 'right' | 'left';
  toggleStats: () => void;
  togglePosition: () => void;
}

const CharacterStatsPanel: React.FC<CharacterStatsPanelProps> = ({
  level,
  currentLevelXP,
  skills,
  statsVisible,
  statsPosition,
  toggleStats,
  togglePosition
}) => {
  return (
    <div 
      className={`fixed ${statsPosition === 'right' ? 'right-0' : 'left-0'} top-1/3 transform transition-all duration-300 ease-in-out z-30
        ${statsVisible ? 'translate-x-0' : (statsPosition === 'right' ? 'translate-x-full' : '-translate-x-full')}
      `}
    >
      <div className="relative">
        <div
          className={`absolute ${statsPosition === 'right' ? '-left-10' : '-right-10'} top-4 cursor-pointer bg-card/90 backdrop-blur-md border border-white/[0.08] p-2 text-foreground/80 hover:text-cyber-cyan transition-colors
            ${statsPosition === 'right' ? 'rounded-l-lg' : 'rounded-r-lg'}`}
          onClick={toggleStats}
        >
          {statsVisible ?
            (statsPosition === 'right' ? <ArrowRight size={18} /> : <ArrowLeft size={18} />) :
            (statsPosition === 'right' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />)
          }
        </div>
        
        {statsVisible && (
          <CharacterStats
            level={level}
            currentLevelXP={currentLevelXP}
            skills={skills}
            statsPosition={statsPosition}
            toggleStats={toggleStats}
            togglePosition={togglePosition}
          />
        )}
      </div>
    </div>
  );
};

export default CharacterStatsPanel;
