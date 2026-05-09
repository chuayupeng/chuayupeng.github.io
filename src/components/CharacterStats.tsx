import React from 'react';
import { X, ArrowLeft, ArrowRight, Shield, Rocket, Wine } from 'lucide-react';

interface CharacterStatsProps {
  level: number;
  currentLevelXP: number;
  skills: Record<string, number>;
  statsPosition: 'right' | 'left';
  toggleStats: () => void;
  togglePosition: () => void;
}

const FOCUS_SKILLS = [
  { key: 'cybersecurity',    label: 'Security',         icon: Shield, bar: 'from-blue-500 to-blue-400',     pct: 75 },
  { key: 'entrepreneurship', label: 'Entrepreneurship', icon: Rocket, bar: 'from-purple-500 to-purple-400', pct: 35 },
  { key: 'f&b',              label: 'F&B',              icon: Wine,   bar: 'from-amber-500 to-amber-400',   pct: 20 },
] as const;

const CharacterStats: React.FC<CharacterStatsProps> = ({
  level,
  currentLevelXP,
  statsPosition,
  toggleStats,
  togglePosition,
}) => {

  return (
    <div className="card-surface bg-card/90 backdrop-blur-md p-4 w-72 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          character.json
        </div>
        <div className="flex gap-1">
          <button
            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={togglePosition}
            aria-label="Switch side"
          >
            {statsPosition === 'right' ? <ArrowLeft size={12} /> : <ArrowRight size={12} />}
          </button>
          <button
            className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary"
            onClick={toggleStats}
            aria-label="Close"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="font-mono text-sm space-y-4">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">years_of_experience</div>
            <div className="text-2xl font-bold tabular-nums">
              {String(level).padStart(2, '0')}
              <span className="text-sm font-normal text-muted-foreground ml-1">yrs</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">since</div>
            <div className="tabular-nums">{new Date().getFullYear() - level}</div>
          </div>
        </div>

        <div className="space-y-2.5 pt-3 border-t border-white/[0.06]">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            focus_areas
          </div>
          {FOCUS_SKILLS.map(({ key, label, icon: Icon, bar, pct }) => (
            <div key={key}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-1.5 text-foreground/85">
                  <Icon size={12} className="text-muted-foreground" />
                  {label}
                </span>
                <span className="text-muted-foreground tabular-nums">{pct}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-1 overflow-hidden">
                <div className={`h-1 rounded-full bg-gradient-to-r ${bar}`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterStats;
