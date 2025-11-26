'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Table as TableIcon, 
  Link, 
  Search,
  Plus,
  Database,
  Package,
  Users,
  ShoppingBag,
  MessageSquare
} from 'lucide-react';
import { useSchemaStore } from '@/store/schema';
import { v4 as uuidv4 } from 'uuid';
import { Column } from '@/types/schema';

const TABLE_TEMPLATES = [
  {
    name: 'Users',
    icon: Users,
    description: 'User management table',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true, nullable: false, isForeignKey: false },
      { name: 'username', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'email', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'password_hash', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, nullable: false, isForeignKey: false },
    ] as Column[],
  },
  {
    name: 'Products',
    icon: Package,
    description: 'Product catalog table',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true, nullable: false, isForeignKey: false },
      { name: 'name', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'description', type: 'TEXT', isPrimaryKey: false, nullable: true, isForeignKey: false },
      { name: 'price', type: 'DECIMAL', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'category_id', type: 'INT', isPrimaryKey: false, nullable: true, isForeignKey: true },
    ] as Column[],
  },
  {
    name: 'Orders',
    icon: ShoppingBag,
    description: 'Order management table',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true, nullable: false, isForeignKey: false },
      { name: 'user_id', type: 'INT', isPrimaryKey: false, nullable: false, isForeignKey: true },
      { name: 'total_amount', type: 'DECIMAL', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'status', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'created_at', type: 'TIMESTAMP', isPrimaryKey: false, nullable: false, isForeignKey: false },
    ] as Column[],
  },
  {
    name: 'Posts',
    icon: MessageSquare,
    description: 'Blog posts table',
    columns: [
      { name: 'id', type: 'INT', isPrimaryKey: true, nullable: false, isForeignKey: false },
      { name: 'title', type: 'VARCHAR', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'content', type: 'TEXT', isPrimaryKey: false, nullable: false, isForeignKey: false },
      { name: 'author_id', type: 'INT', isPrimaryKey: false, nullable: false, isForeignKey: true },
      { name: 'published_at', type: 'TIMESTAMP', isPrimaryKey: false, nullable: true, isForeignKey: false },
    ] as Column[],
  },
];

export const LeftPanel: React.FC = () => {
  const { schema, addTable } = useSchemaStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleAddTable = (template: typeof TABLE_TEMPLATES[0]) => {
    const newTable = {
      id: uuidv4(),
      name: `${template.name}_${schema.tables.length + 1}`,
      x: 100 + (schema.tables.length % 3) * 250,
      y: 100 + Math.floor(schema.tables.length / 3) * 200,
      width: 200,
      height: 40 + template.columns.length * 25,
      columns: template.columns.map(col => ({ ...col, id: uuidv4() })),
      color: '#3b82f6',
    };

    addTable(newTable);
  };

  const handleAddEmptyTable = () => {
    const newTable = {
      id: uuidv4(),
      name: `table_${schema.tables.length + 1}`,
      x: 100 + (schema.tables.length % 3) * 250,
      y: 100 + Math.floor(schema.tables.length / 3) * 200,
      width: 200,
      height: 80,
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
      color: '#3b82f6',
    };

    addTable(newTable);
  };

  const filteredTemplates = TABLE_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-80 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Database className="w-4 h-4" />
          Components
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

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

        {/* Table Templates */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Table Templates</h3>
          <ScrollArea className="h-64">
            <div className="space-y-2">
              {filteredTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card 
                    key={template.name} 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleAddTable(template)}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-blue-600 mt-0.5" />
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
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Schema Overview */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Schema Overview</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Tables: {schema.tables.length}</p>
            <p>Relationships: {schema.relationships.length}</p>
            <p>Total Columns: {schema.tables.reduce((acc, table) => acc + table.columns.length, 0)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};