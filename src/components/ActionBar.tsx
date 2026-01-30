import { Trash2, Plus, CheckSquare, Square, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewToggle } from '@/components/ViewToggle';
import { DownloadMenu } from '@/components/DownloadMenu';
import { CompressionDialog } from '@/components/CompressionDialog';
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp';
import { PageSizeDialog } from '@/components/PageSizeDialog';
import { PDFMixDialog } from '@/components/PDFMixDialog';
import { RichTextEditor } from '@/components/RichTextEditor';
import { PageRangeSelector } from '@/components/PageRangeSelector';
import { SplitPDFDialog } from '@/components/SplitPDFDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { ViewMode, DownloadFormat, PageSelection, DocumentGroup, PageSizeSettings } from '@/types/pdf';

interface ActionBarProps {
  totalPages: number;
  selectedCount: number;
  loading: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddMore: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectByIndices: (indices: number[]) => void;
  onClear: () => void;
  onDownload: (format: DownloadFormat) => void;
  onSplit: (mode: 'individual' | 'chunks', chunkSize?: number, baseFileName?: string) => void;
  showGroupView: boolean;
  onToggleGroupView: () => void;
  pages: PageSelection[];
  onCompress: (quality: number, targetSizeKB?: number, applyToAll?: boolean) => void;
  documentGroups: DocumentGroup[];
  onMixPages: (mixedPages: PageSelection[]) => void;
  pageSize: PageSizeSettings;
  onPageSizeChange: (settings: PageSizeSettings) => void;
  onCreateDocument: (name: string, htmlContent: string) => void;
  progress?: { current: number; total: number } | null;
}

export function ActionBar({
  totalPages,
  selectedCount,
  loading,
  viewMode,
  onViewModeChange,
  onAddMore,
  onSelectAll,
  onDeselectAll,
  onSelectByIndices,
  onClear,
  onDownload,
  onSplit,
  showGroupView,
  onToggleGroupView,
  pages,
  onCompress,
  documentGroups,
  onMixPages,
  pageSize,
  onPageSizeChange,
  onCreateDocument,
  progress,
}: ActionBarProps) {
  return (
    <div className="flex flex-col gap-3 p-3 sm:p-4 bg-card rounded-xl border border-border shadow-sm">
      {/* Progress indicator */}
      {progress && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
          <span>{progress.current}/{progress.total}</span>
        </div>
      )}
      
      {/* Main toolbar - wraps on mobile */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddMore}
          disabled={loading}
        >
          <Plus className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Add Files</span>
        </Button>
        
        <RichTextEditor onCreateDocument={onCreateDocument} loading={loading} />
        
        <div className="hidden sm:block h-6 w-px bg-border" />
        
        <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
        
        <Button
          variant={showGroupView ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onToggleGroupView}
          title="Group by document"
        >
          <FolderOpen className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Group</span>
        </Button>
        
        <div className="hidden sm:block h-6 w-px bg-border" />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={selectedCount === totalPages ? onDeselectAll : onSelectAll}
          disabled={loading}
        >
          {selectedCount === totalPages ? (
            <>
              <Square className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Deselect</span>
            </>
          ) : (
            <>
              <CheckSquare className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Select All</span>
            </>
          )}
        </Button>
        
        <PageRangeSelector
          totalPages={totalPages}
          onSelectRange={onSelectByIndices}
          disabled={loading}
        />
        
        <CompressionDialog
          pages={pages}
          selectedCount={selectedCount}
          onCompress={onCompress}
          loading={loading}
        />
        
        <PageSizeDialog
          settings={pageSize}
          onSettingsChange={onPageSizeChange}
        />
        
        <PDFMixDialog
          documentGroups={documentGroups}
          pages={pages}
          onMix={onMixPages}
          disabled={loading}
        />
        
        <SplitPDFDialog
          selectedCount={selectedCount}
          onSplit={onSplit}
          disabled={loading}
        />
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={loading}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Clear</span>
        </Button>
        
        <div className="hidden sm:block h-6 w-px bg-border" />
        
        <ThemeToggle />
        <KeyboardShortcutsHelp />
      </div>
      
      {/* Bottom row - selection count & download */}
      <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
        <span className="text-xs sm:text-sm text-muted-foreground">
          {selectedCount}/{totalPages} selected
        </span>
        
        <DownloadMenu
          disabled={selectedCount === 0}
          loading={loading}
          selectedCount={selectedCount}
          onDownload={onDownload}
        />
      </div>
    </div>
  );
}
