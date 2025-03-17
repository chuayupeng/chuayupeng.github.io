
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Shield, BookOpen, ChefHat, Terminal, VenetianMask, Star } from 'lucide-react';

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
    <div className={`p-3 min-w-[120px] max-w-[180px] shadow-md rounded-md bg-white dark:bg-cyber-navy border ${
      data.icon === 'VenetianMask' ? 'border-cyber-cyan' : 'border-gray-200 dark:border-gray-700'
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
        <strong className="text-foreground">{data.label}</strong>
      </div>
      
      {data.description && (
        <p className="text-xs text-muted-foreground mb-2">{data.description}</p>
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
          <span className="text-xs text-muted-foreground">
            {data.rarity}
          </span>
        </div>
      )}
      
      {data.experiences && data.experiences.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs font-medium mb-1">Experiences:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
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
        label: 'Character',
        icon: 'VenetianMask',
        description: 'Multi-class adventurer',
        experiences: ['Web Developer', 'Security Specialist', 'Teacher', 'Food Enthusiast']
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
        description: 'Masters of defense magic',
        rarity: 'Legendary',
        experiences: ['OSCP Certification', 'OSWE Certification', 'Web App Penetration Testing', 'Red Team Operations']
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
        description: 'Wielders of ancient wisdom',
        rarity: 'Epic',
        experiences: ['Technical Training', 'Workshop Facilitation', 'Curriculum Development', 'Mentoring']
      },
      position: { x: 300, y: 50 },
      className: 'class-node teaching'
    },
    {
      id: 'culinary',
      type: 'classNode',
      data: { 
        label: 'Culinary Alchemist', 
        icon: 'ChefHat',
        description: 'Creates powerful consumables',
        rarity: 'Rare',
        experiences: ['Food Safety Certification', 'Restaurant Management', 'Recipe Development', 'Ingredient Sourcing']
      },
      position: { x: 500, y: 100 },
      className: 'class-node culinary'
    },
    {
      id: 'entrepreneurship',
      type: 'classNode',
      data: { 
        label: 'Guild Master', 
        icon: 'Terminal',
        description: 'Leaders who build guilds',
        rarity: 'Epic',
        experiences: ['Project Management', 'Business Development', 'Team Leadership', 'Strategic Planning'] 
      },
      position: { x: 500, y: 350 },
      className: 'class-node entrepreneur'
    },
    
    // Subclasses and specializations
    {
      id: 'security-1',
      type: 'classNode',
      data: { 
        label: 'Penetration Tester', 
        description: 'Identifies vulnerabilities',
        experiences: ['Network Testing', 'Web Application Testing', 'Mobile Security']
      },
      position: { x: 0, y: 200 },
      className: 'subclass-node security'
    },
    {
      id: 'security-2',
      type: 'classNode',
      data: { 
        label: 'Web Security Expert', 
        description: 'Application exploit specialist',
        experiences: ['Authentication Bypasses', 'XSS Protection', 'SQL Injection Prevention']
      },
      position: { x: 150, y: 200 },
      className: 'subclass-node security'
    },
    {
      id: 'teaching-1',
      type: 'classNode',
      data: { 
        label: 'Technical Instructor', 
        description: 'Transfer complex knowledge',
        experiences: ['Cybersecurity Training', 'Programming Workshops', 'Knowledge Transfer']
      },
      position: { x: 300, y: 150 },
      className: 'subclass-node teaching'
    },
    {
      id: 'culinary-1',
      type: 'classNode',
      data: { 
        label: 'Food Safety Officer', 
        description: 'Ensures potion quality',
        experiences: ['HACCP Implementation', 'Food Safety Culture', 'Compliance Management']
      },
      position: { x: 450, y: 200 },
      className: 'subclass-node culinary'
    },
    {
      id: 'entrepreneur-1',
      type: 'classNode',
      data: { 
        label: 'Venture Builder', 
        description: 'Creates new guild outposts',
        experiences: ['Startup Advisory', 'Business Planning', 'Market Analysis']
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
    { id: 'e-main-culinary', source: 'main', target: 'culinary', animated: true, className: 'primary-edge culinary', style: { stroke: '#f59e0b', strokeWidth: 2 } },
    { id: 'e-main-entrepreneur', source: 'main', target: 'entrepreneurship', animated: true, className: 'primary-edge entrepreneur', style: { stroke: '#a855f7', strokeWidth: 2 } },
    
    // Subclass connections
    { id: 'e-security-1', source: 'security', target: 'security-1', className: 'subclass-edge security', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
    { id: 'e-security-2', source: 'security', target: 'security-2', className: 'subclass-edge security', style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
    { id: 'e-teaching-1', source: 'teaching', target: 'teaching-1', className: 'subclass-edge teaching', style: { stroke: '#22c55e', strokeWidth: 1.5 } },
    { id: 'e-culinary-1', source: 'culinary', target: 'culinary-1', className: 'subclass-edge culinary', style: { stroke: '#f59e0b', strokeWidth: 1.5 } },
    { id: 'e-entrepreneur-1', source: 'entrepreneurship', target: 'entrepreneur-1', className: 'subclass-edge entrepreneur', style: { stroke: '#a855f7', strokeWidth: 1.5 } },
    
    // Cross-skill connections
    { id: 'e-cross-1', source: 'security-2', target: 'teaching-1', style: { stroke: '#94a3b8', strokeDasharray: '5,5', strokeWidth: 1.5 }, className: 'cross-edge' },
    { id: 'e-cross-2', source: 'culinary-1', target: 'entrepreneur-1', style: { stroke: '#94a3b8', strokeDasharray: '5,5', strokeWidth: 1.5 }, className: 'cross-edge' },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  return (
    <div className="rpg-card w-full h-[500px] bg-white dark:bg-cyber-navy border rounded-md overflow-hidden">
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
        <MiniMap 
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            switch (node.data?.icon) {
              case 'Shield': return '#3b82f6';
              case 'BookOpen': return '#22c55e';
              case 'ChefHat': return '#f59e0b';
              case 'Terminal': return '#a855f7';
              case 'VenetianMask': return '#06b6d4';
              default: return '#94a3b8';
            }
          }}
        />
      </ReactFlow>
    </div>
  );
};

export default ClassPathways;
