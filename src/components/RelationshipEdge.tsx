'use client';

import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, EdgeProps, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import type { RelationshipEdge as RelationshipEdgeType } from '@/types/flow';

interface CustomEdgeProps extends EdgeProps {
  sourcePosition: Position;
  targetPosition: Position;
}

const RelationshipEdgeComponent = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition = Position.Right,
  targetPosition = Position.Left,
  type,
  data,
  selected,
}: CustomEdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getCardinalitySymbol = (type: string, isSource: boolean) => {
    switch (type) {
      case 'one-to-one':
        return isSource ? '1' : '1';
      case 'one-to-many':
        return isSource ? '1' : 'N';
      case 'many-to-many':
        return isSource ? 'N' : 'N';
      default:
        return isSource ? '1' : 'N';
    }
  };

  const getArrowMarker = (type: string, isSource: boolean) => {
    const suffix = isSource ? '-source' : '';

    switch (type) {
      case 'one-to-one':
        return `url(#arrow-one-to-one${suffix})`;
      case 'one-to-many':
        return `url(#arrow-one-to-many${suffix})`;
      case 'many-to-many':
        return `url(#arrow-many-to-many${suffix})`;
      default:
        return `url(#arrow-default${suffix})`;
    }
  };

  const getSourceArrow = () => {
    switch (type) {
      case 'many-to-many':
        return 'url(#source-many)';
      case 'one-to-many':
        return 'url(#source-one)';
      default:
        return 'url(#source-default)';
    }
  };

  return (
    <>
      {/* Main edge line */}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={getArrowMarker(type || 'one-to-many', false)}
        markerStart={getSourceArrow()}
        style={{
          stroke: selected ? '#3b82f6' : '#6b7280',
          strokeWidth: selected ? 3 : 2,
        }}
      />

      {/* Edge label with cardinality */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[100px]">
            <div className="flex items-center justify-center gap-2 text-xs mb-1">
              <Badge variant="outline" className="text-xs">
                {getCardinalitySymbol(type || 'one-to-many', true)}
              </Badge>
              <span className="font-medium text-gray-700">
                {data?.name ? String(data.name) : 'has'}
              </span>
              <Badge variant="outline" className="text-xs">
                {getCardinalitySymbol(type || 'one-to-many', false)}
              </Badge>
            </div>

            {/* Relationship details */}
            <div className="text-xs text-gray-500 space-y-1">
              {data?.onDelete && (
                <div>On Delete: <span className="font-medium">{data.onDelete}</span></div>
              )}
              {data?.onUpdate && (
                <div>On Update: <span className="font-medium">{data.onUpdate}</span></div>
              )}
            </div>

            {/* Action buttons when selected */}
            {selected && (
              <div className="flex gap-1 mt-2 pt-2 border-t border-gray-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-red-500"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export const RelationshipEdge = memo(RelationshipEdgeComponent);

RelationshipEdge.displayName = 'RelationshipEdge';
