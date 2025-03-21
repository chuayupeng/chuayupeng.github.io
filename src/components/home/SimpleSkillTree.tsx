
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Shield, Sword, Zap, Star, Code, Bug, 
  ChevronsUp, Cpu, ServerCrash, Lock 
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define skill node types
type SkillNodeType = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  unlocked: boolean;
  highlight?: boolean;
  x: number;
  y: number;
  color: string;
  path: string; // Added path to organize skills in columns
  connections: string[];
}

interface SimpleSkillTreeProps {
  className?: string;
}

const SimpleSkillTree: React.FC<SimpleSkillTreeProps> = ({ className }) => {
  // Define skill tree data with three distinct paths
  const skills: SkillNodeType[] = [
    // Offensive Path (left column)
    {
      id: 'offensive-root',
      icon: <Sword className="w-6 h-6" />,
      title: 'Offensive Security',
      description: 'Red team techniques',
      unlocked: true,
      highlight: true,
      x: 20,
      y: 15,
      color: 'from-red-500 to-rose-500',
      path: 'offensive',
      connections: ['exploit', 'web-app']
    },
    {
      id: 'exploit',
      icon: <Zap className="w-5 h-5" />,
      title: 'Exploit Development',
      description: 'Creating and utilizing exploits',
      unlocked: true,
      x: 20,
      y: 35,
      color: 'from-red-400 to-rose-400',
      path: 'offensive',
      connections: ['reverse-eng']
    },
    {
      id: 'web-app',
      icon: <Lock className="w-5 h-5" />,
      title: 'Web App Security',
      description: 'Testing web application security',
      unlocked: true,
      x: 20,
      y: 55,
      color: 'from-red-400 to-rose-400',
      path: 'offensive',
      connections: ['social-eng']
    },
    {
      id: 'reverse-eng',
      icon: <Bug className="w-5 h-5" />,
      title: 'Reverse Engineering',
      description: 'Analyzing code and binaries',
      unlocked: false,
      x: 20,
      y: 75,
      color: 'from-red-300 to-rose-300',
      path: 'offensive',
      connections: ['red-team']
    },
    {
      id: 'social-eng',
      icon: <ServerCrash className="w-5 h-5" />,
      title: 'Social Engineering',
      description: 'Human-focused attack vectors',
      unlocked: false,
      x: 20,
      y: 85,
      color: 'from-red-300 to-rose-300',
      path: 'offensive',
      connections: []
    },
    {
      id: 'red-team',
      icon: <Sword className="w-6 h-6" />,
      title: 'Red Team Ops',
      description: 'Advanced offensive operations',
      unlocked: false,
      x: 20,
      y: 95,
      color: 'from-red-500 to-rose-500',
      path: 'offensive',
      connections: []
    },
    
    // Defensive Path (middle column)
    {
      id: 'defensive-root',
      icon: <Shield className="w-6 h-6" />,
      title: 'Defensive Security',
      description: 'Blue team techniques',
      unlocked: true,
      highlight: true,
      x: 50,
      y: 15,
      color: 'from-blue-500 to-cyan-500',
      path: 'defensive',
      connections: ['soc', 'threat-intel']
    },
    {
      id: 'soc',
      icon: <Cpu className="w-5 h-5" />,
      title: 'Security Operations',
      description: 'Monitoring and alert triage',
      unlocked: true,
      x: 50,
      y: 35,
      color: 'from-blue-400 to-cyan-400',
      path: 'defensive',
      connections: ['incident-resp']
    },
    {
      id: 'threat-intel',
      icon: <ChevronsUp className="w-5 h-5" />,
      title: 'Threat Intelligence',
      description: 'Analyzing threat data',
      unlocked: true,
      x: 50,
      y: 55,
      color: 'from-blue-400 to-cyan-400',
      path: 'defensive',
      connections: ['threat-hunting']
    },
    {
      id: 'incident-resp',
      icon: <Zap className="w-5 h-5" />,
      title: 'Incident Response',
      description: 'Handling security breaches',
      unlocked: false,
      x: 50,
      y: 75,
      color: 'from-blue-300 to-cyan-300',
      path: 'defensive',
      connections: ['blue-team']
    },
    {
      id: 'threat-hunting',
      icon: <ServerCrash className="w-5 h-5" />,
      title: 'Threat Hunting',
      description: 'Proactive detection techniques',
      unlocked: false,
      x: 50,
      y: 85,
      color: 'from-blue-300 to-cyan-300',
      path: 'defensive',
      connections: []
    },
    {
      id: 'blue-team',
      icon: <Shield className="w-6 h-6" />,
      title: 'Blue Team Ops',
      description: 'Advanced defensive operations',
      unlocked: false,
      x: 50,
      y: 95,
      color: 'from-blue-500 to-cyan-500',
      path: 'defensive',
      connections: []
    },
    
    // Development Path (right column)
    {
      id: 'dev-root',
      icon: <Code className="w-6 h-6" />,
      title: 'Secure Development',
      description: 'Building secure systems',
      unlocked: true,
      highlight: true,
      x: 80,
      y: 15,
      color: 'from-purple-500 to-violet-500',
      path: 'development',
      connections: ['secure-coding', 'secure-design']
    },
    {
      id: 'secure-coding',
      icon: <Code className="w-5 h-5" />,
      title: 'Secure Coding',
      description: 'Writing secure code',
      unlocked: true,
      x: 80,
      y: 35,
      color: 'from-purple-400 to-violet-400',
      path: 'development',
      connections: ['code-review']
    },
    {
      id: 'secure-design',
      icon: <Bug className="w-5 h-5" />,
      title: 'Secure Design',
      description: 'Designing security architecture',
      unlocked: true,
      x: 80,
      y: 55,
      color: 'from-purple-400 to-violet-400',
      path: 'development',
      connections: ['devops']
    },
    {
      id: 'code-review',
      icon: <Zap className="w-5 h-5" />,
      title: 'Security Code Review',
      description: 'Finding flaws in source code',
      unlocked: false,
      x: 80,
      y: 75,
      color: 'from-purple-300 to-violet-300',
      path: 'development',
      connections: ['secure-sdlc']
    },
    {
      id: 'devops',
      icon: <ChevronsUp className="w-5 h-5" />,
      title: 'DevSecOps',
      description: 'Security in CI/CD pipelines',
      unlocked: false,
      x: 80,
      y: 85,
      color: 'from-purple-300 to-violet-300',
      path: 'development',
      connections: []
    },
    {
      id: 'secure-sdlc',
      icon: <Star className="w-6 h-6" />,
      title: 'Secure SDLC',
      description: 'Enterprise security program',
      unlocked: false,
      x: 80,
      y: 95,
      color: 'from-purple-500 to-violet-500',
      path: 'development',
      connections: []
    },
  ];

  // Group skills by path
  const pathColors = {
    offensive: "rgba(244, 63, 94, 0.3)", // red path
    defensive: "rgba(6, 182, 212, 0.3)",  // cyan path
    development: "rgba(139, 92, 246, 0.3)" // purple path
  };

  // Function to draw connections between nodes
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    skills.forEach(skill => {
      skill.connections.forEach(targetId => {
        const target = skills.find(s => s.id === targetId);
        if (target) {
          // Calculate start and end positions
          const x1 = skill.x;
          const y1 = skill.y;
          const x2 = target.x;
          const y2 = target.y;
          
          // Calculate the path for the connection line
          const path = `M ${x1} ${y1} L ${x2} ${y2}`;
          
          // Determine if the connection should be highlighted
          const isHighlighted = skill.unlocked && target.unlocked;

          // Get path color
          const pathColor = skill.path === 'offensive' ? "#f43f5e" : 
                            skill.path === 'defensive' ? "#06b6d4" : 
                            "#8b5cf6";
          
          connections.push(
            <path
              key={`${skill.id}-${target.id}`}
              d={path}
              stroke={isHighlighted ? pathColor : "rgba(255,255,255,0.15)"}
              strokeWidth={isHighlighted ? 1 : 0.75}
              strokeDasharray={!isHighlighted ? "4,2" : ""}
              className={cn(
                "transition-all duration-300",
                isHighlighted ? "opacity-80" : "opacity-40"
              )}
            />
          );
        }
      });
    });
    
    return connections;
  };

  // Function to render vertical paths behind nodes
  const renderPaths = () => {
    return (
      <>
        {Object.entries(pathColors).map(([path, color]) => {
          const pathSkills = skills.filter(s => s.path === path);
          if (pathSkills.length === 0) return null;
          
          const x = pathSkills[0].x;
          const minY = Math.min(...pathSkills.map(s => s.y));
          const maxY = Math.max(...pathSkills.map(s => s.y));
          
          return (
            <rect
              key={`path-${path}`}
              x={x - 1}
              y={minY}
              width={2}
              height={maxY - minY}
              fill={color}
              rx={1}
              className="opacity-50"
            />
          );
        })}
      </>
    );
  };

  return (
    <div className={cn("relative w-full max-w-4xl mx-auto py-8", className)}>
      <div className="relative w-full aspect-[5/3] border border-gray-800 bg-black/90 rounded-lg overflow-hidden">
        {/* SVG for paths and connection lines */}
        <svg 
          className="absolute inset-0 w-full h-full z-0" 
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {renderPaths()}
          {renderConnections()}
        </svg>
        
        {/* Skill Nodes */}
        <TooltipProvider>
          {skills.map((skill) => (
            <Tooltip key={skill.id}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                    skill.unlocked ? "opacity-100" : "opacity-50",
                    skill.highlight ? "scale-110" : ""
                  )}
                  style={{
                    left: `${skill.x}%`,
                    top: `${skill.y}%`,
                  }}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full bg-gradient-to-br",
                      `bg-gradient-to-br ${skill.color}`,
                      "border",
                      skill.unlocked 
                        ? skill.path === 'offensive' ? "border-red-300 shadow-sm shadow-red-500/30" :
                          skill.path === 'defensive' ? "border-cyan-300 shadow-sm shadow-cyan-500/30" :
                          "border-purple-300 shadow-sm shadow-purple-500/30"
                        : "border-gray-700",
                      "cursor-pointer transition-transform hover:scale-110",
                      skill.highlight ? "w-10 h-10" : "w-8 h-8"
                    )}
                  >
                    {skill.icon}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/95 border-gray-800">
                <div className="p-1">
                  <div className="font-bold text-sm">{skill.title}</div>
                  <div className="text-xs text-gray-300">{skill.description}</div>
                  {!skill.unlocked && (
                    <div className="text-xs mt-1 text-amber-400">Locked</div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
        
        {/* Path Labels */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-around">
          <div className="text-red-400 text-sm font-semibold">Offensive</div>
          <div className="text-cyan-400 text-sm font-semibold">Defensive</div>
          <div className="text-purple-400 text-sm font-semibold">Development</div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="absolute top-3 right-3 flex items-center gap-2 text-xs text-gray-300">
          <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-3/4"></div>
          </div>
          <span>750/1000 XP</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleSkillTree;
