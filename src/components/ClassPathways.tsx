
import React from 'react';
import SkillTree from './SkillTree';
import './skill-tree/skillTreeStyles.css';

const ClassPathways = () => {
  return (
    <div className="w-full">
      {/* SVG definitions for gradient paths */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="blue-to-green" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          <linearGradient id="amber-to-purple" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>

      <SkillTree />
      
      <div className="cross-skills bg-muted/20 rounded-lg p-4 border border-dashed mt-8">
        <h4 className="text-sm font-medium mb-3">Cross-Skill Synergies</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-blue-400">Web Security Expert</span>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-400 to-green-400 rounded-full"></div>
            <span className="text-xs font-medium text-green-400">Technical Instructor</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-amber-400">Food Safety Officer</span>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-amber-400 to-purple-400 rounded-full"></div>
            <span className="text-xs font-medium text-purple-400">Venture Builder</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPathways;
