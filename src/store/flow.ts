import { create } from 'zustand';
import { Schema, TableNode, RelationshipEdge, Column, ViewportState, ToolbarState } from '@/types/flow';

interface FlowStore {
  schema: Schema;
  selectedNode: string | null;
  selectedEdge: string | null;
  viewport: ViewportState;
  toolbar: ToolbarState;
  
  // Actions
  setSchema: (schema: Schema) => void;
  addTable: (node: TableNode) => void;
  updateTable: (id: string, updates: Partial<TableNode>) => void;
  deleteTable: (id: string) => void;
  addColumn: (tableId: string, column: Column) => void;
  updateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (tableId: string, columnId: string) => void;
  addRelationship: (edge: RelationshipEdge) => void;
  deleteRelationship: (id: string) => void;
  setSelectedNode: (id: string | null) => void;
  setSelectedEdge: (id: string | null) => void;
  setViewport: (viewport: Partial<ViewportState>) => void;
  setToolbar: (toolbar: Partial<ToolbarState>) => void;
  autoLayout: () => void;
}

export const useFlowStore = create<FlowStore>((set, get) => ({
  schema: {
    id: '1',
    name: 'Untitled Schema',
    nodes: [],
    edges: [],
  },
  selectedNode: null,
  selectedEdge: null,
  viewport: { x: 0, y: 0, zoom: 1 },
  toolbar: {
    selectedTool: 'select',
    isGridVisible: true,
    snapToGrid: true,
    gridSize: 20,
  },

  setSchema: (schema) => set({ schema }),
  
  addTable: (node) => set((state) => ({
    schema: {
      ...state.schema,
      nodes: [...state.schema.nodes, node],
    },
  })),
  
  updateTable: (id, updates) => set((state) => ({
    schema: {
      ...state.schema,
      nodes: state.schema.nodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node
      ),
    },
  })),
  
  deleteTable: (id) => set((state) => ({
    schema: {
      ...state.schema,
      nodes: state.schema.nodes.filter((node) => node.id !== id),
      edges: state.schema.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      ),
    },
    selectedNode: state.selectedNode === id ? null : state.selectedNode,
  })),
  
  addColumn: (tableId, column) => set((state) => ({
    schema: {
      ...state.schema,
      nodes: state.schema.nodes.map((node) =>
        node.id === tableId
          ? {
              ...node,
              data: {
                ...node.data,
                columns: [...node.data.columns, column],
              },
            }
          : node
      ),
    },
  })),
  
  updateColumn: (tableId, columnId, updates) => set((state) => ({
    schema: {
      ...state.schema,
      nodes: state.schema.nodes.map((node) =>
        node.id === tableId
          ? {
              ...node,
              data: {
                ...node.data,
                columns: node.data.columns.map((column) =>
                  column.id === columnId ? { ...column, ...updates } : column
                ),
              },
            }
          : node
      ),
    },
  })),
  
  deleteColumn: (tableId, columnId) => set((state) => ({
    schema: {
      ...state.schema,
      nodes: state.schema.nodes.map((node) =>
        node.id === tableId
          ? {
              ...node,
              data: {
                ...node.data,
                columns: node.data.columns.filter((column) => column.id !== columnId),
              },
            }
          : node
      ),
    },
  })),
  
  addRelationship: (edge) => set((state) => ({
    schema: {
      ...state.schema,
      edges: [...state.schema.edges, edge],
    },
  })),
  
  deleteRelationship: (id) => set((state) => ({
    schema: {
      ...state.schema,
      edges: state.schema.edges.filter((edge) => edge.id !== id),
    },
    selectedEdge: state.selectedEdge === id ? null : state.selectedEdge,
  })),
  
  setSelectedNode: (id) => set({ selectedNode: id, selectedEdge: null }),
  setSelectedEdge: (id) => set({ selectedEdge: id, selectedNode: null }),
  
  setViewport: (viewport) => set((state) => ({
    viewport: { ...state.viewport, ...viewport },
  })),
  
  setToolbar: (toolbar) => set((state) => ({
    toolbar: { ...state.toolbar, ...toolbar },
  })),
  
  autoLayout: () => {
    const { schema } = get();
    const nodes = [...schema.nodes];
    const edges = [...schema.edges];
    
    // Simple hierarchical layout
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    const visited = new Set<string>();
    const levels: string[][] = [];
    
    // Find root nodes (nodes with no incoming edges)
    const roots = nodes.filter(node => 
      !edges.some(edge => edge.target === node.id)
    );
    
    // Build levels
    const queue = [...roots.map(node => node.id)];
    let currentLevel = 0;
    
    while (queue.length > 0) {
      const levelSize = queue.length;
      const currentLevelNodes: string[] = [];
      
      for (let i = 0; i < levelSize; i++) {
        const nodeId = queue.shift()!;
        if (visited.has(nodeId)) continue;
        
        visited.add(nodeId);
        currentLevelNodes.push(nodeId);
        
        // Add children to queue
        const children = edges
          .filter(edge => edge.source === nodeId)
          .map(edge => edge.target)
          .filter(childId => !visited.has(childId));
        
        queue.push(...children);
      }
      
      if (currentLevelNodes.length > 0) {
        levels.push(currentLevelNodes);
      }
      currentLevel++;
    }
    
    // Add remaining nodes
    const remaining = nodes.filter(node => !visited.has(node.id));
    if (remaining.length > 0) {
      levels.push(remaining.map(node => node.id));
    }
    
    // Position nodes
    const updatedNodes = nodes.map(node => {
      const levelIndex = levels.findIndex(level => level.includes(node.id));
      const positionInLevel = levels[levelIndex]?.indexOf(node.id) || 0;
      const levelWidth = levels[levelIndex]?.length || 1;
      
      return {
        ...node,
        position: {
          x: 150 + positionInLevel * 250,
          y: 100 + levelIndex * 200,
        },
      };
    });
    
    set((state) => ({
      schema: {
        ...state.schema,
        nodes: updatedNodes,
      },
    }));
  },
}));