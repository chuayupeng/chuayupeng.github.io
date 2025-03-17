
import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Shield, BookOpen, ChefHat, Terminal } from 'lucide-react';

// Initial graph data
const initialNodes = [
  // Main character node (center)
  {
    id: 'main',
    type: 'special',
    data: { 
      label: 'Character Build',
      icon: 'VenetianMask',
      description: 'Multi-class adventurer'
    },
    position: { x: 300, y: 200 },
    className: 'main-node'
  },
  
  // Primary class specializations
  {
    id: 'security',
    type: 'special',
    data: { 
      label: 'Security Mage', 
      icon: 'Shield',
      description: 'Masters of defense magic',
      rarity: 'Legendary'
    },
    position: { x: 100, y: 50 },
    className: 'class-node security'
  },
  {
    id: 'teaching',
    type: 'special',
    data: { 
      label: 'Knowledge Sage', 
      icon: 'BookOpen',
      description: 'Wielders of ancient wisdom',
      rarity: 'Epic'
    },
    position: { x: 300, y: 50 },
    className: 'class-node teaching'
  },
  {
    id: 'culinary',
    type: 'special',
    data: { 
      label: 'Culinary Alchemist', 
      icon: 'ChefHat',
      description: 'Creates powerful consumables',
      rarity: 'Rare'
    },
    position: { x: 500, y: 50 },
    className: 'class-node culinary'
  },
  {
    id: 'entrepreneurship',
    type: 'special',
    data: { 
      label: 'Guild Master', 
      icon: 'Terminal',
      description: 'Leaders who build guilds',
      rarity: 'Epic'
    },
    position: { x: 600, y: 200 },
    className: 'class-node entrepreneur'
  },
  
  // Subclasses and specializations
  {
    id: 'security-1',
    data: { 
      label: 'Penetration Tester', 
      description: 'Identifies vulnerabilities'
    },
    position: { x: 0, y: 150 },
    className: 'subclass-node security'
  },
  {
    id: 'security-2',
    data: { 
      label: 'Web Security Expert', 
      description: 'Application exploit specialist'
    },
    position: { x: 150, y: 150 },
    className: 'subclass-node security'
  },
  {
    id: 'teaching-1',
    data: { 
      label: 'Technical Instructor', 
      description: 'Transfer complex knowledge'
    },
    position: { x: 300, y: 150 },
    className: 'subclass-node teaching'
  },
  {
    id: 'culinary-1',
    data: { 
      label: 'Food Safety Officer', 
      description: 'Ensures potion quality'
    },
    position: { x: 450, y: 150 },
    className: 'subclass-node culinary'
  },
  {
    id: 'entrepreneur-1',
    data: { 
      label: 'Venture Builder', 
      description: 'Creates new guild outposts'
    },
    position: { x: 600, y: 100 },
    className: 'subclass-node entrepreneur'
  },
];

const initialEdges = [
  // Main connections to primary classes
  { id: 'e-main-security', source: 'main', target: 'security', animated: true, className: 'primary-edge security' },
  { id: 'e-main-teaching', source: 'main', target: 'teaching', animated: true, className: 'primary-edge teaching' },
  { id: 'e-main-culinary', source: 'main', target: 'culinary', animated: true, className: 'primary-edge culinary' },
  { id: 'e-main-entrepreneur', source: 'main', target: 'entrepreneurship', animated: true, className: 'primary-edge entrepreneur' },
  
  // Subclass connections
  { id: 'e-security-1', source: 'security', target: 'security-1', className: 'subclass-edge security' },
  { id: 'e-security-2', source: 'security', target: 'security-2', className: 'subclass-edge security' },
  { id: 'e-teaching-1', source: 'teaching', target: 'teaching-1', className: 'subclass-edge teaching' },
  { id: 'e-culinary-1', source: 'culinary', target: 'culinary-1', className: 'subclass-edge culinary' },
  { id: 'e-entrepreneur-1', source: 'entrepreneurship', target: 'entrepreneur-1', className: 'subclass-edge entrepreneur' },
  
  // Cross-skill connections
  { id: 'e-cross-1', source: 'security-2', target: 'teaching-1', style: { strokeDasharray: '5,5' }, className: 'cross-edge' },
  { id: 'e-cross-2', source: 'culinary-1', target: 'entrepreneur-1', style: { strokeDasharray: '5,5' }, className: 'cross-edge' },
];

// Custom node component
const SpecialNode = ({ data }: { data: any }) => {
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
    default:
      IconComponent = Shield;
  }
  
  return (
    <div className="p-2 min-w-[120px]">
      <div className="flex items-center gap-2">
        {IconComponent && <IconComponent className="w-4 h-4" />}
        <strong>{data.label}</strong>
      </div>
      {data.description && (
        <p className="text-xs text-muted-foreground mt-1">{data.description}</p>
      )}
      {data.rarity && (
        <span className="text-xs inline-block mt-1 px-2 py-0.5 bg-accent/20 rounded-full">
          {data.rarity}
        </span>
      )}
    </div>
  );
};

// Node types definition
const nodeTypes = {
  special: SpecialNode,
};

const ClassPathways = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const onConnect = useCallback((params: any) => 
    setEdges((eds) => addEdge(params, eds)),
  []);
  
  return (
    <div className="rpg-card w-full h-[400px] bg-white dark:bg-cyber-navy border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        minZoom={0.5}
        className="skill-tree-flow"
      >
        <Background color="#ccc" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default ClassPathways;
