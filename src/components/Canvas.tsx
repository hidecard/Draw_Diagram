'use client';

import React, { useState, useRef } from 'react';
import Konva from 'konva';
import { Stage, Layer, Rect, Text, Line, Circle } from 'react-konva';
import { Table, Relationship, Column } from '@/types/schema';
import { useSchemaStore } from '@/store/schema';

const TABLE_WIDTH = 200;
const TABLE_HEIGHT = 40;
const COLUMN_HEIGHT = 25;
const HEADER_HEIGHT = 40;

interface TableComponentProps {
  table: Table;
  isSelected: boolean;
  onSelect: (tableId: string) => void;
  onUpdate: (tableId: string, updates: Partial<Table>) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({ 
  table, 
  isSelected, 
  onSelect, 
  onUpdate 
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = () => {
    setIsDragging(true);
    onSelect(table.id);
  };

  const handleDragEnd = (e: any) => {
    setIsDragging(false);
    const newX = e.target.x();
    const newY = e.target.y();
    onUpdate(table.id, { x: newX, y: newY });
  };

  const totalHeight = HEADER_HEIGHT + table.columns.length * COLUMN_HEIGHT;

  return (
    <>
      {/* Table shadow */}
      <Rect
        x={table.x + 2}
        y={table.y + 2}
        width={TABLE_WIDTH}
        height={totalHeight}
        fill="black"
        opacity={0.1}
        cornerRadius={4}
      />
      
      {/* Table background */}
      <Rect
        x={table.x}
        y={table.y}
        width={TABLE_WIDTH}
        height={totalHeight}
        fill={isSelected ? '#e0f2fe' : '#ffffff'}
        stroke={isSelected ? '#0ea5e9' : '#d1d5db'}
        strokeWidth={isSelected ? 2 : 1}
        cornerRadius={4}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={() => onSelect(table.id)}
      />
      
      {/* Table header */}
      <Rect
        x={table.x}
        y={table.y}
        width={TABLE_WIDTH}
        height={HEADER_HEIGHT}
        fill={table.color || '#3b82f6'}
        cornerRadius={[4, 4, 0, 0]}
      />
      
      {/* Table name */}
      <Text
        x={table.x + TABLE_WIDTH / 2}
        y={table.y + HEADER_HEIGHT / 2}
        text={table.name}
        fontSize={14}
        fontWeight="bold"
        fill="white"
        offsetX={table.name.length * 4}
        offsetY={7}
      />
      
      {/* Columns */}
      {table.columns.map((column, index) => (
        <React.Fragment key={column.id}>
          <Text
            x={table.x + 10}
            y={table.y + HEADER_HEIGHT + index * COLUMN_HEIGHT + 15}
            text={`${column.isPrimaryKey ? '🔑' : column.isForeignKey ? '🔗' : '  '} ${column.name}`}
            fontSize={12}
            fill="#374151"
          />
          <Text
            x={table.x + TABLE_WIDTH - 10}
            y={table.y + HEADER_HEIGHT + index * COLUMN_HEIGHT + 15}
            text={column.type}
            fontSize={10}
            fill="#6b7280"
            offsetX={column.type.length * 3}
          />
        </React.Fragment>
      ))}
    </>
  );
};

interface RelationshipComponentProps {
  relationship: Relationship;
  sourceTable: Table;
  targetTable: Table;
  isSelected: boolean;
  onSelect: (relId: string) => void;
}

const RelationshipComponent: React.FC<RelationshipComponentProps> = ({
  relationship,
  sourceTable,
  targetTable,
  isSelected,
  onSelect,
}) => {
  const getSourcePoint = () => ({
    x: sourceTable.x + TABLE_WIDTH,
    y: sourceTable.y + HEADER_HEIGHT + 20,
  });

  const getTargetPoint = () => ({
    x: targetTable.x,
    y: targetTable.y + HEADER_HEIGHT + 20,
  });

  const source = getSourcePoint();
  const target = getTargetPoint();

  return (
    <>
      <Line
        points={[source.x, source.y, target.x, target.y]}
        stroke={isSelected ? '#0ea5e9' : '#6b7280'}
        strokeWidth={isSelected ? 3 : 2}
        onClick={() => onSelect(relationship.id)}
      />
      
      {/* Arrow head */}
      <Line
        points={[
          target.x,
          target.y,
          target.x - 10,
          target.y - 5,
          target.x - 10,
          target.y + 5,
          target.x,
          target.y,
        ]}
        stroke={isSelected ? '#0ea5e9' : '#6b7280'}
        strokeWidth={isSelected ? 3 : 2}
        fill={isSelected ? '#0ea5e9' : '#6b7280'}
        onClick={() => onSelect(relationship.id)}
      />
    </>
  );
};

interface CanvasProps {
  width: number;
  height: number;
}

export const Canvas: React.FC<CanvasProps> = ({ width, height }) => {
  const { 
    schema, 
    selectedTable, 
    selectedRelationship,
    setSelectedTable,
    setSelectedRelationship,
    updateTable
  } = useSchemaStore();

  const handleCanvasClick = () => {
    setSelectedTable(null);
    setSelectedRelationship(null);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <Stage
        width={width}
        height={height}
        onClick={handleCanvasClick}
      >
        <Layer>
          {/* Grid background */}
          {Array.from({ length: Math.ceil(width / 20) }, (_, i) => (
            <Line
              key={`v-${i}`}
              points={[i * 20, 0, i * 20, height]}
              stroke="#f3f4f6"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: Math.ceil(height / 20) }, (_, i) => (
            <Line
              key={`h-${i}`}
              points={[0, i * 20, width, i * 20]}
              stroke="#f3f4f6"
              strokeWidth={1}
            />
          ))}

          {/* Relationships */}
          {schema.relationships.map((relationship) => {
            const sourceTable = schema.tables.find(t => t.id === relationship.sourceTableId);
            const targetTable = schema.tables.find(t => t.id === relationship.targetTableId);
            
            if (!sourceTable || !targetTable) return null;
            
            return (
              <RelationshipComponent
                key={relationship.id}
                relationship={relationship}
                sourceTable={sourceTable}
                targetTable={targetTable}
                isSelected={selectedRelationship === relationship.id}
                onSelect={setSelectedRelationship}
              />
            );
          })}

          {/* Tables */}
          {schema.tables.map((table) => (
            <TableComponent
              key={table.id}
              table={table}
              isSelected={selectedTable === table.id}
              onSelect={setSelectedTable}
              onUpdate={updateTable}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};