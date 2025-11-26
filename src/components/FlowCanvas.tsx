'use client';

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TableNode } from './TableNode';
import { RelationshipEdge } from './RelationshipEdge';
import { ArrowMarkers } from './ArrowMarkers';
import { useFlowStore } from '@/store/flow';
import { Toolbar } from './Toolbar';
import { PropertiesPanel } from './PropertiesPanel';
import { TemplatesPanel } from './TemplatesPanel';
import { ExportPanel } from './ExportPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { TableNode as TableNodeType, RelationshipEdge as RelationshipEdgeType } from '@/types/flow';

const nodeTypes = {
  table: TableNode,
};

const edgeTypes = {
  relationship: RelationshipEdge,
};

export const FlowCanvas: React.FC = () => {
  const { 
    schema, 
    selectedNode, 
    selectedEdge,
    viewport,
    toolbar,
    addTable,
    updateTable,
    deleteTable,
    addColumn,
    updateColumn,
    deleteColumn,
    addRelationship,
    deleteRelationship,
    setSelectedNode,
    setSelectedEdge,
    setViewport,
    setToolbar,
    autoLayout
  } = useFlowStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(schema.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(schema.edges);

  // Update local state when schema changes
  React.useEffect(() => {
    setNodes(schema.nodes);
  }, [schema.nodes, setNodes]);

  React.useEffect(() => {
    setEdges(schema.edges);
  }, [schema.edges, setEdges]);

  // Sync local changes back to store
  const handleNodesChange = useCallback((changes: any[]) => {
    onNodesChange(changes);
    // Update store with new node positions
    changes.forEach(change => {
      if (change.type === 'position' && change.dragging === false) {
        const node = schema.nodes.find(n => n.id === change.id);
        if (node && change.position) {
          updateTable(change.id, { position: change.position });
        }
      }
    });
  }, [onNodesChange, schema.nodes, updateTable]);

  const handleEdgesChange = useCallback((changes: any[]) => {
    onEdgesChange(changes);
  }, [onEdgesChange]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        // Determine relationship type based on handle types
        const sourceNode = schema.nodes.find(n => n.id === params.source);
        const targetNode = schema.nodes.find(n => n.id === params.target);
        
        if (sourceNode && targetNode) {
          // Parse handle IDs to determine connection type
          // Handle ID format: "nodeId-columnId" (e.g., "node1-col1")
          const sourceHandleId = params.sourceHandle || '';
          const targetHandleId = params.targetHandle || '';

          const sourceParts = sourceHandleId.split('-');
          const targetParts = targetHandleId.split('-');

          // Extract column ID (everything after the first dash)
          const sourceColumnId = sourceParts.slice(1).join('-');
          const targetColumnId = targetParts.slice(1).join('-');
          
          const sourceColumn = sourceNode.data.columns.find(c => c.id === sourceColumnId);
          const targetColumn = targetNode.data.columns.find(c => c.id === targetColumnId);
          
          // Determine relationship type based on column properties
          let relationshipType: 'one-to-one' | 'one-to-many' | 'many-to-many' = 'one-to-many';
          let relationshipName = `${sourceNode.data.name}_${targetNode.data.name}`;

          if (sourceColumn && targetColumn) {
            const sourceIsPK = sourceColumn.isPrimaryKey;
            const targetIsFK = targetColumn.isForeignKey;
            const targetIsPK = targetColumn.isPrimaryKey;
            const sourceIsFK = sourceColumn.isForeignKey;

            if (sourceIsPK && targetIsFK) {
              // Standard PK to FK (1:N)
              relationshipType = 'one-to-many';
              relationshipName = `${sourceNode.data.name}_has_${targetNode.data.name}`;
            } else if (sourceIsFK && targetIsPK) {
              // FK to PK (N:1 - reverse of 1:N)
              relationshipType = 'one-to-many';
              relationshipName = `${targetNode.data.name}_belongs_to_${sourceNode.data.name}`;
            } else if (sourceIsPK && targetIsPK) {
              // PK to PK connection (could be 1:1 or junction table)
              relationshipType = 'one-to-one';
              relationshipName = `${sourceNode.data.name}_relates_to_${targetNode.data.name}`;
            } else if (sourceIsFK && targetIsFK) {
              // FK to FK connection (many-to-many via junction table)
              relationshipType = 'many-to-many';
              relationshipName = `${sourceNode.data.name}_and_${targetNode.data.name}`;
            }
          }

          const newEdge: RelationshipEdgeType = {
            id: `edge-${Date.now()}`,
            source: params.source,
            target: params.target,
            sourceHandle: params.sourceHandle || 'source',
            targetHandle: params.targetHandle || 'target',
            type: relationshipType,
            data: {
              name: relationshipName,
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE',
            },
          };
          addRelationship(newEdge);
        }
      }
    },
    [schema.nodes, schema.edges, addRelationship]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
  }, [setSelectedNode]);

  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge.id);
  }, [setSelectedEdge]);

  const handleDeleteTable = useCallback((nodeId: string) => {
    if (confirm('Are you sure you want to delete this table?')) {
      deleteTable(nodeId);
    }
  }, [deleteTable]);

  const handleEditTable = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
  }, [setSelectedNode]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setSelectedNode, setSelectedEdge]);

  const onNodeDragStop = useCallback((event: React.MouseEvent, node: Node) => {
    if (toolbar.snapToGrid) {
      const snappedPosition = {
        x: Math.round(node.position.x / toolbar.gridSize) * toolbar.gridSize,
        y: Math.round(node.position.y / toolbar.gridSize) * toolbar.gridSize,
      };
      updateTable(node.id, { position: snappedPosition });
    } else {
      updateTable(node.id, { position: node.position });
    }
  }, [toolbar.snapToGrid, toolbar.gridSize, updateTable]);

  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    return schema.nodes.find(node => node.id === selectedNode) || null;
  }, [selectedNode, schema.nodes]);

  const selectedEdgeData = useMemo(() => {
    if (!selectedEdge) return null;
    return schema.edges.find(edge => edge.id === selectedEdge) || null;
  }, [selectedEdge, schema.edges]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <Toolbar
          onAutoLayout={autoLayout}
          onToggleGrid={() => setToolbar({ isGridVisible: !toolbar.isGridVisible })}
          onToggleSnap={() => setToolbar({ snapToGrid: !toolbar.snapToGrid })}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-hidden">
          <Tabs defaultValue="templates" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="templates" className="h-full m-0">
                <TemplatesPanel />
              </TabsContent>
              <TabsContent value="properties" className="h-full m-0">
                <PropertiesPanel
                  selectedNode={selectedNodeData}
                  selectedEdge={selectedEdgeData}
                  onAddColumn={addColumn}
                  onUpdateColumn={updateColumn}
                  onDeleteColumn={deleteColumn}
                  onUpdateNode={updateTable}
                  onDeleteNode={deleteTable}
                  onDeleteEdge={deleteRelationship}
                  onUpdateEdge={updateRelationship}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative">
          <Card className="h-full">
            <ReactFlow
              nodes={nodes.map(node => ({
                ...node,
                data: {
                  ...node.data,
                  onDelete: handleDeleteTable,
                  onEdit: handleEditTable,
                },
              }))}
              edges={edges}
              onNodesChange={handleNodesChange}
              onEdgesChange={handleEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              onNodeDragStop={onNodeDragStop}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              connectionLineType="smoothstep"
              fitView
              snapToGrid={toolbar.snapToGrid}
              snapGrid={[toolbar.gridSize, toolbar.gridSize]}
              defaultViewport={viewport}
              onViewportChange={setViewport}
            >
              {toolbar.isGridVisible && <Background />}
              <Controls />
              <MiniMap 
                nodeColor={(node) => {
                  const tableNode = node as TableNodeType;
                  return tableNode.data.color || '#3b82f6';
                }}
                maskColor="rgb(240, 242, 243)"
              />
              
              {/* Toolbar Panel */}
              <Panel position="top-right">
                <ExportPanel schema={schema} />
              </Panel>
            </ReactFlow>
          </Card>
        </div>
      </div>
    </div>
  );
};