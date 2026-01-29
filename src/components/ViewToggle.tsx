import { Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ViewMode } from '@/types/pdf';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onViewModeChange('grid')}
        aria-label="Grid view"
      >
        <Grid3X3 className="w-4 h-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'ghost'}
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => onViewModeChange('list')}
        aria-label="List view"
      >
        <List className="w-4 h-4" />
      </Button>
    </div>
  );
}
