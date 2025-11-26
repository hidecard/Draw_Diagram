'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Key, Link as LinkIcon, ChevronDown } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Column } from '@/types/flow';

interface TableNodeData {
  name: string;
  columns: Column[];
  color: string;
}

interface TableNodeProps extends NodeProps<TableNodeData> {
  onDelete?: (nodeId: string) => void;
  onEdit?: (nodeId: string) => void;
  onUpdateColumn?: (nodeId: string, columnId: string, updates: Partial<Column>) => void;
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
              className="flex items-center justify-between p-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 relative"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* Replace emoji with icons */}
                {column.isPrimaryKey && <Key className="w-4 h-4 text-green-600" />}
                {column.isForeignKey && <LinkIcon className="w-4 h-4 text-yellow-500" />}
                {!column.isPrimaryKey && !column.isForeignKey && <div style={{ width: 16 }} />} {/* spacer */}

                <span className="text-sm font-medium truncate">
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

              {/* Single handle per column for connections */}
              <Handle
                type={column.isPrimaryKey ? "source" : "target"}
                position={column.isPrimaryKey ? Position.Right : Position.Left}
                id={getHandleId(column.id)}
                style={{
                  position: 'absolute',
                  [column.isPrimaryKey ? 'right' : 'left']: '-8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '16px',
                  height: '16px',
                  backgroundColor: column.isPrimaryKey ? '#10b981' : '#f59e0b',
                  border: '2px solid #ffffff',
                  borderRadius: '50%',
                  zIndex: 10,
                  cursor: 'crosshair'
                }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

TableNode.displayName = 'TableNode';