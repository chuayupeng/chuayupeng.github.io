
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Shield, BookOpen, ChefHat, Terminal, VenetianMask, Star } from 'lucide-react';

const iconMap = {
  shield: Shield,
  book: BookOpen,
  chef: ChefHat,
  terminal: Terminal,
  mask: VenetianMask,
};

const getRarityStars = (rarity: string) => {
  switch (rarity) {
    case 'Legendary': return 5;
    case 'Epic': return 4;
    case 'Rare': return 3;
    case 'Uncommon': return 2;
    default: return 1;
  }
};

const getRarityClass = (rarity: string) => {
  switch (rarity) {
    case 'Legendary': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
    case 'Epic': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
    case 'Rare': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    case 'Unique': return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
    default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
  }
};

const getColorClass = (color: string) => {
  switch (color) {
    case 'blue': return 'border-blue-400 bg-blue-50 dark:bg-blue-950/30';
    case 'green': return 'border-green-400 bg-green-50 dark:bg-green-950/30';
    case 'amber': return 'border-amber-400 bg-amber-50 dark:bg-amber-950/30';
    case 'purple': return 'border-purple-400 bg-purple-50 dark:bg-purple-950/30';
    case 'cyan': return 'border-cyan-400 bg-cyan-50 dark:bg-cyan-950/30';
    default: return 'border-gray-400 bg-gray-50 dark:bg-gray-800/30';
  }
};

export const SkillNode = memo(({ data }) => {
  const IconComponent = data.icon ? iconMap[data.icon] : null;
  const stars = getRarityStars(data.rarity);
  
  return (
    <div className={`skill-node rounded-lg p-3 border-2 shadow-md ${getColorClass(data.color)}`}>
      {data.isMain && (
        <div className="absolute left-1/2 top-[-20px] w-4 h-4 border-l-2 border-t-2 border-cyan-400 transform -translate-x-1/2 rotate-45"></div>
      )}
      
      <div className="flex items-center gap-2 mb-1">
        {IconComponent && <IconComponent className="h-5 w-5" />}
        <h3 className="font-bold">{data.label}</h3>
      </div>
      
      <p className="text-xs text-muted-foreground mb-2">{data.description}</p>
      
      <span className={`text-xs inline-block px-2 py-0.5 rounded-full border ${getRarityClass(data.rarity)}`}>
        {data.rarity}
      </span>
      
      {stars > 0 && (
        <div className="flex items-center gap-0.5 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i}
              size={10}
              className={i < stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
            />
          ))}
        </div>
      )}
      
      {/* Connection points */}
      {data.inputs && (
        <Handle type="target" position={Position.Top} className="skill-handle" />
      )}
      
      {data.outputs && (
        <Handle type="source" position={Position.Bottom} className="skill-handle" />
      )}
      
      {data.outputLeft && (
        <Handle type="source" position={Position.Left} className="skill-handle" id="left" />
      )}
      
      {data.outputRight && (
        <Handle type="source" position={Position.Right} className="skill-handle" id="right" />
      )}
    </div>
  );
});
