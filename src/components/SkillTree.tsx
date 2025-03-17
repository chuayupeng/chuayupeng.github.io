
import React from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SkillNode, SkillNodeData } from './skill-tree/SkillNode';
import { initialNodes, initialEdges } from './skill-tree/initialElements';

// Define custom node types with proper typing
const nodeTypes: NodeTypes = {
  skillNode: SkillNode,
};

const SkillTree = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden border bg-white dark:bg-cyber-navy">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        className="rpg-skill-tree"
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <Panel position="top-center" className="bg-transparent">
          <h3 className="text-lg font-bold mb-2 text-center">Class Pathways</h3>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default SkillTree;
