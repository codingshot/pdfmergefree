import { Trash2, Plus, CheckSquare, Square, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ViewToggle } from '@/components/ViewToggle';
import { DownloadMenu } from '@/components/DownloadMenu';
import { CompressionDialog } from '@/components/CompressionDialog';
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp';
import { PasswordProtectionDialog } from '@/components/PasswordProtectionDialog';
import { PageSizeDialog } from '@/components/PageSizeDialog';
import { PDFMixDialog } from '@/components/PDFMixDialog';
import { RichTextEditor } from '@/components/RichTextEditor';
import type { ViewMode, DownloadFormat, PageSelection, DocumentGroup, PageSizeSettings, PDFExportSettings } from '@/types/pdf';

interface ActionBarProps {
  totalPages: number;
  selectedCount: number;
  loading: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddMore: () => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onClear: () => void;
  onDownload: (format: DownloadFormat) => void;
  showGroupView: boolean;
  onToggleGroupView: () => void;
  pages: PageSelection[];
  onCompress: (quality: number, targetSizeKB?: number, applyToAll?: boolean) => void;
  documentGroups: DocumentGroup[];
  onMixPages: (mixedPages: PageSelection[]) => void;
  exportSettings: PDFExportSettings;
  onUpdateExportSettings: (settings: Partial<PDFExportSettings>) => void;
  onCreateDocument: (name: string, htmlContent: string) => void;
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
  onClear,
  onDownload,
  showGroupView,
  onToggleGroupView,
  pages,
  onCompress,
  documentGroups,
  onMixPages,
  exportSettings,
  onUpdateExportSettings,
  onCreateDocument,
}: ActionBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-card rounded-xl border border-border shadow-sm">
      {/* Left side actions */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
              <span className="hidden sm:inline">Deselect All</span>
            </>
          ) : (
            <>
              <CheckSquare className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Select All</span>
            </>
          )}
        </Button>
        
        <CompressionDialog
          pages={pages}
          selectedCount={selectedCount}
          onCompress={onCompress}
          loading={loading}
        />
        
        <PasswordProtectionDialog
          enabled={!!exportSettings.password}
          password={exportSettings.password || ''}
          onPasswordChange={(password) => onUpdateExportSettings({ password: password || undefined })}
          onEnabledChange={() => {}}
        />
        
        <PageSizeDialog
          settings={exportSettings.pageSize}
          onSettingsChange={(pageSize) => onUpdateExportSettings({ pageSize })}
        />
        
        <PDFMixDialog
          documentGroups={documentGroups}
          pages={pages}
          onMix={onMixPages}
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
        
        <KeyboardShortcutsHelp />
      </div>
      
      {/* Right side - selection count & download */}
      <div className="flex items-center justify-between sm:justify-end gap-4">
        <span className="text-sm text-muted-foreground">
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
