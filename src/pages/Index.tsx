import { useCallback } from 'react';
import { FileStack } from 'lucide-react';
import { PDFDropZone } from '@/components/PDFDropZone';
import { PageGrid } from '@/components/PageGrid';
import { ActionBar } from '@/components/ActionBar';
import { usePDFProcessor } from '@/hooks/usePDFProcessor';

const Index = () => {
  const {
    pages,
    loading,
    error,
    addPDFs,
    togglePageSelection,
    reorderPages,
    removeAllPDFs,
    downloadMergedPDF,
    selectedCount,
  } = usePDFProcessor();

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

  return (
    <div className="min-h-screen gradient-mesh">
      <div className="container max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <FileStack className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            PDF Merger
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Combine multiple PDFs into one. Select pages, reorder them, and download your merged document.
          </p>
        </header>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-center">
            {error}
          </div>
        )}

        {/* Main content */}
        {pages.length === 0 ? (
          <div className="max-w-xl mx-auto">
            <PDFDropZone onFilesAdded={addPDFs} loading={loading} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Action bar */}
            <ActionBar
              totalPages={pages.length}
              selectedCount={selectedCount}
              loading={loading}
              onAddMore={() => document.getElementById('pdf-input-hidden')?.click()}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onClear={removeAllPDFs}
              onDownload={downloadMergedPDF}
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

            {/* Page grid */}
            <div className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50">
              <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                <span>💡</span>
                <span>Drag pages to reorder them. Click the checkmark to select/deselect.</span>
              </div>
              <PageGrid
                pages={pages}
                onReorder={reorderPages}
                onToggle={togglePageSelection}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>All processing happens locally in your browser. Your files never leave your device.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
