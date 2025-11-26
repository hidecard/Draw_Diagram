'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Info,
  Database,
  Table as TableIcon,
  Link as LinkIcon,
  FileText
} from 'lucide-react';
import { useSchemaStore } from '@/store/schema';

interface ValidationIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  table?: string;
  message: string;
  description: string;
}

const ValidationPanel: React.FC = () => {
  const { schema } = useSchemaStore();
  const [issues, setIssues] = useState<ValidationIssue[]>([]);

  const validateSchema = () => {
    const newIssues: ValidationIssue[] = [];

    // Check for tables without primary keys
    schema.tables.forEach(table => {
      const hasPrimaryKey = table.columns.some(col => col.isPrimaryKey);
      if (!hasPrimaryKey) {
        newIssues.push({
          id: `no-pk-${table.id}`,
          type: 'error',
          table: table.name,
          message: 'Table missing primary key',
          description: 'Every table should have a primary key for proper data integrity',
        });
      }

      // Check for tables with no columns
      if (table.columns.length === 0) {
        newIssues.push({
          id: `no-columns-${table.id}`,
          type: 'error',
          table: table.name,
          message: 'Table has no columns',
          description: 'Tables should have at least one column',
        });
      }

      // Check for unnamed columns
      table.columns.forEach(column => {
        if (!column.name.trim()) {
          newIssues.push({
            id: `unnamed-column-${table.id}-${column.id}`,
            type: 'error',
            table: table.name,
            message: 'Column has no name',
            description: 'All columns should have a name',
          });
        }
      });
    });

    // Check for orphaned tables (no relationships)
    if (schema.tables.length > 1) {
      schema.tables.forEach(table => {
        const hasRelationships = schema.relationships.some(
          rel => rel.sourceTableId === table.id || rel.targetTableId === table.id
        );
        if (!hasRelationships) {
          newIssues.push({
            id: `orphaned-${table.id}`,
            type: 'warning',
            table: table.name,
            message: 'Table has no relationships',
            description: 'Consider adding relationships to connect this table with others',
          });
        }
      });
    }

    // Check for duplicate table names
    const tableNames = schema.tables.map(t => t.name);
    const duplicates = tableNames.filter((name, index) => tableNames.indexOf(name) !== index);
    duplicates.forEach(name => {
      newIssues.push({
        id: `duplicate-name-${name}`,
        type: 'error',
        table: name,
        message: 'Duplicate table name',
        description: 'Table names should be unique within the schema',
      });
    });

    setIssues(newIssues);
  };

  const getIssueIcon = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getIssueBadgeVariant = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'error':
        return 'destructive' as const;
      case 'warning':
        return 'secondary' as const;
      case 'info':
        return 'outline' as const;
      default:
        return 'outline' as const;
    }
  };

  const errorCount = issues.filter(i => i.type === 'error').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const infoCount = issues.filter(i => i.type === 'info').length;

  return (
    <Card className="w-80 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Validation
          </CardTitle>
          <Button size="sm" onClick={validateSchema}>
            Run Validation
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="flex items-center gap-2">
          <Badge variant={errorCount > 0 ? 'destructive' : 'default'} className="text-xs">
            {errorCount} Errors
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {warningCount} Warnings
          </Badge>
          <Badge variant="outline" className="text-xs">
            {infoCount} Info
          </Badge>
        </div>

        {/* Issues List */}
        <ScrollArea className="h-64">
          <div className="space-y-2">
            {issues.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No validation issues found</p>
                <p className="text-xs text-gray-400">Click "Run Validation" to check your schema</p>
              </div>
            ) : (
              issues.map((issue) => (
                <Card key={issue.id} className="p-3">
                  <div className="flex items-start gap-3">
                    {getIssueIcon(issue.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={getIssueBadgeVariant(issue.type)} className="text-xs">
                          {issue.type}
                        </Badge>
                        {issue.table && (
                          <span className="text-xs font-medium text-gray-600">
                            {issue.table}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium">{issue.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{issue.description}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* Schema Statistics */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Schema Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <TableIcon className="w-3 h-3 text-blue-500" />
              <span>Tables: {schema.tables.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-3 h-3 text-green-500" />
              <span>Relationships: {schema.relationships.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-3 h-3 text-purple-500" />
              <span>Total Columns: {schema.tables.reduce((acc, table) => acc + table.columns.length, 0)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-3 h-3 text-orange-500" />
              <span>Primary Keys: {schema.tables.reduce((acc, table) => acc + table.columns.filter(c => c.isPrimaryKey).length, 0)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};