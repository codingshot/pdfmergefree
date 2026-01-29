import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { RotationControls } from '@/components/RotationControls';
import type { PageSelection } from '@/types/pdf';

interface PageDetailModalProps {
  page: PageSelection | null;
  pages: PageSelection[];
  onClose: () => void;
  onToggle: (id: string) => void;
  onNavigate: (page: PageSelection) => void;
  onRotate: (pageId: string, rotation: number) => void;
  onEdit: (page: PageSelection) => void;
}

export function PageDetailModal({ 
  page, 
  pages, 
  onClose, 
  onToggle, 
  onNavigate, 
  onRotate,
  onEdit,
}: PageDetailModalProps) {
  const [zoom, setZoom] = useState(1);
  
  // Reset zoom when page changes
  useEffect(() => {
    setZoom(1);
  }, [page?.id]);
  
  if (!page) return null;

  const currentIndex = pages.findIndex((p) => p.id === page.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < pages.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      onNavigate(pages[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(pages[currentIndex + 1]);
    }
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));

  return (
    <Dialog open={!!page} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between gap-4">
            <DialogTitle className="text-lg font-semibold truncate">
              Page {page.pageNumber} of {page.pdfName}
            </DialogTitle>
            <div className="flex items-center gap-2 flex-shrink-0">
              <RotationControls
                rotation={page.rotation}
                onRotate={(rotation) => onRotate(page.id, rotation)}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(page)}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggle(page.id)}
                className={page.selected ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
              >
                <Check className="w-4 h-4 mr-1" />
                {page.selected ? 'Selected' : 'Select'}
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Image viewer */}
        <div className="relative flex-1 overflow-auto bg-muted/50 min-h-[400px] max-h-[60vh]">
          <div className="flex items-center justify-center p-4 min-h-full">
            {page.thumbnail && (
              <img
                src={page.thumbnail}
                alt={`Page ${page.pageNumber}`}
                className="max-w-full max-h-full object-contain shadow-lg rounded-lg transition-transform"
                style={{ 
                  transform: `scale(${zoom}) rotate(${page.rotation}deg)`,
                }}
              />
            )}
          </div>

          {/* Navigation arrows */}
          {hasPrev && (
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/90 shadow-lg hover:bg-card transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {hasNext && (
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-card/90 shadow-lg hover:bg-card transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Footer with zoom controls */}
        <div className="flex items-center justify-between p-4 border-t bg-card">
          <div className="text-sm text-muted-foreground">
            Page {currentIndex + 1} of {pages.length}
            {page.rotation !== 0 && (
              <span className="ml-2 text-primary">• Rotated {page.rotation}°</span>
            )}
            {page.annotations.length > 0 && (
              <span className="ml-2 text-primary">• {page.annotations.length} annotations</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm w-16 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 3}>
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
