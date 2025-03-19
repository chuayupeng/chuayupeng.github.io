
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
          className={`absolute ${statsPosition === 'right' ? '-left-10' : '-right-10'} top-4 cursor-pointer bg-card/80 backdrop-blur-sm border rounded-l-lg p-2
            ${statsPosition === 'left' ? 'rounded-r-lg rounded-l-none' : ''}`}
          onClick={toggleStats}
        >
          {statsVisible ? 
            (statsPosition === 'right' ? <ArrowRight size={20} /> : <ArrowLeft size={20} />) : 
            (statsPosition === 'right' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />)
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
