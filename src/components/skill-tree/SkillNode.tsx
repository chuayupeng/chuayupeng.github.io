
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Progress } from "@/components/ui/progress";

// Define the expected data structure for our skill node
export interface SkillNodeData {
  label: string;
  description?: string;
  level?: number;
  maxLevel?: number;
  icon?: string;
  unlocked?: boolean;
  progress?: number;
  category?: string;
}

// Type for the node props including our custom data
export function SkillNode({ data, isConnectable }: NodeProps<SkillNodeData>) {
  const {
    label = "",
    description = "",
    level = 0,
    maxLevel = 5,
    unlocked = false,
    progress = 0,
    category = "default"
  } = data || {};

  return (
    <div className={`skill-node ${unlocked ? 'unlocked' : 'locked'} ${category}`}>
      <div className="skill-content p-3 flex flex-col gap-1">
        <div className="skill-header flex items-center justify-between">
          <h4 className="text-sm font-semibold">{label}</h4>
          {level > 0 && (
            <span className="text-xs px-1.5 py-0.5 bg-cyan-500/20 rounded-sm text-cyan-500">
              Lv {level}/{maxLevel}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        
        {progress > 0 && (
          <div className="mt-1">
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </div>
      
      {/* Connection points */}
      <Handle
        type="target"
        position={Position.Top}
        className="skill-handle"
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="skill-handle"
        isConnectable={isConnectable}
      />
    </div>
  );
}
