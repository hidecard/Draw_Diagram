'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { Column } from '@/types/flow';

interface TableNodeData {
  name: string;
  columns: Column[];
  color: string;
}

interface TableNodeProps extends NodeProps<TableNodeData> {
  onDelete?: (nodeId: string) => void;
  onEdit?: (nodeId: string) => void;
}

export const TableNode = memo(({ id, data, selected, onDelete, onEdit }: TableNodeProps) => {
  const { name, columns, color } = data;

  const getHandleId = (columnId: string) => `${id}-${columnId}`;

  return (
    <Card 
      className={`min-w-[250px] ${selected ? 'ring-2 ring-blue-500' : ''}`}
      style={{ backgroundColor: '#ffffff' }}
    >
      <CardHeader 
        className="pb-2"
        style={{ backgroundColor: color || '#3b82f6' }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">{name}</h3>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={() => onEdit?.(id)}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={() => onDelete?.(id)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-1">
          {columns.map((column, index) => (
            <div
              key={column.id}
              className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm font-medium truncate">
                  {column.isPrimaryKey ? '🔑' : column.isForeignKey ? '🔗' : '  '}
                  {column.name}
                </span>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {column.type}
                </Badge>
                {column.isPrimaryKey && (
                  <Badge variant="default" className="text-xs flex-shrink-0">PK</Badge>
                )}
                {column.isForeignKey && (
                  <Badge variant="secondary" className="text-xs flex-shrink-0">FK</Badge>
                )}
              </div>
              
              {/* Handles for connections */}
              {column.isPrimaryKey && (
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${getHandleId(column.id)}-pk`}
                  style={{ 
                    top: `${40 + index * 35}px`,
                    right: '-8px',
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#10b981',
                    border: '2px solid #ffffff',
                    borderRadius: '50%'
                  }}
                />
              )}
              
              {column.isForeignKey && (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${getHandleId(column.id)}-fk`}
                  style={{ 
                    top: `${40 + index * 35}px`,
                    left: '-8px',
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#f59e0b',
                    border: '2px solid #ffffff',
                    borderRadius: '50%'
                  }}
                />
              )}

              {/* Additional handle for M:1 relationships */}
              {column.isPrimaryKey && (
                <Handle
                  type="source"
                  position={Position.Right}
                  id={`${getHandleId(column.id)}-m1`}
                  style={{ 
                    top: `${40 + index * 35 + 10}px`,
                    right: '-8px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#8b5cf6',
                    border: '1px solid #ffffff',
                    borderRadius: '50%'
                  }}
                />
              )}

              {/* Additional handle for M:M relationships */}
              {column.isForeignKey && (
                <Handle
                  type="target"
                  position={Position.Left}
                  id={`${getHandleId(column.id)}-mm`}
                  style={{ 
                    top: `${40 + index * 35 + 10}px`,
                    left: '-8px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#ef4444',
                    border: '1px solid #ffffff',
                    borderRadius: '50%'
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

TableNode.displayName = 'TableNode';