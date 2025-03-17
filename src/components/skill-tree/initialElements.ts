
import { MarkerType } from '@xyflow/react';

// Define the node positions with a clear hierarchy
const nodeWidth = 180;
const nodeHeight = 100;
const xGap = 240;
const yGap = 150;

// Calculate coordinates for proper spacing
const centerX = 0;
const topY = 0;
const level1Y = topY + yGap;
const level2Y = level1Y + yGap;

export const initialNodes = [
  // Main character node
  {
    id: 'main',
    type: 'skillNode',
    position: { x: centerX - nodeWidth / 2, y: topY },
    data: {
      label: 'Character Build',
      icon: 'mask',
      description: 'Multi-class adventurer',
      rarity: 'Unique',
      color: 'cyan',
      isMain: true,
      outputs: true
    },
    className: 'animate-pulse-glow'
  },
  
  // Primary class nodes
  {
    id: 'security',
    type: 'skillNode',
    position: { x: centerX - xGap - nodeWidth / 2, y: level1Y },
    data: {
      label: 'Security Mage',
      icon: 'shield',
      description: 'Masters of defense magic',
      rarity: 'Legendary',
      color: 'blue',
      inputs: true,
      outputs: true,
      outputRight: true
    }
  },
  {
    id: 'teaching',
    type: 'skillNode',
    position: { x: centerX - nodeWidth / 2, y: level1Y },
    data: {
      label: 'Knowledge Sage',
      icon: 'book',
      description: 'Wielders of ancient wisdom',
      rarity: 'Epic',
      color: 'green',
      inputs: true,
      outputs: true,
      outputLeft: true,
      outputRight: true
    }
  },
  {
    id: 'culinary',
    type: 'skillNode',
    position: { x: centerX + xGap - nodeWidth / 2, y: level1Y },
    data: {
      label: 'Culinary Alchemist',
      icon: 'chef',
      description: 'Creates powerful consumables',
      rarity: 'Rare',
      color: 'amber',
      inputs: true,
      outputs: true,
      outputLeft: true
    }
  },
  
  // Subclass nodes
  {
    id: 'security-1',
    type: 'skillNode',
    position: { x: centerX - xGap - nodeWidth / 2 - 100, y: level2Y },
    data: {
      label: 'Penetration Tester',
      description: 'Identifies vulnerabilities',
      color: 'blue',
      inputs: true
    }
  },
  {
    id: 'security-2',
    type: 'skillNode',
    position: { x: centerX - xGap - nodeWidth / 2 + 100, y: level2Y },
    data: {
      label: 'Web Security Expert',
      description: 'Application exploit specialist',
      color: 'blue',
      inputs: true,
      outputRight: true
    }
  },
  {
    id: 'teaching-1',
    type: 'skillNode',
    position: { x: centerX - nodeWidth / 2, y: level2Y },
    data: {
      label: 'Technical Instructor',
      description: 'Transfer complex knowledge',
      color: 'green',
      inputs: true,
      outputLeft: true
    }
  },
  {
    id: 'culinary-1',
    type: 'skillNode',
    position: { x: centerX + xGap - nodeWidth / 2, y: level2Y },
    data: {
      label: 'Food Safety Officer',
      description: 'Ensures potion quality',
      color: 'amber',
      inputs: true,
      outputRight: true
    }
  },
  // Entrepreneurship group
  {
    id: 'entrepreneur',
    type: 'skillNode',
    position: { x: centerX + xGap*2 - nodeWidth / 2, y: level1Y },
    data: {
      label: 'Guild Master',
      icon: 'terminal',
      description: 'Leaders who build guilds',
      rarity: 'Epic',
      color: 'purple',
      inputs: true,
      outputs: true
    }
  },
  {
    id: 'entrepreneur-1',
    type: 'skillNode',
    position: { x: centerX + xGap*2 - nodeWidth / 2, y: level2Y },
    data: {
      label: 'Venture Builder',
      description: 'Creates new guild outposts',
      color: 'purple',
      inputs: true,
      outputLeft: true
    }
  },
];

export const initialEdges = [
  // Main to primary classes
  {
    id: 'main-to-security',
    source: 'main',
    target: 'security',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#38bdf8', strokeWidth: 3 }
  },
  {
    id: 'main-to-teaching',
    source: 'main',
    target: 'teaching',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#4ade80', strokeWidth: 3 }
  },
  {
    id: 'main-to-culinary',
    source: 'main',
    target: 'culinary',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#fbbf24', strokeWidth: 3 }
  },
  {
    id: 'main-to-entrepreneur',
    source: 'main',
    target: 'entrepreneur',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#a78bfa', strokeWidth: 3 }
  },
  
  // Primary to subclasses
  {
    id: 'security-to-pentester',
    source: 'security',
    target: 'security-1',
    type: 'smoothstep',
    style: { stroke: '#38bdf8', strokeWidth: 2 }
  },
  {
    id: 'security-to-websec',
    source: 'security',
    target: 'security-2',
    type: 'smoothstep',
    style: { stroke: '#38bdf8', strokeWidth: 2 }
  },
  {
    id: 'teaching-to-instructor',
    source: 'teaching',
    target: 'teaching-1',
    type: 'smoothstep',
    style: { stroke: '#4ade80', strokeWidth: 2 }
  },
  {
    id: 'culinary-to-safety',
    source: 'culinary',
    target: 'culinary-1',
    type: 'smoothstep',
    style: { stroke: '#fbbf24', strokeWidth: 2 }
  },
  {
    id: 'entrepreneur-to-venture',
    source: 'entrepreneur',
    target: 'entrepreneur-1',
    type: 'smoothstep',
    style: { stroke: '#a78bfa', strokeWidth: 2 }
  },
  
  // Cross-connections
  {
    id: 'websec-to-instructor',
    source: 'security-2',
    sourceHandle: 'right',
    target: 'teaching-1',
    targetHandle: 'left',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'url(#blue-to-green)', strokeWidth: 2, strokeDasharray: '5,5' },
  },
  {
    id: 'culinary-to-entrepreneur',
    source: 'culinary-1',
    sourceHandle: 'right',
    target: 'entrepreneur-1',
    targetHandle: 'left',
    type: 'smoothstep',
    animated: true,
    style: { stroke: 'url(#amber-to-purple)', strokeWidth: 2, strokeDasharray: '5,5' },
  },
];
