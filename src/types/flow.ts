export interface TableNode {
  id: string;
  type: 'table';
  position: { x: number; y: number };
  data: {
    name: string;
    columns: Column[];
    color: string;
  };
}

export interface Column {
  id: string;
  name: string;
  type: string;
  nullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  defaultValue?: string;
  comment?: string;
}

export interface RelationshipEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  data: RelationshipEdgeData;
}

export interface RelationshipEdgeData {
  name?: string;
  onDelete: string;
  onUpdate: string;
}

export interface Schema {
  id: string;
  name: string;
  nodes: TableNode[];
  edges: RelationshipEdge[];
}

export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

export interface ToolbarState {
  selectedTool: 'select' | 'table' | 'relationship' | 'pan';
  isGridVisible: boolean;
  snapToGrid: boolean;
  gridSize: number;
}