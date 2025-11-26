'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Grid3X3,
  Zap,
  MousePointer2,
  Layout,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { useFlowStore } from '@/store/flow';

export const Toolbar: React.FC<{
  onAutoLayout: () => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
}> = ({ onAutoLayout, onToggleGrid, onToggleSnap }) => {
  const { toolbar } = useFlowStore();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">SQL Schema Designer</h1>
          <span className="text-sm text-gray-500">Draw.io Mode</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Tool Selection */}
        <div className="flex items-center border rounded-lg">
          <Button
            variant={toolbar.selectedTool === 'select' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-r-none"
            onClick={() => useFlowStore.getState().setToolbar({ selectedTool: 'select' })}
          >
            <MousePointer2 className="w-4 h-4" />
          </Button>
          <Button
            variant={toolbar.selectedTool === 'pan' ? 'default' : 'ghost'}
            size="sm"
            className="rounded-l-none"
            onClick={() => useFlowStore.getState().setToolbar({ selectedTool: 'pan' })}
          >
            <Layout className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* View Options */}
        <div className="flex items-center gap-1">
          <Button
            variant={toolbar.isGridVisible ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleGrid}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={toolbar.snapToGrid ? 'default' : 'outline'}
            size="sm"
            onClick={onToggleSnap}
          >
            <Zap className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Layout Actions */}
        <Button
          variant="outline"
          size="sm"
          onClick={onAutoLayout}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Auto Layout
        </Button>
      </div>
    </div>
  );
};