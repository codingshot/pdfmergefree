import { useCallback, useState } from 'react';
import { FileStack } from 'lucide-react';
import { PDFDropZone } from '@/components/PDFDropZone';
import { PageGrid } from '@/components/PageGrid';
import { ActionBar } from '@/components/ActionBar';
import { PageDetailModal } from '@/components/PageDetailModal';
import { DocumentGroupView } from '@/components/DocumentGroupView';
import { usePDFProcessor } from '@/hooks/usePDFProcessor';
import type { PageSelection, ViewMode } from '@/types/pdf';

const Index = () => {
  const {
    pages,
    loading,
    error,
    addPDFs,
    togglePageSelection,
    reorderPages,
    removeAllPDFs,
    download,
    selectedCount,
    documentGroups,
    toggleGroupCollapse,
    selectAllInGroup,
    deselectAllInGroup,
  } = usePDFProcessor();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showGroupView, setShowGroupView] = useState(false);
  const [selectedPage, setSelectedPage] = useState<PageSelection | null>(null);

  const handleSelectAll = useCallback(() => {
    pages.forEach((page) => {
      if (!page.selected) {
        togglePageSelection(page.id);
      }
    });
  }, [pages, togglePageSelection]);

  const handleDeselectAll = useCallback(() => {
    pages.forEach((page) => {
      if (page.selected) {
        togglePageSelection(page.id);
      }
    });
  }, [pages, togglePageSelection]);

  const handleViewDetails = useCallback((page: PageSelection) => {
    setSelectedPage(page);
  }, []);

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="container max-w-7xl py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 mb-4">
            <FileStack className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2">
            PDF Merger
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Combine multiple PDFs into one. Select pages, reorder them, and download your merged document.
          </p>
        </header>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-center text-sm">
            {error}
          </div>
        )}

        {/* Main content */}
        {pages.length === 0 ? (
          <div className="max-w-xl mx-auto">
            <PDFDropZone onFilesAdded={addPDFs} loading={loading} />
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {/* Action bar */}
            <ActionBar
              totalPages={pages.length}
              selectedCount={selectedCount}
              loading={loading}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onAddMore={() => document.getElementById('pdf-input-hidden')?.click()}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onClear={removeAllPDFs}
              onDownload={download}
              showGroupView={showGroupView}
              onToggleGroupView={() => setShowGroupView(!showGroupView)}
            />

            {/* Hidden file input for adding more PDFs */}
            <input
              id="pdf-input-hidden"
              type="file"
              accept=".pdf,application/pdf"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  addPDFs(e.target.files);
                }
                e.target.value = '';
              }}
            />

            {/* Page grid or group view */}
            <div className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
              <div className="flex items-center gap-2 mb-4 text-xs sm:text-sm text-muted-foreground">
                <span>💡</span>
                <span className="hidden sm:inline">Drag pages to reorder. Click checkmark to select/deselect. Double-click to view details.</span>
                <span className="sm:hidden">Drag to reorder. Tap checkmark to select.</span>
              </div>
              
              {showGroupView ? (
                <DocumentGroupView
                  groups={documentGroups}
                  onToggleGroup={togglePageSelection}
                  onToggleGroupCollapse={toggleGroupCollapse}
                  onSelectAllInGroup={selectAllInGroup}
                  onDeselectAllInGroup={deselectAllInGroup}
                  onPageClick={handleViewDetails}
                  onTogglePage={togglePageSelection}
                />
              ) : (
                <PageGrid
                  pages={pages}
                  viewMode={viewMode}
                  onReorder={reorderPages}
                  onToggle={togglePageSelection}
                  onViewDetails={handleViewDetails}
                />
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-10 sm:mt-12 text-center text-xs sm:text-sm text-muted-foreground">
          <p>All processing happens locally in your browser. Your files never leave your device.</p>
        </footer>
      </div>

      {/* Page detail modal */}
      <PageDetailModal
        page={selectedPage}
        pages={pages}
        onClose={() => setSelectedPage(null)}
        onToggle={togglePageSelection}
        onNavigate={setSelectedPage}
      />
    </div>
  );
};

export default Index;
