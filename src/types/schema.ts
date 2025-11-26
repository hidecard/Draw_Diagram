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

export interface Table {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  columns: Column[];
  color?: string;
}

export interface Relationship {
  id: string;
  sourceTableId: string;
  targetTableId: string;
  sourceColumnId: string;
  targetColumnId: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface Schema {
  id: string;
  name: string;
  tables: Table[];
  relationships: Relationship[];
}

export interface Point {
  x: number;
  y: number;
}

export interface CanvasState {
  scale: number;
  offsetX: number;
  offsetY: number;
}