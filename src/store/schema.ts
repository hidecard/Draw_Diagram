import { create } from 'zustand';
import { Schema, Table, Relationship, Column, CanvasState } from '@/types/schema';

interface SchemaStore {
  schema: Schema;
  selectedTable: string | null;
  selectedRelationship: string | null;
  canvasState: CanvasState;
  isDragging: boolean;
  dragStart: { x: number; y: number } | null;
  
  // Actions
  setSchema: (schema: Schema) => void;
  addTable: (table: Table) => void;
  updateTable: (id: string, updates: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  addColumn: (tableId: string, column: Column) => void;
  updateColumn: (tableId: string, columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (tableId: string, columnId: string) => void;
  addRelationship: (relationship: Relationship) => void;
  deleteRelationship: (id: string) => void;
  setSelectedTable: (id: string | null) => void;
  setSelectedRelationship: (id: string | null) => void;
  setCanvasState: (state: Partial<CanvasState>) => void;
  setDragging: (isDragging: boolean, start?: { x: number; y: number }) => void;
}

export const useSchemaStore = create<SchemaStore>((set, get) => ({
  schema: {
    id: '1',
    name: 'Untitled Schema',
    tables: [],
    relationships: [],
  },
  selectedTable: null,
  selectedRelationship: null,
  canvasState: {
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  },
  isDragging: false,
  dragStart: null,

  setSchema: (schema) => set({ schema }),
  
  addTable: (table) => set((state) => ({
    schema: {
      ...state.schema,
      tables: [...state.schema.tables, table],
    },
  })),
  
  updateTable: (id, updates) => set((state) => ({
    schema: {
      ...state.schema,
      tables: state.schema.tables.map((table) =>
        table.id === id ? { ...table, ...updates } : table
      ),
    },
  })),
  
  deleteTable: (id) => set((state) => ({
    schema: {
      ...state.schema,
      tables: state.schema.tables.filter((table) => table.id !== id),
      relationships: state.schema.relationships.filter(
        (rel) => rel.sourceTableId !== id && rel.targetTableId !== id
      ),
    },
  })),
  
  addColumn: (tableId, column) => set((state) => ({
    schema: {
      ...state.schema,
      tables: state.schema.tables.map((table) =>
        table.id === tableId
          ? { ...table, columns: [...table.columns, column] }
          : table
      ),
    },
  })),
  
  updateColumn: (tableId, columnId, updates) => set((state) => ({
    schema: {
      ...state.schema,
      tables: state.schema.tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              columns: table.columns.map((column) =>
                column.id === columnId ? { ...column, ...updates } : column
              ),
            }
          : table
      ),
    },
  })),
  
  deleteColumn: (tableId, columnId) => set((state) => ({
    schema: {
      ...state.schema,
      tables: state.schema.tables.map((table) =>
        table.id === tableId
          ? {
              ...table,
              columns: table.columns.filter((column) => column.id !== columnId),
            }
          : table
      ),
    },
  })),
  
  addRelationship: (relationship) => set((state) => ({
    schema: {
      ...state.schema,
      relationships: [...state.schema.relationships, relationship],
    },
  })),
  
  deleteRelationship: (id) => set((state) => ({
    schema: {
      ...state.schema,
      relationships: state.schema.relationships.filter((rel) => rel.id !== id),
    },
  })),
  
  setSelectedTable: (id) => set({ selectedTable: id }),
  setSelectedRelationship: (id) => set({ selectedRelationship: id }),
  
  setCanvasState: (updates) => set((state) => ({
    canvasState: { ...state.canvasState, ...updates },
  })),
  
  setDragging: (isDragging, start) => set({ 
    isDragging, 
    dragStart: start || null 
  }),
}));