
import React from 'react';
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
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  GraduationCap, Shield, Sword, Hammer, Beaker, Search,
  BookOpen, Code, Bug, ServerCrash, Sparkles, Terminal,
  ChefHat, Building, Star, Microscope, UserSearch, FlaskConical,
  Martini, Factory, Anvil, Laptop, Construction, BugPlay
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the node data interface
interface SkillNodeData extends Record<string, unknown> {
  label: string;
  icon: string;
  description?: string;
  level?: number;
  category: string;
  isUnlocked?: boolean;
}

// Custom node component
const SkillNode = ({ data }: { data: SkillNodeData }) => {
  const IconMap: Record<string, React.ElementType> = {
    GraduationCap, Shield, Sword, Hammer, Beaker, Search,
    BookOpen, Code, Bug, ServerCrash, Sparkles, Terminal,
    ChefHat, Building, Star, Microscope, UserSearch, FlaskConical,
    Martini, Factory, Anvil, Laptop, Construction, BugPlay
  };
  
  const IconComponent = IconMap[data.icon] || Shield;
  
  // Get category-specific styling
  const getCategoryStyle = () => {
    switch(data.category) {
      case 'sage':
        return 'border-green-400/40 from-green-400/10 to-green-400/5 text-green-600 dark:text-green-400';
      case 'hacker':
        return 'border-blue-400/40 from-blue-400/10 to-blue-400/5 text-blue-600 dark:text-blue-400';
      case 'investigator':
        return 'border-purple-400/40 from-purple-400/10 to-purple-400/5 text-purple-600 dark:text-purple-400';
      case 'potion':
        return 'border-amber-400/40 from-amber-400/10 to-amber-400/5 text-amber-600 dark:text-amber-400';
      case 'blacksmith':
        return 'border-red-400/40 from-red-400/10 to-red-400/5 text-red-600 dark:text-red-400';
      default:
        return 'border-gray-200/50 from-white/40 to-white/20 dark:border-gray-700/50 dark:from-cyber-navy/40 dark:to-cyber-dark-navy/30 text-gray-600 dark:text-gray-400';
    }
  };
  
  const getIconBgStyle = () => {
    switch(data.category) {
      case 'sage': return 'bg-green-100 dark:bg-green-900/30';
      case 'hacker': return 'bg-blue-100 dark:bg-blue-900/30';
      case 'investigator': return 'bg-purple-100 dark:bg-purple-900/30';
      case 'potion': return 'bg-amber-100 dark:bg-amber-900/30';
      case 'blacksmith': return 'bg-red-100 dark:bg-red-900/30';
      default: return 'bg-gray-100 dark:bg-gray-800/30';
    }
  };
  
  return (
    <div 
      className={cn(
        'p-3 shadow-md rounded-md w-[160px] backdrop-blur-sm transition-transform',
        'bg-gradient-to-br border',
        getCategoryStyle(),
        data.isUnlocked === false ? 'opacity-50 grayscale' : 'hover:scale-105'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getIconBgStyle()}`}>
          <IconComponent className={`w-4 h-4 ${getCategoryStyle()}`} />
        </div>
        <strong className="text-foreground dark:text-white text-sm">{data.label}</strong>
      </div>
      
      {data.description && (
        <p className="text-xs text-muted-foreground dark:text-gray-300 mb-2">{data.description}</p>
      )}
      
      {data.level && (
        <div className="flex items-center gap-1 text-xs">
          <span>Level {data.level}</span>
          <div className="flex gap-0.5">
            {[...Array(data.level)].map((_, i) => (
              <Star 
                key={i} 
                size={10} 
                className="text-yellow-400 fill-yellow-400" 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Node types definition
const nodeTypes: NodeTypes = {
  skillNode: SkillNode,
};

interface SkillTreeProps {
  view: 'all' | 'sage' | 'hacker' | 'investigator' | 'potion' | 'blacksmith';
}

const SkillTree: React.FC<SkillTreeProps> = ({ view }) => {
  // Define nodes for all classes
  const initialNodes: Node<SkillNodeData>[] = [
    // Center node (Character)
    {
      id: 'character',
      type: 'skillNode',
      data: { 
        label: 'Chua Yu Peng',
        icon: 'Star',
        description: 'Multi-class professional',
        category: 'core',
        isUnlocked: true
      },
      position: { x: 500, y: 250 }
    },
    
    // Main class nodes - in a circle around character
    {
      id: 'sage-main',
      type: 'skillNode',
      data: { 
        label: 'Sage',
        icon: 'GraduationCap',
        description: 'Knowledge Keeper',
        level: 4,
        category: 'sage',
        isUnlocked: true
      },
      position: { x: 300, y: 100 }
    },
    {
      id: 'hacker-main',
      type: 'skillNode',
      data: { 
        label: 'Hacker',
        icon: 'Code',
        description: 'Digital Specialist',
        level: 5,
        category: 'hacker',
        isUnlocked: true
      },
      position: { x: 700, y: 100 }
    },
    {
      id: 'investigator-main',
      type: 'skillNode',
      data: { 
        label: 'Investigator',
        icon: 'Search',
        description: 'Digital Detective',
        level: 3,
        category: 'investigator',
        isUnlocked: true
      },
      position: { x: 200, y: 350 }
    },
    {
      id: 'potion-main',
      type: 'skillNode',
      data: { 
        label: 'Potion Master',
        icon: 'Beaker',
        description: 'Culinary Expert',
        level: 3,
        category: 'potion',
        isUnlocked: true
      },
      position: { x: 500, y: 450 }
    },
    {
      id: 'blacksmith-main',
      type: 'skillNode',
      data: { 
        label: 'Blacksmith',
        icon: 'Hammer',
        description: 'Builder & Founder',
        level: 4,
        category: 'blacksmith',
        isUnlocked: true
      },
      position: { x: 800, y: 350 }
    },
    
    // Sage subclass nodes
    {
      id: 'sage-1',
      type: 'skillNode',
      data: { 
        label: 'Mentor',
        icon: 'BookOpen',
        description: 'Teaching Assistant',
        level: 3,
        category: 'sage',
        isUnlocked: true
      },
      position: { x: 100, y: 50 }
    },
    {
      id: 'sage-2',
      type: 'skillNode',
      data: { 
        label: 'Scholar',
        icon: 'Terminal',
        description: 'Computer Science Teacher',
        level: 4,
        category: 'sage',
        isUnlocked: true
      },
      position: { x: 300, y: -50 }
    },
    
    // Hacker subclass nodes
    {
      id: 'hacker-1',
      type: 'skillNode',
      data: { 
        label: 'Red Team',
        icon: 'Sword',
        description: 'Offensive Security',
        level: 5,
        category: 'hacker',
        isUnlocked: true
      },
      position: { x: 700, y: -50 }
    },
    {
      id: 'hacker-2',
      type: 'skillNode',
      data: { 
        label: 'Blue Team',
        icon: 'Shield',
        description: 'Defensive Security',
        level: 4,
        category: 'hacker',
        isUnlocked: true
      },
      position: { x: 900, y: 50 }
    },
    
    // Investigator subclass nodes
    {
      id: 'investigator-1',
      type: 'skillNode',
      data: { 
        label: 'CSIRT Member',
        icon: 'Bug',
        description: 'Incident Response',
        level: 3,
        category: 'investigator',
        isUnlocked: true
      },
      position: { x: 0, y: 300 }
    },
    {
      id: 'investigator-2',
      type: 'skillNode',
      data: { 
        label: 'Forensic Analyst',
        icon: 'Microscope',
        description: 'Digital Evidence Examiner',
        level: 2,
        category: 'investigator',
        isUnlocked: true
      },
      position: { x: 100, y: 500 }
    },
    
    // Potion Master subclass nodes
    {
      id: 'potion-1',
      type: 'skillNode',
      data: { 
        label: 'Mixologist',
        icon: 'Martini',
        description: 'Cocktail Specialist',
        level: 3,
        category: 'potion',
        isUnlocked: true
      },
      position: { x: 400, y: 600 }
    },
    {
      id: 'potion-2',
      type: 'skillNode',
      data: { 
        label: 'Chef',
        icon: 'ChefHat',
        description: 'Food Preparation',
        level: 3,
        category: 'potion',
        isUnlocked: true
      },
      position: { x: 600, y: 600 }
    },
    
    // Blacksmith subclass nodes
    {
      id: 'blacksmith-1',
      type: 'skillNode',
      data: { 
        label: 'Founder',
        icon: 'Building',
        description: 'Entrepreneurship',
        level: 4,
        category: 'blacksmith',
        isUnlocked: true
      },
      position: { x: 1000, y: 300 }
    },
    {
      id: 'blacksmith-2',
      type: 'skillNode',
      data: { 
        label: 'Constructor',
        icon: 'Anvil',
        description: 'Building Secure Systems',
        level: 3,
        category: 'blacksmith',
        isUnlocked: true
      },
      position: { x: 900, y: 500 }
    },
  ];

  // Define edges connecting the nodes
  const initialEdges: Edge[] = [
    // Connect character to main classes
    { 
      id: 'e-char-sage', 
      source: 'character', 
      target: 'sage-main',
      animated: true,
      style: { stroke: 'rgba(74, 222, 128, 0.6)', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(74, 222, 128, 0.8)' } 
    },
    { 
      id: 'e-char-hacker', 
      source: 'character', 
      target: 'hacker-main',
      animated: true,
      style: { stroke: 'rgba(59, 130, 246, 0.6)', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(59, 130, 246, 0.8)' } 
    },
    { 
      id: 'e-char-investigator', 
      source: 'character', 
      target: 'investigator-main',
      animated: true,
      style: { stroke: 'rgba(168, 85, 247, 0.6)', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(168, 85, 247, 0.8)' } 
    },
    { 
      id: 'e-char-potion', 
      source: 'character', 
      target: 'potion-main',
      animated: true,
      style: { stroke: 'rgba(245, 158, 11, 0.6)', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(245, 158, 11, 0.8)' } 
    },
    { 
      id: 'e-char-blacksmith', 
      source: 'character', 
      target: 'blacksmith-main',
      animated: true,
      style: { stroke: 'rgba(239, 68, 68, 0.6)', strokeWidth: 3 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(239, 68, 68, 0.8)' } 
    },
    
    // Connect main classes to their subclasses
    // Sage connections
    { 
      id: 'e-sage-1', 
      source: 'sage-main', 
      target: 'sage-1',
      style: { stroke: 'rgba(74, 222, 128, 0.4)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(74, 222, 128, 0.6)' } 
    },
    { 
      id: 'e-sage-2', 
      source: 'sage-main', 
      target: 'sage-2',
      style: { stroke: 'rgba(74, 222, 128, 0.4)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(74, 222, 128, 0.6)' } 
    },
    
    // Hacker connections
    { 
      id: 'e-hacker-1', 
      source: 'hacker-main', 
      target: 'hacker-1',
      style: { stroke: 'rgba(59, 130, 246, 0.4)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(59, 130, 246, 0.6)' } 
    },
    { 
      id: 'e-hacker-2', 
      source: 'hacker-main', 
      target: 'hacker-2',
      style: { stroke: 'rgba(59, 130, 246, 0.4)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(59, 130, 246, 0.6)' } 
    },
    
    // Investigator connections
    { 
      id: 'e-investigator-1', 
      source: 'investigator-main', 
      target: 'investigator-1',
      style: { stroke: 'rgba(168, 85, 247, 0.4)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(168, 85, 247, 0.6)' } 
    },
    { 
      id: 'e-investigator-2', 
      source: 'investigator-main', 
      target: 'investigator-2',
      style: { stroke: 'rgba(168, 85, 247, 0.4)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(168, 85, 247, 0.6)' } 
    },
    
    // Potion Master connections
    { 
      id: 'e-potion-1', 
      source: 'potion-main', 
      target: 'potion-1',
      style: { stroke: 'rgba(245, 158, 11, 0.4)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(245, 158, 11, 0.6)' } 
    },
    { 
      id: 'e-potion-2', 
      source: 'potion-main', 
      target: 'potion-2',
      style: { stroke: 'rgba(245, 158, 11, 0.4)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(245, 158, 11, 0.6)' } 
    },
    
    // Blacksmith connections
    { 
      id: 'e-blacksmith-1', 
      source: 'blacksmith-main', 
      target: 'blacksmith-1',
      style: { stroke: 'rgba(239, 68, 68, 0.4)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(239, 68, 68, 0.6)' } 
    },
    { 
      id: 'e-blacksmith-2', 
      source: 'blacksmith-main', 
      target: 'blacksmith-2',
      style: { stroke: 'rgba(239, 68, 68, 0.4)', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(239, 68, 68, 0.6)' } 
    },
    
    // Cross-class connections (dotted lines between different classes)
    { 
      id: 'e-hacker-to-investigator', 
      source: 'hacker-1', 
      target: 'investigator-1',
      style: { stroke: 'rgba(148, 163, 184, 0.5)', strokeDasharray: '5,5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.7)' } 
    },
    { 
      id: 'e-blacksmith-to-hacker', 
      source: 'blacksmith-1', 
      target: 'hacker-2',
      style: { stroke: 'rgba(148, 163, 184, 0.5)', strokeDasharray: '5,5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.7)' } 
    },
    { 
      id: 'e-sage-to-potion', 
      source: 'sage-2', 
      target: 'potion-2',
      style: { stroke: 'rgba(148, 163, 184, 0.5)', strokeDasharray: '5,5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.7)' } 
    },
    
    // Additional cross-class connections (more dotted lines)
    { 
      id: 'e-sage-to-investigator', 
      source: 'sage-1', 
      target: 'investigator-2',
      style: { stroke: 'rgba(148, 163, 184, 0.5)', strokeDasharray: '5,5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.7)' } 
    },
    { 
      id: 'e-blacksmith-to-potion', 
      source: 'blacksmith-2', 
      target: 'potion-1',
      style: { stroke: 'rgba(148, 163, 184, 0.5)', strokeDasharray: '5,5', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148, 163, 184, 0.7)' } 
    },
  ];
  
  // Filter nodes and edges based on the selected view
  const filterGraph = () => {
    if (view === 'all') {
      return { nodes: initialNodes, edges: initialEdges };
    }
    
    // Keep only nodes of the selected category and the character node
    const filteredNodes = initialNodes.filter(node => 
      node.data.category === view || node.id === 'character'
    );
    
    // Get IDs of filtered nodes
    const nodeIds = filteredNodes.map(node => node.id);
    
    // Keep only edges that connect the filtered nodes
    const filteredEdges = initialEdges.filter(edge => 
      nodeIds.includes(edge.source) && nodeIds.includes(edge.target)
    );
    
    return { nodes: filteredNodes, edges: filteredEdges };
  };
  
  const { nodes: filteredNodes, edges: filteredEdges } = filterGraph();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(filteredNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(filteredEdges);
  
  // Update nodes and edges when view changes
  React.useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = filterGraph();
    setNodes(newNodes);
    setEdges(newEdges);
  }, [view, setNodes, setEdges]);
  
  return (
    <div className="rpg-skill-tree w-full h-[600px] bg-gradient-to-br from-white/40 to-white/10 dark:from-cyber-navy/40 dark:to-cyber-navy/10 backdrop-blur-sm border rounded-md overflow-hidden shadow-lg">
      <ReactFlow
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
        zoomOnScroll={true}
        panOnScroll={true}
      >
        <Background color="#ccc" gap={16} size={1} />
        <Controls showInteractive={false} />
        <Panel position="top-right" className="bg-white/80 dark:bg-cyber-navy/80 p-2 rounded backdrop-blur-sm text-xs">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Sage</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span>Hacker</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span>Investigator</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <span>Potion Master</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>Blacksmith</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default SkillTree;
