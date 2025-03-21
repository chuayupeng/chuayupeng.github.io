
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
  connections: string[];
}

interface SimpleSkillTreeProps {
  className?: string;
}

const SimpleSkillTree: React.FC<SimpleSkillTreeProps> = ({ className }) => {
  // Define skill tree data
  const skills: SkillNodeType[] = [
    // Core central skill
    {
      id: 'core',
      icon: <Star className="w-6 h-6" />,
      title: 'Core Skills',
      description: 'Foundation of all your abilities',
      unlocked: true,
      highlight: true,
      x: 50,
      y: 50,
      color: 'from-cyan-500 to-teal-500',
      connections: ['hacking', 'defense', 'forensics', 'development']
    },
    // Main branches
    {
      id: 'hacking',
      icon: <Sword className="w-5 h-5" />,
      title: 'Offensive Security',
      description: 'Penetration testing and red team skills',
      unlocked: true,
      x: 30,
      y: 25,
      color: 'from-red-500 to-rose-500',
      connections: ['exploit', 'social']
    },
    {
      id: 'defense',
      icon: <Shield className="w-5 h-5" />,
      title: 'Defensive Security',
      description: 'Blue team and security monitoring',
      unlocked: true,
      x: 70,
      y: 25,
      color: 'from-blue-500 to-indigo-500',
      connections: ['soc', 'incident']
    },
    {
      id: 'forensics',
      icon: <Bug className="w-5 h-5" />,
      title: 'Digital Forensics',
      description: 'Evidence collection and analysis',
      unlocked: true,
      x: 30,
      y: 75,
      color: 'from-purple-500 to-violet-500',
      connections: ['malware']
    },
    {
      id: 'development',
      icon: <Code className="w-5 h-5" />,
      title: 'Secure Development',
      description: 'Building secure applications',
      unlocked: true,
      x: 70,
      y: 75,
      color: 'from-emerald-500 to-green-500',
      connections: ['devops']
    },
    // Sub-skills
    {
      id: 'exploit',
      icon: <Zap className="w-4 h-4" />,
      title: 'Exploit Development',
      description: 'Creating and using exploits',
      unlocked: true,
      x: 10,
      y: 15,
      color: 'from-red-400 to-rose-400',
      connections: []
    },
    {
      id: 'social',
      icon: <Lock className="w-4 h-4" />,
      title: 'Social Engineering',
      description: 'Human-focused attack vectors',
      unlocked: false,
      x: 20,
      y: 10,
      color: 'from-orange-400 to-amber-400',
      connections: []
    },
    {
      id: 'soc',
      icon: <Cpu className="w-4 h-4" />,
      title: 'Security Operations',
      description: 'Monitoring and alert triage',
      unlocked: true,
      x: 80,
      y: 10,
      color: 'from-blue-400 to-indigo-400',
      connections: []
    },
    {
      id: 'incident',
      icon: <ServerCrash className="w-4 h-4" />,
      title: 'Incident Response',
      description: 'Handling security breaches',
      unlocked: false,
      x: 90,
      y: 15,
      color: 'from-sky-400 to-cyan-400',
      connections: []
    },
    {
      id: 'malware',
      icon: <Bug className="w-4 h-4" />,
      title: 'Malware Analysis',
      description: 'Reverse engineering malicious code',
      unlocked: false,
      x: 15,
      y: 85,
      color: 'from-purple-400 to-violet-400',
      connections: []
    },
    {
      id: 'devops',
      icon: <ChevronsUp className="w-4 h-4" />,
      title: 'DevSecOps',
      description: 'Security in CI/CD pipelines',
      unlocked: true,
      x: 85,
      y: 85,
      color: 'from-emerald-400 to-green-400',
      connections: []
    },
  ];

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
          
          connections.push(
            <path
              key={`${skill.id}-${target.id}`}
              d={path}
              stroke={isHighlighted ? "#38bdf8" : "#64748b"}
              strokeWidth={isHighlighted ? 2 : 1.5}
              strokeDasharray={isHighlighted ? "" : "4,4"}
              className={cn(
                "transition-all duration-300",
                isHighlighted ? "opacity-90" : "opacity-40"
              )}
            />
          );
        }
      });
    });
    
    return connections;
  };

  return (
    <div className={cn("relative w-full max-w-3xl mx-auto py-8", className)}>
      <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Skill Tree</h2>
      <div className="relative w-full aspect-[4/3] border bg-black/90 rounded-lg overflow-hidden">
        {/* SVG for connection lines */}
        <svg 
          className="absolute inset-0 w-full h-full z-0" 
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
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
                    skill.highlight ? "scale-125" : ""
                  )}
                  style={{
                    left: `${skill.x}%`,
                    top: `${skill.y}%`,
                  }}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br",
                      `bg-gradient-to-br ${skill.color}`,
                      "border-2",
                      skill.unlocked 
                        ? "border-cyan-300 shadow-lg shadow-cyan-500/30" 
                        : "border-gray-600",
                      "cursor-pointer transition-transform hover:scale-110"
                    )}
                  >
                    {skill.icon}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-black/90 border-gray-700">
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
        
        {/* XP Progress Bar */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-cyan-300">
          <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 w-3/4"></div>
          </div>
          <span>750/1000 XP</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleSkillTree;
