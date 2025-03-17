
import React, { useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Shield, BookOpen, ChefHat, Terminal, VenetianMask, Star,
  Database, Code, BugPlay, Server, FileCode, Network, 
  CornerRightDown, ArrowRight
} from 'lucide-react';

// Define the node data interface
interface ClassNodeData {
  label: string;
  icon?: string;
  description?: string;
  rarity?: string;
  level?: number;
  experiences?: string[];
  category?: string;
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
    case 'ArrowRight':
      IconComponent = ArrowRight;
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
  
  // Get category-specific styling
  const getCategoryStyles = () => {
    switch(data.category) {
      case 'security':
        return 'border-skill-security/40 from-skill-security/10 to-skill-security/5';
      case 'teaching':
        return 'border-skill-teaching/40 from-skill-teaching/10 to-skill-teaching/5';
      case 'digital':
        return 'border-skill-digital/40 from-skill-digital/10 to-skill-digital/5';
      case 'entrepreneur':
        return 'border-skill-entrepreneur/40 from-skill-entrepreneur/10 to-skill-entrepreneur/5';
      default:
        return data.icon === 'VenetianMask' 
          ? 'border-cyber-cyan/30 from-cyber-navy/40 to-cyber-dark-navy/40'
          : 'border-gray-200/50 from-white/40 to-white/20 dark:border-gray-700/50 dark:from-cyber-navy/40 dark:to-cyber-dark-navy/30';
    }
  };
  
