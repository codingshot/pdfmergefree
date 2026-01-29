import { useRef, useState, useEffect, useCallback } from 'react';
import { Highlighter, PenTool, Type, Eraser, Undo, Redo, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { PageSelection, Annotation } from '@/types/pdf';

interface AnnotationEditorProps {
  page: PageSelection | null;
  onClose: () => void;
  onSave: (pageId: string, annotations: Annotation[]) => void;
}

type Tool = 'highlight' | 'draw' | 'text' | 'eraser' | null;

const COLORS = [
  '#FFEB3B', // Yellow
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#E91E63', // Pink
  '#FF5722', // Orange
  '#9C27B0', // Purple
];

export function AnnotationEditor({ page, onClose, onSave }: AnnotationEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('highlight');
  const [color, setColor] = useState(COLORS[0]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [history, setHistory] = useState<Annotation[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);

  // Initialize annotations from page
  useEffect(() => {
    if (page) {
      setAnnotations(page.annotations || []);
      setHistory([page.annotations || []]);
      setHistoryIndex(0);
    }
  }, [page]);

  // Draw on canvas
  useEffect(() => {
    if (!canvasRef.current || !page?.thumbnail) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw annotations
      annotations.forEach((annotation) => {
        if (annotation.type === 'highlight') {
          ctx.fillStyle = annotation.color || 'rgba(255, 235, 59, 0.4)';
          ctx.fillRect(
            annotation.x * canvas.width,
            annotation.y * canvas.height,
            annotation.width * canvas.width,
            annotation.height * canvas.height
          );
        } else if (annotation.type === 'drawing' && annotation.points) {
          ctx.strokeStyle = annotation.color || '#000';
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          annotation.points.forEach((point, i) => {
            const x = point.x * canvas.width;
            const y = point.y * canvas.height;
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          });
          ctx.stroke();
        } else if (annotation.type === 'signature' && annotation.content) {
          const sigImg = new Image();
          sigImg.onload = () => {
            ctx.drawImage(
              sigImg,
              annotation.x * canvas.width,
              annotation.y * canvas.height,
              annotation.width * canvas.width,
              annotation.height * canvas.height
            );
          };
          sigImg.src = annotation.content;
        }
      });

      // Draw current path
      if (currentPath.length > 0) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        currentPath.forEach((point, i) => {
          const x = point.x * canvas.width;
          const y = point.y * canvas.height;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.stroke();
      }
    };
    img.src = page.thumbnail;
  }, [page, annotations, currentPath, color]);

  const getCanvasCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: ((e.clientX - rect.left) * scaleX) / canvas.width,
      y: ((e.clientY - rect.top) * scaleY) / canvas.height,
    };
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!tool) return;
    setIsDrawing(true);

    const coords = getCanvasCoords(e);
    
    if (tool === 'draw') {
      setCurrentPath([coords]);
    } else if (tool === 'highlight') {
      setCurrentPath([coords]);
    }
  }, [tool, getCanvasCoords]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !tool) return;

    const coords = getCanvasCoords(e);

    if (tool === 'draw') {
      setCurrentPath(prev => [...prev, coords]);
    }
  }, [isDrawing, tool, getCanvasCoords]);

  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !tool) return;
    setIsDrawing(false);

    const coords = getCanvasCoords(e);

    if (tool === 'draw' && currentPath.length > 0) {
      const newAnnotation: Annotation = {
        id: crypto.randomUUID(),
        type: 'drawing',
        x: 0,
        y: 0,
        width: 1,
        height: 1,
        color,
        points: [...currentPath, coords],
      };
      addAnnotation(newAnnotation);
    } else if (tool === 'highlight' && currentPath.length > 0) {
      const startX = Math.min(currentPath[0].x, coords.x);
      const startY = Math.min(currentPath[0].y, coords.y);
      const endX = Math.max(currentPath[0].x, coords.x);
      const endY = Math.max(currentPath[0].y, coords.y);

      const newAnnotation: Annotation = {
        id: crypto.randomUUID(),
        type: 'highlight',
        x: startX,
        y: startY,
        width: endX - startX,
        height: endY - startY,
        color: color + '66', // Add transparency
      };
      addAnnotation(newAnnotation);
    }

    setCurrentPath([]);
  }, [isDrawing, tool, currentPath, color, getCanvasCoords]);

  const addAnnotation = (annotation: Annotation) => {
    const newAnnotations = [...annotations, annotation];
    setAnnotations(newAnnotations);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newAnnotations);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAnnotations(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAnnotations(history[historyIndex + 1]);
    }
  };

  const handleClearAll = () => {
    setAnnotations([]);
    const newHistory = [...history, []];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleSave = () => {
    if (page) {
      onSave(page.id, annotations);
      onClose();
    }
  };

  if (!page) return null;

  return (
    <Dialog open={!!page} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-5xl max-h-[95vh] p-0 gap-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle>Edit Page {page.pageNumber}</DialogTitle>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-3 border-b bg-muted/50">
          <div className="flex items-center gap-1 p-1 bg-card rounded-lg">
            <Button
              variant={tool === 'highlight' ? 'default' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setTool('highlight')}
              title="Highlight (drag to select area)"
            >
              <Highlighter className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === 'draw' ? 'default' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={() => setTool('draw')}
              title="Draw / Sign"
            >
              <PenTool className="w-4 h-4" />
            </Button>
            <Button
              variant={tool === 'eraser' ? 'default' : 'ghost'}
              size="sm"
              className="h-8"
              onClick={handleClearAll}
              title="Clear all"
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>

          <div className="h-6 w-px bg-border" />

          {/* Color picker */}
          <div className="flex items-center gap-1">
            {COLORS.map((c) => (
              <button
                key={c}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  color === c ? 'border-foreground scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>

          <div className="h-6 w-px bg-border" />

          {/* History controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1" />

          <Button onClick={handleSave} size="sm">
            <Save className="w-4 h-4 mr-2" />
            Save Annotations
          </Button>
        </div>

        {/* Canvas area */}
        <div className="relative flex-1 overflow-auto bg-muted/30 p-4 max-h-[70vh]">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full shadow-lg rounded-lg cursor-crosshair"
              style={{ 
                maxHeight: '60vh',
                transform: `rotate(${page.rotation}deg)`,
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => {
                if (isDrawing) {
                  setIsDrawing(false);
                  setCurrentPath([]);
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-card text-sm text-muted-foreground">
          <p>{annotations.length} annotation{annotations.length !== 1 ? 's' : ''}</p>
          <p>Tip: Use highlighter to mark areas, pen to draw or sign</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
