import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { PageCard } from './PageCard';
import { PageListItem } from './PageListItem';
import type { PageSelection, ViewMode } from '@/types/pdf';

interface PageGridProps {
  pages: PageSelection[];
  viewMode: ViewMode;
  onReorder: (pages: PageSelection[]) => void;
  onToggle: (id: string) => void;
  onViewDetails: (page: PageSelection) => void;
}

export function PageGrid({ pages, viewMode, onReorder, onToggle, onViewDetails }: PageGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = pages.findIndex((p) => p.id === active.id);
      const newIndex = pages.findIndex((p) => p.id === over.id);
      onReorder(arrayMove(pages, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={pages.map((p) => p.id)} 
        strategy={viewMode === 'grid' ? rectSortingStrategy : verticalListSortingStrategy}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {pages.map((page) => (
              <PageCard 
                key={page.id} 
                page={page} 
                onToggle={onToggle} 
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {pages.map((page) => (
              <PageListItem 
                key={page.id} 
                page={page} 
                onToggle={onToggle}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        )}
      </SortableContext>
    </DndContext>
  );
}
