import { ChevronDown, ChevronRight, Check, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { DocumentGroup, PageSelection } from '@/types/pdf';

interface DocumentGroupViewProps {
  groups: DocumentGroup[];
  onToggleGroup: (pdfId: string) => void;
  onToggleGroupCollapse: (pdfId: string) => void;
  onSelectAllInGroup: (pdfId: string) => void;
  onDeselectAllInGroup: (pdfId: string) => void;
  onPageClick: (page: PageSelection) => void;
  onTogglePage: (pageId: string) => void;
}

export function DocumentGroupView({
  groups,
  onToggleGroupCollapse,
  onSelectAllInGroup,
  onDeselectAllInGroup,
  onPageClick,
  onTogglePage,
}: DocumentGroupViewProps) {
  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const selectedCount = group.pages.filter((p) => p.selected).length;
        const totalCount = group.pages.length;

        return (
          <div key={group.pdfId} className="bg-card rounded-xl border border-border/50 overflow-hidden">
            {/* Group header */}
            <div className="flex items-center gap-3 p-4 bg-muted/50">
              <button
                onClick={() => onToggleGroupCollapse(group.pdfId)}
                className="p-1 rounded hover:bg-muted transition-colors"
              >
                {group.collapsed ? (
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{group.pdfName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedCount} of {totalCount} pages selected
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    group.allSelected
                      ? onDeselectAllInGroup(group.pdfId)
                      : onSelectAllInGroup(group.pdfId)
                  }
                >
                  {group.allSelected ? (
                    <>
                      <Square className="w-4 h-4 mr-1" />
                      Deselect
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Select All
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Pages grid */}
            {!group.collapsed && (
              <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {group.pages.map((page) => (
                  <div
                    key={page.id}
                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                      page.selected
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent opacity-50 hover:opacity-75'
                    }`}
                    onDoubleClick={() => onPageClick(page)}
                  >
                    <div className="aspect-[3/4] bg-muted">
                      {page.thumbnail && (
                        <img
                          src={page.thumbnail}
                          alt={`Page ${page.pageNumber}`}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </div>
                    
                    {/* Page number badge */}
                    <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-card/90 rounded text-xs font-medium">
                      {page.pageNumber}
                    </div>

                    {/* Selection toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePage(page.id);
                      }}
                      className={`absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        page.selected
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card/90 border border-border opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {page.selected && <Check className="w-3 h-3" />}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
