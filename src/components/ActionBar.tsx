import { Download, Trash2, Plus, CheckSquare, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ActionBarProps {
  totalPages: number;
  selectedCount: number;
  loading: boolean;
  onAddMore: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onClear: () => void;
  onDownload: () => void;
}

export function ActionBar({
  totalPages,
  selectedCount,
  loading,
  onAddMore,
  onSelectAll,
  onDeselectAll,
  onClear,
  onDownload,
}: ActionBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card rounded-xl border border-border shadow-sm">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddMore}
          disabled={loading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add PDFs
        </Button>
        
        <div className="h-6 w-px bg-border" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={selectedCount === totalPages ? onDeselectAll : onSelectAll}
          disabled={loading}
        >
          {selectedCount === totalPages ? (
            <>
              <Square className="w-4 h-4 mr-2" />
              Deselect All
            </>
          ) : (
            <>
              <CheckSquare className="w-4 h-4 mr-2" />
              Select All
            </>
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={loading}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </Button>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {selectedCount} of {totalPages} pages selected
        </span>
        
        <Button
          onClick={onDownload}
          disabled={loading || selectedCount === 0}
          className="shadow-lg shadow-primary/25"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
