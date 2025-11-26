'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Plus,
  Database,
  Grid3X3,
  Zap,
  MousePointer2
} from 'lucide-react';
import { useFlowStore } from '@/store/flow';
import { v4 as uuidv4 } from 'uuid';
import { Column } from '@/types/flow';

const TABLE_TEMPLATES = [
  {
    name: 'Users',
    description: 'User management table',
    icon: '👤',
    color: '#3b82f6',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true, nullable: false, isForeignKey: false },
      { name: 'username', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'email', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'password_hash', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'updated_at', type: 'TIMESTAMP', isPrimaryKey: false, nullable: false, isForeignKey: false },
    ] as Column[],
  },
  {
    name: 'Products',
    description: 'Product catalog table',
    icon: '📦',
    color: '#10b981',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true, nullable: false, isForeignKey: false },
      { name: 'name', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'description', type: 'TEXT', isPrimaryKey: false, nullable: true, isForeignKey: false },
      { name: 'price', type: 'DECIMAL', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'category_id', type: 'INT', isPrimaryKey: false, nullable: true, isForeignKey: true },
      { name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, nullable: false, isForeignKey: false },
    ] as Column[],
  },
  {
    name: 'Orders',
    description: 'Order management table',
    icon: '🛒',
    color: '#f59e0b',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true, nullable: false, isForeignKey: false },
      { name: 'user_id', type: 'INT', isPrimaryKey: false, nullable: false, isForeignKey: true },
      { name: 'total_amount', type: 'DECIMAL', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'status', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'order_date', type: 'TIMESTAMP', isPrimaryKey: false, nullable: false, isForeignKey: false },
    ] as Column[],
  },
  {
    name: 'Categories',
    description: 'Product categories table',
    icon: '🏷️',
    color: '#8b5cf6',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true, nullable: false, isForeignKey: false },
      { name: 'name', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'description', type: 'TEXT', isPrimaryKey: false, nullable: true, isForeignKey: false },
      { name: 'parent_id', type: 'INT', isPrimaryKey: false, nullable: true, isForeignKey: true },
    ] as Column[],
  },
  {
    name: 'OrderItems',
    description: 'Order items junction table',
    icon: '📋',
    color: '#ef4444',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true, nullable: false, isForeignKey: false },
      { name: 'order_id', type: 'INT', isPrimaryKey: false, nullable: false, isForeignKey: true },
      { name: 'product_id', type: 'INT', isPrimaryKey: false, nullable: false, isForeignKey: true },
      { name: 'quantity', type: 'INT', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'price', type: 'DECIMAL', isPrimaryKey: false, nullable: false, isForeignKey: false },
    ] as Column[],
  },
  {
    name: 'UserRoles',
    description: 'User roles junction table',
    icon: '👥',
    color: '#8b5cf6',
    columns: [
      { name: 'user_id', type: 'INT', isPrimaryKey: true, nullable: false, isForeignKey: true },
      { name: 'role_id', type: 'INT', isPrimaryKey: true, nullable: false, isForeignKey: true },
      { name: 'assigned_at', type: 'TIMESTAMP', isPrimaryKey: false, nullable: false, isForeignKey: false },
    ] as Column[],
  },
  {
    name: 'Posts',
    description: 'Blog posts table',
    icon: '📝',
    color: '#06b6d4',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true, nullable: false, isForeignKey: false },
      { name: 'title', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'content', type: 'TEXT', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'author_id', type: 'INT', isPrimaryKey: false, nullable: false, isForeignKey: true },
      { name: 'published_at', type: 'TIMESTAMP', isPrimaryKey: false, nullable: true, isForeignKey: false },
      { name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, nullable: false, isForeignKey: false },
    ] as Column[],
  },
];

export const TemplatesPanel: React.FC = () => {
  const { schema, addTable } = useFlowStore();

  const handleAddTable = (template: typeof TABLE_TEMPLATES[0]) => {
    const newTable = {
      id: uuidv4(),
      type: 'table' as const,
      position: {
        x: 100 + (schema.nodes.length % 3) * 300,
        y: 100 + Math.floor(schema.nodes.length / 3) * 250,
      },
      data: {
        name: `${template.name}_${schema.nodes.length + 1}`,
        columns: template.columns.map(col => ({ ...col, id: uuidv4() })),
        color: template.color,
      },
    };

    addTable(newTable);
  };

  const handleAddEmptyTable = () => {
    const newTable = {
      id: uuidv4(),
      type: 'table' as const,
      position: {
        x: 100 + (schema.nodes.length % 3) * 300,
        y: 100 + Math.floor(schema.nodes.length / 3) * 250,
      },
      data: {
        name: `table_${schema.nodes.length + 1}`,
        columns: [
          {
            id: uuidv4(),
            name: 'id',
            type: 'INT',
            nullable: false,
            isPrimaryKey: true,
            isForeignKey: false,
          },
        ],
        color: '#6b7280',
      },
    };

    addTable(newTable);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Database className="w-4 h-4" />
          Table Templates
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="space-y-2">
          <Button 
            variant="default" 
            className="w-full justify-start" 
            onClick={handleAddEmptyTable}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Empty Table
          </Button>
        </div>

        {/* Template Categories */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">Quick Start Templates</h3>
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {TABLE_TEMPLATES.map((template) => (
                <Card 
                  key={template.name} 
                  className="cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] border-l-4"
                  style={{ borderLeftColor: template.color }}
                  onClick={() => handleAddTable(template)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium">{template.name}</h4>
                        <p className="text-xs text-gray-500">{template.description}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {template.columns.length} columns
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {template.columns.filter(c => c.isPrimaryKey).length} PK
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {template.columns.filter(c => c.isForeignKey).length} FK
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* Schema Overview */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Current Schema</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Tables: {schema.nodes.length}</p>
            <p>Relationships: {schema.edges.length}</p>
            <p>Total Columns: {schema.nodes.reduce((acc, node) => acc + node.data.columns.length, 0)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};