  return (
    <div 
      className={`p-3 shadow-md rounded-md w-[160px] backdrop-blur-sm transition-transform 
      bg-gradient-to-br border ${getCategoryStyles()}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {IconComponent && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            data.category === 'security' ? 'bg-skill-security/20 text-skill-security' :
            data.category === 'teaching' ? 'bg-skill-teaching/20 text-skill-teaching' :
            data.category === 'digital' ? 'bg-skill-digital/20 text-skill-digital' :
            data.category === 'entrepreneur' ? 'bg-skill-entrepreneur/20 text-skill-entrepreneur' :
            data.icon === 'VenetianMask' ? 'bg-cyber-cyan/20 text-cyber-cyan' :
            'bg-gray-100/30 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400'
          }`}>
            <IconComponent className="w-4 h-4" />
          </div>
        )}
        <strong className="text-foreground dark:text-white text-sm">{data.label}</strong>
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
                className={i < starsCount ? "text-yellow-400 fill-yellow-400" : "text-gray-300/30 dark:text-gray-600/30"} 
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
  const flowRef = useRef(null);
  
  // Completely reorganized layout with precise positioning to avoid overlaps
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
      position: { x: 400, y: 300 },
      className: 'main-node'
    },
    
    // Primary class specializations - positioned in a diamond pattern around main node
    {
      id: 'security',
      type: 'classNode',
      data: { 
        label: 'Security Mage', 
        icon: 'Shield',
        description: 'Information Security Expert',
        rarity: 'Legendary',
        category: 'security',
        experiences: [
          'Penetration Testing', 
          'Red Team Operations', 
          'Vulnerability Research',
          'Cloud Security (Azure)'
        ]
      },
      position: { x: 200, y: 150 },
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
        category: 'teaching',
        experiences: [
          'BSc Computer Science (Security)',
          'Cybersecurity Advisor for Stealth Gaming',
          'Incident Response Team Training'
        ]
      },
      position: { x: 400, y: 50 },
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
        category: 'digital',
        experiences: [
          'Full Stack Development', 
          'React/Redux and Laravel',
          'Built internal security tools',
          'SemGrep Integration'
        ]
      },
      position: { x: 600, y: 150 },
      className: 'class-node digital'
    },
    {
      id: 'entrepreneurship',
      type: 'classNode',
      data: { 
        label: 'Security Consultant', 
        icon: 'Terminal',
        description: 'Independent Advisory',
        rarity: 'Epic',
        category: 'entrepreneur',
        experiences: [
          'ITSEC Asia Security Consultant',
          'Bug Bounty Hunter',
          'VAPT Services',
          'Security Reviews'
        ] 
      },
      position: { x: 400, y: 550 },
      className: 'class-node entrepreneur'
    },
    
    // Subclasses and specializations - positioned carefully to avoid overlapping
    {
      id: 'security-1',
      type: 'classNode',
      data: { 
        label: 'Red Team Operator', 
        icon: 'BugPlay',
        description: 'Offensive Security',
        category: 'security',
        experiences: ['Led red team engagements', 'Phishing simulations', 'Penetration testing', 'CRTO Certification (2021)']
      },
      position: { x: 50, y: 210 },
      className: 'subclass-node security'
    },
    {
      id: 'security-2',
      type: 'classNode',
      data: { 
        label: 'Product Security', 
        icon: 'Server',
        description: 'ByteDance/TikTok',
        category: 'security',
        experiences: ['10,000+ security reviews', 'Penetration tests', 'Discovered critical vulnerabilities', 'Red Teaming with Python']
      },
      position: { x: 190, y: 300 },
      className: 'subclass-node security'
    },
    {
      id: 'teaching-1',
      type: 'classNode',
      data: { 
        label: 'CSIRT Expert', 
        icon: 'FileCode',
        description: 'Digital & Intelligence',
        category: 'teaching',
        experiences: ['Incident Response team', 'Malware investigations', 'Attack scenarios', 'Splunk/Arkime/ELK']
      },
      position: { x: 310, y: 150 },
      className: 'subclass-node teaching'
    },
    {
      id: 'digital-1',
      type: 'classNode',
      data: { 
        label: 'Security Tooling', 
        icon: 'Database',
        description: 'Personal Projects',
        category: 'digital',
        experiences: ['CTF Team Leader (0x1EA7BEEF)', 'Freki XSS detector', 'DNS Tunneling Detection', 'CVSSv3 Classifier']
      },
      position: { x: 610, y: 300 },
      className: 'subclass-node digital'
    },
    {
      id: 'entrepreneur-1',
      type: 'classNode',
      data: { 
        label: 'Security Engineer', 
        icon: 'Network',
        description: 'Defence Science Tech',
        category: 'entrepreneur',
        experiences: ['VAPT services', 'System hardening', 'Compliance checks', 'Security assessment']
      },
      position: { x: 500, y: 450 },
      className: 'subclass-node entrepreneur'
    },
  ];

  // Define the edges between nodes with more consistent and sleek styling
  const initialEdges: Edge[] = [
    // Main connections to primary classes - animated, thicker, with arrow markers
    { 
      id: 'e-main-security', 
      source: 'main', 
      target: 'security', 
      animated: true,
      style: { stroke: 'rgba(59, 130, 246, 0.7)', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(59, 130, 246, 0.9)' }
    },
    { 
      id: 'e-main-teaching', 
      source: 'main', 
      target: 'teaching', 
      animated: true,
      style: { stroke: 'rgba(34, 197, 94, 0.7)', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(34, 197, 94, 0.9)' }
    },
    { 
      id: 'e-main-digital', 
      source: 'main', 
      target: 'digital', 
      animated: true,
      style: { stroke: 'rgba(245, 158, 11, 0.7)', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(245, 158, 11, 0.9)' }
    },
    { 
      id: 'e-main-entrepreneur', 
      source: 'main', 
      target: 'entrepreneurship', 
      animated: true,
      style: { stroke: 'rgba(168, 85, 247, 0.7)', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(168, 85, 247, 0.9)' }
    },
    
    // Subclass connections with consistent styling
    { 
      id: 'e-security-1', 
      source: 'security', 
      target: 'security-1',
      style: { stroke: 'rgba(59, 130, 246, 0.5)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(59, 130, 246, 0.7)' }
    },
    { 
      id: 'e-security-2', 
      source: 'security', 
      target: 'security-2',
      style: { stroke: 'rgba(59, 130, 246, 0.5)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(59, 130, 246, 0.7)' }
    },
    { 
      id: 'e-teaching-1', 
      source: 'teaching', 
      target: 'teaching-1',
      style: { stroke: 'rgba(34, 197, 94, 0.5)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(34, 197, 94, 0.7)' }
    },
    { 
      id: 'e-digital-1', 
      source: 'digital', 
      target: 'digital-1',
      style: { stroke: 'rgba(245, 158, 11, 0.5)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(245, 158, 11, 0.7)' }
    },
    { 
      id: 'e-entrepreneur-1', 
      source: 'entrepreneurship', 
      target: 'entrepreneur-1',
      style: { stroke: 'rgba(168, 85, 247, 0.5)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(168, 85, 247, 0.7)' }
    },
    
    // Cross-skill connections with a dashed line for interdisciplinary skills
    { 
      id: 'e-cross-1', 
      source: 'security-2', 
      target: 'teaching-1', 
      style: { stroke: 'rgba(148, 163, 184, 0.6)', strokeDasharray: '5,5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.8)' }
    },
    { 
      id: 'e-cross-2', 
      source: 'digital-1', 
      target: 'entrepreneur-1', 
      style: { stroke: 'rgba(148, 163, 184, 0.6)', strokeDasharray: '5,5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.8)' }
    },
    // Additional cross-connections to make the tree more cohesive
    { 
      id: 'e-cross-3', 
      source: 'security-1', 
      target: 'digital-1', 
      style: { stroke: 'rgba(148, 163, 184, 0.6)', strokeDasharray: '5,5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.8)' }
    },
    { 
      id: 'e-cross-4', 
      source: 'teaching-1', 
      target: 'entrepreneur-1', 
      style: { stroke: 'rgba(148, 163, 184, 0.6)', strokeDasharray: '5,5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.8)' }
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Use useEffect to ensure proper positioning on initial load
  useEffect(() => {
    // Wait for the flow to be rendered
    const timer = setTimeout(() => {
      if (flowRef.current) {
        const flowInstance = flowRef.current;
        flowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="rpg-skill-tree w-full h-[600px] bg-gradient-to-br from-white/40 to-white/10 dark:from-cyber-navy/40 dark:to-cyber-navy/10 backdrop-blur-sm border rounded-md overflow-hidden shadow-lg">
      <ReactFlow
        ref={flowRef}
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
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll={true}
      >
        <Background color="#ccc" gap={16} size={1} />
        <Controls showInteractive={false} />
        <Panel position="top-right" className="bg-white/80 dark:bg-cyber-navy/80 p-2 rounded backdrop-blur-sm text-xs">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-skill-security"></div>
              <span>Security</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-skill-teaching"></div>
              <span>Teaching</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-skill-digital"></div>
              <span>Digital</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-skill-entrepreneur"></div>
              <span>Consulting</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ClassPathways;
