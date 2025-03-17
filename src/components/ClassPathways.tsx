
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Shield, BookOpen, ChefHat, Terminal, VenetianMask, Star,
  Database, Code, BugPlay, Server, FileCode, Network
} from 'lucide-react';

// Define the node data interface
interface ClassNodeData {
  label: string;
  icon?: string;
  description?: string;
  rarity?: string;
  level?: number;
  experiences?: string[];
  [key: string]: any; // Index signature to satisfy Record<string, unknown>
}

// Custom node component
const ClassNode = ({ data }: { data: ClassNodeData }) => {
  let IconComponent;
  
  switch (data.icon) {
    case 'Shield':
      IconComponent = Shield;
      break;
    case 'BookOpen':
      IconComponent = BookOpen;
      break;
    case 'ChefHat':
      IconComponent = ChefHat;
      break;
    case 'Terminal':
      IconComponent = Terminal;
      break;
    case 'VenetianMask':
      IconComponent = VenetianMask;
      break;
    case 'Database':
      IconComponent = Database;
      break;
    case 'Code':
      IconComponent = Code;
      break;
    case 'BugPlay':
      IconComponent = BugPlay;
      break;
    case 'Server':
      IconComponent = Server;
      break;
    case 'FileCode':
      IconComponent = FileCode;
      break;
    case 'Network':
      IconComponent = Network;
      break;
    default:
      IconComponent = Shield;
  }
  
  // Calculate number of stars based on rarity
  const starsCount = 
    data.rarity === 'Legendary' ? 5 : 
    data.rarity === 'Epic' ? 4 : 
    data.rarity === 'Rare' ? 3 : 
    data.rarity === 'Uncommon' ? 2 : 1;
  
  return (
    <div className={`p-3 shadow-md rounded-md max-w-[180px] backdrop-blur-sm ${
      data.icon === 'VenetianMask' 
        ? 'bg-gradient-to-br from-cyber-navy/90 to-cyber-dark-navy/90 border border-cyber-cyan/50 text-white' 
        : 'bg-white/90 dark:bg-cyber-navy/90 border border-gray-200/50 dark:border-gray-700/50'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {IconComponent && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            data.icon === 'Shield' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
            data.icon === 'BookOpen' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
            data.icon === 'ChefHat' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' :
            data.icon === 'Terminal' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
            'bg-gray-100 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400'
          }`}>
            <IconComponent className="w-4 h-4" />
          </div>
        )}
        <strong className="text-foreground dark:text-white">{data.label}</strong>
      </div>
      
      {data.description && (
        <p className="text-xs text-muted-foreground dark:text-gray-300 mb-2">{data.description}</p>
      )}
      
      {data.rarity && (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                className={i < starsCount ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600"} 
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground dark:text-gray-400">
            {data.rarity}
          </span>
        </div>
      )}
      
      {data.experiences && data.experiences.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100/30 dark:border-gray-700/30">
          <p className="text-xs font-medium mb-1 dark:text-gray-200">Experiences:</p>
          <ul className="text-xs text-muted-foreground dark:text-gray-400 space-y-1">
            {data.experiences.slice(0, 2).map((exp, i) => (
              <li key={i} className="truncate">{exp}</li>
            ))}
            {data.experiences.length > 2 && (
              <li className="text-xs italic">+{data.experiences.length - 2} more...</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// Node types definition
const nodeTypes = {
  classNode: ClassNode,
};

const ClassPathways = () => {
  // Initial nodes for the skill tree
  const initialNodes: Node<ClassNodeData>[] = [
    // Main character node (center)
    {
      id: 'main',
      type: 'classNode',
      data: { 
        label: 'Chua Yu Peng',
        icon: 'VenetianMask',
        description: 'Security Professional',
        experiences: ['Certified Red Team Operator (CRTO)', 'Offensive Security Web Expert (OSWE)', 'Offensive Security Certified Professional (OSCP)']
      },
      position: { x: 300, y: 250 },
      className: 'main-node'
    },
    
    // Primary class specializations
    {
      id: 'security',
      type: 'classNode',
      data: { 
        label: 'Security Mage', 
        icon: 'Shield',
        description: 'Information Security Expert',
        rarity: 'Legendary',
        experiences: [
          'Penetration Testing', 
          'Red Team Operations', 
          'Vulnerability Research',
          'Cloud Security (Azure)'
        ]
      },
      position: { x: 100, y: 100 },
      className: 'class-node security'
    },
    {
      id: 'teaching',
      type: 'classNode',
      data: { 
        label: 'Knowledge Sage', 
        icon: 'BookOpen',
        description: 'Education & Training',
        rarity: 'Epic',
        experiences: [
          'BSc Computer Science (Security)',
          'Cybersecurity Advisor for Stealth Gaming',
          'Incident Response Team Training'
        ]
      },
      position: { x: 300, y: 50 },
      className: 'class-node teaching'
    },
    {
      id: 'digital',
      type: 'classNode',
      data: { 
        label: 'Digital Alchemist', 
        icon: 'Code',
        description: 'Software Development',
        rarity: 'Rare',
        experiences: [
          'Full Stack Development', 
          'React/Redux and Laravel',
          'Built internal security tools',
          'SemGrep Integration'
        ]
      },
      position: { x: 500, y: 100 },
      className: 'class-node culinary'
    },
    {
      id: 'entrepreneurship',
      type: 'classNode',
      data: { 
        label: 'Security Consultant', 
        icon: 'Terminal',
        description: 'Independent Advisory',
        rarity: 'Epic',
        experiences: [
          'ITSEC Asia Security Consultant',
          'Bug Bounty Hunter',
          'VAPT Services',
          'Security Reviews'
        ] 
      },
      position: { x: 500, y: 350 },
      className: 'class-node entrepreneur'
    },
    
    // Subclasses and specializations
    {
      id: 'security-1',
      type: 'classNode',
      data: { 
        label: 'Red Team Operator', 
        icon: 'BugPlay',
        description: 'Offensive Security',
        experiences: ['Led red team engagements', 'Phishing simulations', 'Penetration testing', 'CRTO Certification (2021)']
      },
      position: { x: 0, y: 200 },
      className: 'subclass-node security'
    },
    {
      id: 'security-2',
      type: 'classNode',
      data: { 
        label: 'Product Security', 
        icon: 'Server',
        description: 'ByteDance/TikTok',
        experiences: ['10,000+ security reviews', 'Penetration tests', 'Discovered critical vulnerabilities', 'Red Teaming with Python']
      },
      position: { x: 150, y: 200 },
      className: 'subclass-node security'
    },
    {
      id: 'teaching-1',
      type: 'classNode',
      data: { 
        label: 'CSIRT Expert', 
        icon: 'FileCode',
        description: 'Digital & Intelligence',
        experiences: ['Incident Response team', 'Malware investigations', 'Attack scenarios', 'Splunk/Arkime/ELK']
      },
      position: { x: 300, y: 150 },
      className: 'subclass-node teaching'
    },
    {
      id: 'digital-1',
      type: 'classNode',
      data: { 
        label: 'Security Tooling', 
        icon: 'Database',
        description: 'Personal Projects',
        experiences: ['CTF Team Leader (0x1EA7BEEF)', 'Freki XSS detector', 'DNS Tunneling Detection', 'CVSSv3 Classifier']
      },
      position: { x: 450, y: 200 },
      className: 'subclass-node culinary'
    },
    {
      id: 'entrepreneur-1',
      type: 'classNode',
      data: { 
        label: 'Security Engineer', 
        icon: 'Network',
        description: 'Defence Science Tech',
        experiences: ['VAPT services', 'System hardening', 'Compliance checks', 'Security assessment']
      },
      position: { x: 600, y: 250 },
      className: 'subclass-node entrepreneur'
    },
  ];

  // Define the edges between nodes
  const initialEdges: Edge[] = [
    // Main connections to primary classes
    { id: 'e-main-security', source: 'main', target: 'security', animated: true, className: 'primary-edge security', style: { stroke: '#3b82f6', strokeWidth: 2 } },
    { id: 'e-main-teaching', source: 'main', target: 'teaching', animated: true, className: 'primary-edge teaching', style: { stroke: '#22c55e', strokeWidth: 2 } },
    { id: 'e-main-digital', source: 'main', target: 'digital', animated: true, className: 'primary-edge culinary', style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e-main-entrepreneur', source: 'main', target: 'entrepreneurship', animated: true, className: 'primary-edge entrepreneur', style: { stroke: '#a855f7', strokeWidth: 2 } },
    
    // Subclass connections
    { id: 'e-security-1', source: 'security', target: 'security-1', className: 'subclass-edge security', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
    { id: 'e-security-2', source: 'security', target: 'security-2', className: 'subclass-edge security', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
    { id: 'e-teaching-1', source: 'teaching', target: 'teaching-1', className: 'subclass-edge teaching', style: { stroke: '#22c55e', strokeWidth: 1.5 } },
    { id: 'e-digital-1', source: 'digital', target: 'digital-1', className: 'subclass-edge culinary', style: { stroke: '#f59e0b', strokeWidth: 1.5 } },
    { id: 'e-entrepreneur-1', source: 'entrepreneurship', target: 'entrepreneur-1', className: 'subclass-edge entrepreneur', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
    
    // Cross-skill connections
    { id: 'e-cross-1', source: 'security-2', target: 'teaching-1', style: { stroke: 'rgba(148, 163, 184, 0.6)', strokeDasharray: '5,5', strokeWidth: 1.5 }, className: 'cross-edge' },
    { id: 'e-cross-2', source: 'digital-1', target: 'entrepreneur-1', style: { stroke: 'rgba(148, 163, 184, 0.6)', strokeDasharray: '5,5', strokeWidth: 1.5 }, className: 'cross-edge' },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  return (
    <div className="rpg-card w-full h-[500px] bg-gradient-to-br from-white/60 to-white/20 dark:from-cyber-navy/60 dark:to-cyber-navy/20 backdrop-blur-sm border rounded-md overflow-hidden shadow-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        minZoom={0.5}
        maxZoom={1.5}
        className="skill-tree-flow"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#ccc" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ClassPathways;
