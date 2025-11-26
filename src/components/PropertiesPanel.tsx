'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Trash2, 
  Plus, 
  Edit, 
  Save,
  Link,
  Settings
} from 'lucide-react';
import { TableNode, RelationshipEdge, Column } from '@/types/flow';
import { v4 as uuidv4 } from 'uuid';

const DATA_TYPES = [
  'INT', 'BIGINT', 'VARCHAR', 'TEXT', 'BOOLEAN', 
  'DATE', 'DATETIME', 'TIMESTAMP', 'DECIMAL', 'FLOAT', 'JSON'
];

interface PropertiesPanelProps {
  selectedNode: TableNode | null;
  selectedEdge: RelationshipEdge | null;
  onAddColumn: (tableId: string, column: Column) => void;
  onUpdateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => void;
  onDeleteColumn: (tableId: string, columnId: string) => void;
  onUpdateNode: (nodeId: string, updates: Partial<TableNode>) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedNode,
  selectedEdge,
  onAddColumn,
  onUpdateColumn,
  onDeleteColumn,
  onUpdateNode,
  onDeleteNode,
  onDeleteEdge,
}) => {
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnType, setNewColumnType] = useState('VARCHAR');
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [tableName, setTableName] = useState('');

  React.useEffect(() => {
    if (selectedNode) {
      setTableName(selectedNode.data.name);
      setIsEditingTable(false);
    }
  }, [selectedNode]);

  if (!selectedNode && !selectedEdge) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-sm">Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Select a table or relationship to view properties</p>
        </CardContent>
      </Card>
    );
  }

  if (selectedEdge) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Link className="w-4 h-4" />
              Relationship
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onDeleteEdge(selectedEdge.id)}>
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold">Relationship Type</Label>
            <Select defaultValue={selectedEdge.type}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-to-one">One to One</SelectItem>
                <SelectItem value="one-to-many">One to Many</SelectItem>
                <SelectItem value="many-to-many">Many to Many</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">On Delete</Label>
            <Select defaultValue={selectedEdge.data.onDelete}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASCADE">CASCADE</SelectItem>
                <SelectItem value="SET NULL">SET NULL</SelectItem>
                <SelectItem value="SET DEFAULT">SET DEFAULT</SelectItem>
                <SelectItem value="RESTRICT">RESTRICT</SelectItem>
                <SelectItem value="NO ACTION">NO ACTION</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">On Update</Label>
            <Select defaultValue={selectedEdge.data.onUpdate}>
              <SelectTrigger className="text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CASCADE">CASCADE</SelectItem>
                <SelectItem value="SET NULL">SET NULL</SelectItem>
                <SelectItem value="SET DEFAULT">SET DEFAULT</SelectItem>
                <SelectItem value="RESTRICT">RESTRICT</SelectItem>
                <SelectItem value="NO ACTION">NO ACTION</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAddColumn = () => {
    if (!newColumnName.trim() || !selectedNode) return;

    const newColumn: Column = {
      id: uuidv4(),
      name: newColumnName,
      type: newColumnType,
      nullable: true,
      isPrimaryKey: false,
      isForeignKey: false,
    };

    onAddColumn(selectedNode.id, newColumn);
    setNewColumnName('');
    setNewColumnType('VARCHAR');
  };

  const handleUpdateTableName = () => {
    if (tableName.trim() && tableName !== selectedNode!.data.name) {
      onUpdateNode(selectedNode!.id, {
        data: { ...selectedNode!.data, name: tableName.trim() }
      });
    }
    setIsEditingTable(false);
  };

  const handleDeleteTable = () => {
    if (confirm(`Are you sure you want to delete table "${selectedNode!.data.name}"?`)) {
      onDeleteNode(selectedNode!.id);
    }
  };

  const handleUpdateRelationshipType = (type: 'one-to-one' | 'one-to-many' | 'many-to-many') => {
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, { type });
    }
  };

  const handleUpdateRelationshipName = (name: string) => {
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, {
        data: { ...selectedEdge.data, name }
      });
    }
  };

  const handleUpdateRelationshipActions = (onDelete: string, onUpdate: string) => {
    if (selectedEdge) {
      onUpdateEdge(selectedEdge.id, {
        data: { ...selectedEdge.data, onDelete, onUpdate }
      });
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {isEditingTable ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                onBlur={handleUpdateTableName}
                onKeyDown={(e) => e.key === 'Enter' && handleUpdateTableName()}
                className="text-sm font-semibold"
              />
              <Button size="sm" onClick={handleUpdateTableName}>
                <Save className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <CardTitle className="text-sm cursor-pointer flex items-center gap-2" onClick={() => setIsEditingTable(true)}>
              <Settings className="w-4 h-4" />
              {selectedNode.data.name}
            </CardTitle>
          )}
          <Button variant="ghost" size="sm" onClick={handleDeleteTable}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Tabs defaultValue="columns" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="columns">Columns</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="columns" className="space-y-3">
            {/* Add New Column */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Add New Column</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Column name"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  className="flex-1 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                />
                <Select value={newColumnType} onValueChange={setNewColumnType}>
                  <SelectTrigger className="w-24 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DATA_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={handleAddColumn}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Columns List */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Columns</Label>
              <ScrollArea className="h-64">
                <div className="space-y-1">
                  {selectedNode.data.columns.map((column) => (
                    <div key={column.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {column.isPrimaryKey ? '🔑' : column.isForeignKey ? '🔗' : '  '}
                          {column.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {column.type}
                        </Badge>
                        {column.isPrimaryKey && (
                          <Badge variant="default" className="text-xs">PK</Badge>
                        )}
                        {column.isForeignKey && (
                          <Badge variant="secondary" className="text-xs">FK</Badge>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteColumn(selectedNode.id, column.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
          
          <TabsContent value="sql" className="space-y-3">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Relationship Type</Label>
              <Select 
                value={selectedEdge?.type || 'one-to-many'} 
                onValueChange={(value: 'one-to-one' | 'one-to-many' | 'many-to-many') => handleUpdateRelationshipType(value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-to-one">One to One (1:1)</SelectItem>
                  <SelectItem value="one-to-many">One to Many (1:N)</SelectItem>
                  <SelectItem value="many-to-many">Many to Many (M:N)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">Relationship Name</Label>
              <Input
                value={selectedEdge?.data?.name || ''}
                onChange={(e) => handleUpdateRelationshipName(e.target.value)}
                placeholder="Enter relationship name"
                className="text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">On Delete</Label>
              <Select 
                value={selectedEdge?.data?.onDelete || 'CASCADE'}
                onValueChange={(value: string) => handleUpdateRelationshipActions(value, selectedEdge?.data?.onUpdate || 'CASCADE')}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASCADE">CASCADE</SelectItem>
                  <SelectItem value="SET NULL">SET NULL</SelectItem>
                  <SelectItem value="SET DEFAULT">SET DEFAULT</SelectItem>
                  <SelectItem value="RESTRICT">RESTRICT</SelectItem>
                  <SelectItem value="NO ACTION">NO ACTION</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold">On Update</Label>
              <Select 
                value={selectedEdge?.data?.onUpdate || 'CASCADE'}
                onValueChange={(value: string) => handleUpdateRelationshipActions(selectedEdge?.data?.onDelete || 'CASCADE', value)}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CASCADE">CASCADE</SelectItem>
                  <SelectItem value="SET NULL">SET NULL</SelectItem>
                  <SelectItem value="SET DEFAULT">SET DEFAULT</SelectItem>
                  <SelectItem value="RESTRICT">RESTRICT</SelectItem>
                  <SelectItem value="NO ACTION">NO ACTION</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Position</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">X</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedNode.position.x)}
                    onChange={(e) => onUpdateNode(selectedNode.id, { 
                      position: { ...selectedNode.position, x: parseInt(e.target.value) || 0 }
                    })}
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Y</Label>
                  <Input
                    type="number"
                    value={Math.round(selectedNode.position.y)}
                    onChange={(e) => onUpdateNode(selectedNode.id, { 
                      position: { ...selectedNode.position, y: parseInt(e.target.value) || 0 }
                    })}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Statistics</Label>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Columns: {selectedNode.data.columns.length}</p>
                <p>Primary Keys: {selectedNode.data.columns.filter(c => c.isPrimaryKey).length}</p>
                <p>Foreign Keys: {selectedNode.data.columns.filter(c => c.isForeignKey).length}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};