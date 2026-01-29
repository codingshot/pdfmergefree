import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical, Eye } from 'lucide-react';
import type { PageSelection } from '@/types/pdf';

interface PageCardProps {
  page: PageSelection;
  onToggle: (id: string) => void;
  onViewDetails: (page: PageSelection) => void;
}

export function PageCard({ page, onToggle, onViewDetails }: PageCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`page-card group ${page.selected ? 'page-card-selected' : 'opacity-50'} ${
        isDragging ? 'dragging' : ''
      }`}
      onDoubleClick={() => onViewDetails(page)}
    >
      <div className="relative">
        {/* Thumbnail */}
        <div className="page-thumbnail">
          {page.thumbnail ? (
            <img
              src={page.thumbnail}
              alt={`Page ${page.pageNumber}`}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-muted-foreground text-sm">Loading...</div>
          )}
        </div>
        
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1.5 rounded-lg bg-card/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shadow-sm"
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </button>
        
        {/* View details button */}
        <button
          onClick={() => onViewDetails(page)}
          className="absolute bottom-2 left-2 p-1.5 rounded-lg bg-card/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          aria-label="View page details"
        >
          <Eye className="w-4 h-4 text-muted-foreground" />
        </button>
        
        {/* Selection checkbox */}
        <button
          onClick={() => onToggle(page.id)}
          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-sm ${
            page.selected
              ? 'bg-primary text-primary-foreground'
              : 'bg-card/90 backdrop-blur-sm border border-border'
          }`}
        >
          {page.selected && <Check className="w-4 h-4" />}
        </button>
      </div>
      
      {/* Page info */}
      <div className="p-2 sm:p-3">
        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
          Page {page.pageNumber}
        </p>
        <p className="text-xs text-muted-foreground truncate" title={page.pdfName}>
          {page.pdfName}
        </p>
      </div>
    </div>
  );
}
