import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Check, GripVertical, Eye, RotateCw } from 'lucide-react';
import type { PageSelection } from '@/types/pdf';

interface PageListItemProps {
  page: PageSelection;
  onToggle: (id: string) => void;
  onViewDetails: (page: PageSelection) => void;
  isFocused?: boolean;
}

export function PageListItem({ page, onToggle, onViewDetails, isFocused = false }: PageListItemProps) {
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
      className={`flex items-center gap-4 p-3 bg-card rounded-lg border transition-all ${
        page.selected ? 'border-primary/50 bg-accent/30' : 'border-border/50 opacity-60'
      } ${isDragging ? 'shadow-lg scale-[1.02] z-50' : ''} ${
        isFocused ? 'ring-2 ring-primary' : ''
      }`}
      onDoubleClick={() => onViewDetails(page)}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="p-1.5 rounded-md hover:bg-muted cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Thumbnail */}
      <div className="w-12 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
        {page.thumbnail ? (
          <img
            src={page.thumbnail}
            alt={`Page ${page.pageNumber}`}
            className="w-full h-full object-contain"
            style={{ transform: `rotate(${page.rotation}deg)` }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            ...
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground">Page {page.pageNumber}</p>
          {page.rotation !== 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-xs bg-muted rounded">
              <RotateCw className="w-3 h-3" />
              {page.rotation}°
            </span>
          )}
          {page.annotations.length > 0 && (
            <span className="px-1.5 py-0.5 text-xs bg-primary/10 text-primary rounded">
              {page.annotations.length} annotations
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate">{page.pdfName}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onViewDetails(page)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          aria-label="View details"
        >
          <Eye className="w-4 h-4 text-muted-foreground" />
        </button>
        
        <button
          onClick={() => onToggle(page.id)}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
            page.selected
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted border border-border'
          }`}
          aria-label={page.selected ? 'Deselect page' : 'Select page'}
        >
          {page.selected && <Check className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
