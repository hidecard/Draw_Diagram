'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Download, 
  FileText, 
  Database, 
  Code,
  Copy,
  Save,
  Image,
  FileImage,
  Loader2
} from 'lucide-react';
import { Schema } from '@/types/flow';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportPanelProps {
  schema: Schema;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ schema }) => {
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const generateSQL = (dialect: 'mysql' | 'postgresql' | 'sqlite' = 'mysql') => {
    let sql = `-- Generated SQL Schema (${dialect.toUpperCase()})\n\n`;
    
    schema.nodes.forEach(table => {
      sql += `CREATE TABLE ${table.data.name} (\n`;
      
      const columnDefs = table.data.columns.map(column => {
        let def = `  ${column.name} ${column.type}`;
        if (!column.nullable) def += ' NOT NULL';
        if (column.isPrimaryKey) def += ' PRIMARY KEY';
        if (column.defaultValue) def += ` DEFAULT ${column.defaultValue}`;
        return def;
      });
      
      sql += columnDefs.join(',\n');
      sql += '\n);\n\n';
    });

    // Add relationships
    schema.edges.forEach(edge => {
      const sourceTable = schema.nodes.find(n => n.id === edge.source);
      const targetTable = schema.nodes.find(n => n.id === edge.target);
      
      if (sourceTable && targetTable) {
        const sourceColumn = sourceTable.data.columns.find(c => c.isPrimaryKey);
        const targetColumn = targetTable.data.columns.find(c => c.isForeignKey);
        
        if (sourceColumn && targetColumn) {
          sql += `ALTER TABLE ${targetTable.data.name}\n`;
          sql += `  ADD CONSTRAINT fk_${edge.id} FOREIGN KEY (${targetColumn.name})\n`;
          sql += `  REFERENCES ${sourceTable.data.name}(${sourceColumn.name})\n`;
          sql += `  ON DELETE ${edge.data.onDelete}\n`;
          sql += `  ON UPDATE ${edge.data.onUpdate};\n\n`;
        }
      }
    });

    return sql;
  };

  const generateJSON = () => {
    return JSON.stringify(schema, null, 2);
  };

  const generateMermaid = () => {
    let mermaid = 'erDiagram\n';
    
    schema.nodes.forEach(table => {
      mermaid += `    ${table.data.name} {\n`;
      table.data.columns.forEach(column => {
        const pk = column.isPrimaryKey ? ' PK' : '';
        const fk = column.isForeignKey ? ' FK' : '';
        mermaid += `        ${column.type} ${column.name}${pk}${fk}\n`;
      });
      mermaid += '    }\n';
    });

    schema.edges.forEach(edge => {
      const sourceTable = schema.nodes.find(n => n.id === edge.source);
      const targetTable = schema.nodes.find(n => n.id === edge.target);
      
      if (sourceTable && targetTable) {
        const relationSymbol = edge.type === 'one-to-one' ? '||--||' :
                            edge.type === 'one-to-many' ? '||--o{' :
                            'o{--o{';
        mermaid += `    ${sourceTable.data.name} ${relationSymbol} ${targetTable.data.name} : "${edge.data.name || 'has'}"\n`;
      }
    });

    return mermaid;
  };

  const generateDBML = () => {
    let dbml = '// Generated DBML Schema\n\n';
    
    schema.nodes.forEach(table => {
      dbml += `Table ${table.data.name} {\n`;
      table.data.columns.forEach(column => {
        dbml += `  ${column.name} ${column.type}`;
        if (column.isPrimaryKey) dbml += ' [pk]';
        if (column.isForeignKey) dbml += ' [fk]';
        if (!column.nullable) dbml += ' [not null]';
        if (column.defaultValue) dbml += ` [default: ${column.defaultValue}]`;
        dbml += '\n';
      });
      dbml += '}\n\n';
    });

    schema.edges.forEach(edge => {
      const sourceTable = schema.nodes.find(n => n.id === edge.source);
      const targetTable = schema.nodes.find(n => n.id === edge.target);
      
      if (sourceTable && targetTable) {
        dbml += `Ref: ${targetTable.data.name}.${sourceTable.data.name} {\n`;
        dbml += `  on_delete: ${edge.data.onDelete.toLowerCase()}\n`;
        dbml += `  on_update: ${edge.data.onUpdate.toLowerCase()}\n`;
        dbml += '}\n\n';
      }
    });

    return dbml;
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPNG = async () => {
    setIsExporting('png');
    try {
      const canvas = document.querySelector('.react-flow__viewport');
      if (!canvas) {
        alert('Could not find canvas to export');
        return;
      }

      const dataUrl = await html2canvas(canvas as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const link = document.createElement('a');
      link.download = 'schema-diagram.png';
      link.href = dataUrl.toDataURL();
      link.click();
    } catch (error) {
      console.error('PNG export failed:', error);
      alert('PNG export failed. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  const exportToPDF = async () => {
    setIsExporting('pdf');
    try {
      const canvas = document.querySelector('.react-flow__viewport');
      if (!canvas) {
        alert('Could not find canvas to export');
        return;
      }

      const dataUrl = await html2canvas(canvas as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = dataUrl.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [dataUrl.width, dataUrl.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, dataUrl.width, dataUrl.height);
      pdf.save('schema-diagram.pdf');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  const sqlContent = generateSQL();
  const jsonContent = generateJSON();
  const mermaidContent = generateMermaid();
  const dbmlContent = generateDBML();

  return (
    <Card className="w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="visual" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="visual" className="text-xs">Visual</TabsTrigger>
            <TabsTrigger value="sql" className="text-xs">SQL</TabsTrigger>
            <TabsTrigger value="formats" className="text-xs">Formats</TabsTrigger>
            <TabsTrigger value="code" className="text-xs">Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visual" className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Image Export</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToPNG}
                  disabled={isExporting === 'png'}
                  className="text-xs"
                >
                  {isExporting === 'png' ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <Image className="w-3 h-3 mr-1" alt="Export as PNG" />
                  )}
                  PNG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToPDF}
                  disabled={isExporting === 'pdf'}
                  className="text-xs"
                >
                  {isExporting === 'pdf' ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <FileText className="w-3 h-3 mr-1" />
                  )}
                  PDF
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Schema Info</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Tables: {schema.nodes.length}</p>
                <p>Relationships: {schema.edges.length}</p>
                <p>Total Columns: {schema.nodes.reduce((acc, table) => acc + table.data.columns.length, 0)}</p>
                <p>Export Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sql" className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">SQL Dialects</h3>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => downloadFile(generateSQL('mysql'), 'schema_mysql.sql', 'text/plain')}
                >
                  <Database className="w-3 h-3 mr-2" />
                  MySQL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => downloadFile(generateSQL('postgresql'), 'schema_postgresql.sql', 'text/plain')}
                >
                  <Database className="w-3 h-3 mr-2" />
                  PostgreSQL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => downloadFile(generateSQL('sqlite'), 'schema_sqlite.sql', 'text/plain')}
                >
                  <Database className="w-3 h-3 mr-2" />
                  SQLite
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Quick Actions</h3>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => copyToClipboard(sqlContent)}
                >
                  <Copy className="w-3 h-3 mr-2" />
                  Copy SQL
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="formats" className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Export Formats</h3>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => downloadFile(sqlContent, 'schema.sql', 'text/plain')}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  SQL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => downloadFile(jsonContent, 'schema.json', 'application/json')}
                >
                  <Code className="w-3 h-3 mr-1" />
                  JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => downloadFile(mermaidContent, 'schema.mmd', 'text/plain')}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  Mermaid
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => downloadFile(dbmlContent, 'schema.dbml', 'text/plain')}
                >
                  <FileText className="w-3 h-3 mr-1" />
                  DBML
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="space-y-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Code Generation</h3>
              <ScrollArea className="h-48">
                <div className="space-y-2">
                  <div>
                    <h4 className="text-xs font-medium mb-1">Mermaid</h4>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {mermaidContent}
                    </pre>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium mb-1">DBML</h4>
                    <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                      {dbmlContent}
                    </pre>
                  </div>
                </div>
              </ScrollArea>
            </div>

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Copy Code</h3>
              <div className="grid grid-cols-2 gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => copyToClipboard(mermaidContent)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy Mermaid
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => copyToClipboard(dbmlContent)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy DBML
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};