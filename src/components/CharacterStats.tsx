
import React from 'react';
import { Trophy, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { CategoryType } from '@/data/timelineData';

interface CharacterStatsProps {
  level: number;
  currentLevelXP: number;
  skills: Record<string, number>;
  statsPosition: 'right' | 'left';
  toggleStats: () => void;
  togglePosition: () => void;
}

const CharacterStats: React.FC<CharacterStatsProps> = ({
  level,
  currentLevelXP,
  skills,
  statsPosition,
  toggleStats,
  togglePosition
}) => {
  // Find the maximum skill value to calculate relative percentages
  const maxSkillValue = Math.max(...Object.values(skills));
  
  // Format category names for display
  const formatCategoryName = (category: string): string => {
    if (category === 'f&b') return 'F&B';
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  return (
    <div className="bg-card/90 backdrop-blur-sm border rounded-lg p-4 w-64 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">Character Stats</h3>
        <div className="flex gap-2">
          <button 
            className="text-muted-foreground hover:text-foreground"
            onClick={togglePosition}
            aria-label="Change position"
          >
            {statsPosition === 'right' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />}
          </button>
          <button 
            className="text-muted-foreground hover:text-foreground"
            onClick={toggleStats}
            aria-label="Close stats"
          >
            <X size={14} />
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span>Level {level}</span>
          <div className="flex items-center gap-1">
            <Trophy size={14} className="text-amber-500" />
            <span>{currentLevelXP}/500 XP</span>
          </div>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-primary animate-pulse-light" 
            style={{ width: `${(currentLevelXP / 500) * 100}%` }} 
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-3 text-sm">
        {Object.entries(skills).map(([skill, value]) => (
          <div key={skill} className="flex flex-col">
            <div className="flex justify-between mb-1">
              <span className="capitalize">{formatCategoryName(skill)}</span>
              <span>{Math.round(value)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  skill === 'cybersecurity' ? 'bg-blue-500' :
                  skill === 'teaching' ? 'bg-green-500' :
                  skill === 'f&b' ? 'bg-amber-500' :
                  'bg-purple-500'
                }`}
                style={{ width: `${(value / maxSkillValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CharacterStats;
