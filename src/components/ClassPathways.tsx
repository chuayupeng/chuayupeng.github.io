
import React from 'react';
import { Shield, BookOpen, ChefHat, Terminal, VenetianMask, ArrowRight } from 'lucide-react';

const ClassPathways = () => {
  const classData = {
    main: {
      label: 'Character Build',
      icon: <VenetianMask className="h-5 w-5" />,
      description: 'Multi-class adventurer',
      rarity: 'Unique'
    },
    primary: [
      {
        id: 'security',
        label: 'Security Mage',
        icon: <Shield className="h-5 w-5" />,
        description: 'Masters of defense magic',
        rarity: 'Legendary',
        color: 'blue',
        subclasses: [
          {
            id: 'security-1',
            label: 'Penetration Tester',
            description: 'Identifies vulnerabilities'
          },
          {
            id: 'security-2',
            label: 'Web Security Expert',
            description: 'Application exploit specialist'
          }
        ]
      },
      {
        id: 'teaching',
        label: 'Knowledge Sage',
        icon: <BookOpen className="h-5 w-5" />,
        description: 'Wielders of ancient wisdom',
        rarity: 'Epic',
        color: 'green',
        subclasses: [
          {
            id: 'teaching-1',
            label: 'Technical Instructor',
            description: 'Transfer complex knowledge'
          }
        ]
      },
      {
        id: 'culinary',
        label: 'Culinary Alchemist',
        icon: <ChefHat className="h-5 w-5" />,
        description: 'Creates powerful consumables',
        rarity: 'Rare',
        color: 'amber',
        subclasses: [
          {
            id: 'culinary-1',
            label: 'Food Safety Officer',
            description: 'Ensures potion quality'
          }
        ]
      },
      {
        id: 'entrepreneur',
        label: 'Guild Master',
        icon: <Terminal className="h-5 w-5" />,
        description: 'Leaders who build guilds',
        rarity: 'Epic',
        color: 'purple',
        subclasses: [
          {
            id: 'entrepreneur-1',
            label: 'Venture Builder',
            description: 'Creates new guild outposts'
          }
        ]
      }
    ]
  };

  const getColorClass = (color) => {
    switch (color) {
      case 'blue': return 'border-blue-400 bg-blue-50 dark:bg-blue-950/30';
      case 'green': return 'border-green-400 bg-green-50 dark:bg-green-950/30';
      case 'amber': return 'border-amber-400 bg-amber-50 dark:bg-amber-950/30';
      case 'purple': return 'border-purple-400 bg-purple-50 dark:bg-purple-950/30';
      default: return 'border-gray-400 bg-gray-50 dark:bg-gray-800/30';
    }
  };

  const getRarityClass = (rarity) => {
    switch (rarity) {
      case 'Legendary': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
      case 'Epic': return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
      case 'Rare': return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
      case 'Unique': return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  return (
    <div className="rpg-card w-full p-6 bg-white dark:bg-cyber-navy border rounded-lg">
      <div className="skill-tree">
        {/* Main character node */}
        <div className="main-character-node mb-8 mx-auto text-center">
          <div className="inline-block">
            <div className="character-node bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg p-4 border-2 border-cyan-400/50 shadow-lg animate-pulse-glow">
              <div className="flex items-center gap-2 justify-center mb-1">
                {classData.main.icon}
                <h3 className="font-bold text-lg">{classData.main.label}</h3>
              </div>
              <p className="text-sm opacity-90">{classData.main.description}</p>
              <span className={`text-xs inline-block mt-2 px-2 py-0.5 rounded-full border ${getRarityClass(classData.main.rarity)}`}>
                {classData.main.rarity}
              </span>
            </div>
          </div>

          {/* Connecting lines to primary classes */}
          <div className="flex justify-center mt-2 mb-4">
            <div className="w-0.5 h-6 bg-gradient-to-b from-cyan-400 to-blue-400"></div>
          </div>
        </div>

        {/* Primary class nodes */}
        <div className="primary-classes grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 relative">
          {/* Connecting horizontal line */}
          <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 transform -translate-y-1/2 hidden lg:block"></div>

          {classData.primary.map((primaryClass) => (
            <div key={primaryClass.id} className="class-branch flex flex-col items-center">
              {/* Primary class node */}
              <div className={`class-node rounded-lg p-3 border-2 shadow-md ${getColorClass(primaryClass.color)}`}>
                <div className="flex items-center gap-2 mb-1">
                  {primaryClass.icon}
                  <h4 className="font-bold">{primaryClass.label}</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{primaryClass.description}</p>
                <span className={`text-xs inline-block px-2 py-0.5 rounded-full border ${getRarityClass(primaryClass.rarity)}`}>
                  {primaryClass.rarity}
                </span>
              </div>

              {/* Connecting line */}
              {primaryClass.subclasses.length > 0 && (
                <div className="w-0.5 h-5 bg-gray-300 dark:bg-gray-700 my-2"></div>
              )}

              {/* Subclass nodes */}
              <div className="subclasses space-y-2">
                {primaryClass.subclasses.map((subclass) => (
                  <div key={subclass.id} className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <div className={`subclass-node rounded p-2 border shadow-sm ${getColorClass(primaryClass.color)} opacity-90`}>
                      <h5 className="font-medium text-sm">{subclass.label}</h5>
                      <p className="text-xs text-muted-foreground">{subclass.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Cross-skill connections */}
        <div className="cross-skills bg-muted/20 rounded-lg p-3 border border-dashed">
          <h4 className="text-sm font-medium mb-2">Cross-Skill Synergies</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-blue-400">Web Security Expert</span>
              <ArrowRight className="h-3 w-3" />
              <span className="text-xs font-medium text-green-400">Technical Instructor</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-amber-400">Food Safety Officer</span>
              <ArrowRight className="h-3 w-3" />
              <span className="text-xs font-medium text-purple-400">Venture Builder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPathways;
