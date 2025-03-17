
import { Node, Edge, Position } from '@xyflow/react';
import { SkillNodeData } from './SkillNode';

// Define nodes with proper typing
export const initialNodes: Node<SkillNodeData>[] = [
  {
    id: 'character',
    type: 'skillNode',
    data: {
      label: 'Character',
      description: 'Your starting point',
      level: 1,
      maxLevel: 1,
      unlocked: true,
      progress: 100,
      category: 'character'
    },
    position: { x: 250, y: 0 }
  },
  {
    id: 'warrior',
    type: 'skillNode',
    data: {
      label: 'Warrior',
      description: 'Master of combat',
      level: 0,
      maxLevel: 5,
      unlocked: false,
      progress: 0,
      category: 'combat'
    },
    position: { x: 50, y: 150 }
  },
  {
    id: 'mage',
    type: 'skillNode',
    data: {
      label: 'Mage',
      description: 'Master of arcane',
      level: 0,
      maxLevel: 5,
      unlocked: false,
      progress: 0,
      category: 'magic'
    },
    position: { x: 250, y: 150 }
  },
  {
    id: 'rogue',
    type: 'skillNode',
    data: {
      label: 'Rogue',
      description: 'Master of stealth',
      level: 0,
      maxLevel: 5,
      unlocked: false,
      progress: 0,
      category: 'stealth'
    },
    position: { x: 450, y: 150 }
  },
  {
    id: 'berserker',
    type: 'skillNode',
    data: {
      label: 'Berserker',
      description: 'Unleash fury',
      level: 0,
      maxLevel: 3,
      unlocked: false,
      progress: 0,
      category: 'combat'
    },
    position: { x: 0, y: 300 }
  },
  {
    id: 'knight',
    type: 'skillNode',
    data: {
      label: 'Knight',
      description: 'Defensive specialist',
      level: 0,
      maxLevel: 3,
      unlocked: false,
      progress: 0,
      category: 'combat'
    },
    position: { x: 150, y: 300 }
  },
  {
    id: 'elementalist',
    type: 'skillNode',
    data: {
      label: 'Elementalist',
      description: 'Master of elements',
      level: 0,
      maxLevel: 3,
      unlocked: false,
      progress: 0,
      category: 'magic'
    },
    position: { x: 300, y: 300 }
  },
  {
    id: 'assassin',
    type: 'skillNode',
    data: {
      label: 'Assassin',
      description: 'Silent killer',
      level: 0,
      maxLevel: 3,
      unlocked: false,
      progress: 0,
      category: 'stealth'
    },
    position: { x: 450, y: 300 }
  }
];

// Define edges
export const initialEdges: Edge[] = [
  { id: 'e-char-warrior', source: 'character', target: 'warrior', animated: true },
  { id: 'e-char-mage', source: 'character', target: 'mage', animated: true },
  { id: 'e-char-rogue', source: 'character', target: 'rogue', animated: true },
  { id: 'e-warrior-berserker', source: 'warrior', target: 'berserker' },
  { id: 'e-warrior-knight', source: 'warrior', target: 'knight' },
  { id: 'e-mage-elementalist', source: 'mage', target: 'elementalist' },
  { id: 'e-rogue-assassin', source: 'rogue', target: 'assassin' }
];
