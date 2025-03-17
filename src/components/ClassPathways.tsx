
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
  ArrowRight
} from 'lucide-react';

// Define the node data interface
interface ClassNodeData {
  label: string;
  icon?: string;
  description?: string;
  rarity?: string;
  category?: string;
}

// Custom node component - simplified version with less content
const ClassNode = ({ data }: { data: ClassNodeData }) => {
  let IconComponent;
  
  switch (data.icon) {
    case 'Shield': IconComponent = Shield; break;
    case 'BookOpen': IconComponent = BookOpen; break;
    case 'ChefHat': IconComponent = ChefHat; break;
    case 'Terminal': IconComponent = Terminal; break;
    case 'VenetianMask': IconComponent = VenetianMask; break;
    case 'Database': IconComponent = Database; break;
    case 'Code': IconComponent = Code; break;
    case 'BugPlay': IconComponent = BugPlay; break;
    case 'Server': IconComponent = Server; break;
    case 'FileCode': IconComponent = FileCode; break;
    case 'Network': IconComponent = Network; break;
    case 'ArrowRight': IconComponent = ArrowRight; break;
    default: IconComponent = Shield;
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
      className={`p-3 shadow-md rounded-md w-[140px] backdrop-blur-sm transition-transform 
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
        <div className="flex gap-0.5">
          {[...Array(starsCount)].map((_, i) => (
            <Star 
              key={i} 
              size={12} 
              className="text-yellow-400 fill-yellow-400" 
            />
          ))}
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
  
  // Redesigned layout with wider spacing to avoid overlaps
  const initialNodes: Node<ClassNodeData>[] = [
    // Main character node
    {
      id: 'main',
      type: 'classNode',
      data: { 
        label: 'Chua Yu Peng',
        icon: 'VenetianMask',
        description: 'Security Professional',
      },
      position: { x: 800, y: 300 },
      className: 'main-node'
    },
    
    // Primary class specializations - positioned in a cross pattern with more space
    {
      id: 'security',
      type: 'classNode',
      data: { 
        label: 'Security Mage', 
        icon: 'Shield',
        description: 'Information Security',
        rarity: 'Legendary',
        category: 'security',
      },
      position: { x: 500, y: 300 },
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
      },
      position: { x: 800, y: 100 },
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
      },
      position: { x: 1100, y: 300 },
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
      },
      position: { x: 800, y: 500 },
      className: 'class-node entrepreneur'
    },
    
    // Subclasses and specializations - positioned with much more space
    {
      id: 'security-1',
      type: 'classNode',
      data: { 
        label: 'Red Team Operator', 
        icon: 'BugPlay',
        description: 'Offensive Security',
        category: 'security',
      },
      position: { x: 200, y: 150 },
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
      },
      position: { x: 200, y: 450 },
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
      },
      position: { x: 500, y: 50 },
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
      },
      position: { x: 1400, y: 150 },
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
      },
      position: { x: 1400, y: 450 },
      className: 'subclass-node entrepreneur'
    },
  ];

  // Enhanced edges with better styling and spacing
  const initialEdges: Edge[] = [
    // Main connections to primary classes
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
    
    // Subclass connections 
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
    
    // Additional connections between subclasses to form a web
    { 
      id: 'e-sec1-teach1', 
      source: 'security-1', 
      target: 'teaching-1',
      style: { stroke: 'rgba(148, 163, 184, 0.4)', strokeDasharray: '5,5', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.6)' }
    },
    { 
      id: 'e-sec2-digital1', 
      source: 'security-2', 
      target: 'digital-1',
      style: { stroke: 'rgba(148, 163, 184, 0.4)', strokeDasharray: '5,5', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.6)' }
    },
    { 
      id: 'e-ent1-sec1', 
      source: 'entrepreneur-1', 
      target: 'security-1',
      style: { stroke: 'rgba(148, 163, 184, 0.4)', strokeDasharray: '5,5', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.6)' }
    },
    { 
      id: 'e-digital1-ent1', 
      source: 'digital-1', 
      target: 'entrepreneur-1',
      style: { stroke: 'rgba(148, 163, 184, 0.4)', strokeDasharray: '5,5', strokeWidth: 1.5 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.6)' }
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Use useEffect to ensure proper positioning on initial load
  useEffect(() => {
    // Initial fit view with a wider padding
    const timer = setTimeout(() => {
      if (flowRef.current) {
        const flowInstance = flowRef.current;
        flowInstance.fitView({ padding: 0.3, includeHiddenNodes: false });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="rpg-skill-tree w-full h-[700px] bg-gradient-to-br from-white/40 to-white/10 dark:from-cyber-navy/40 dark:to-cyber-navy/10 backdrop-blur-sm border rounded-md overflow-hidden shadow-lg">
      <ReactFlow
        ref={flowRef}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.4}
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
