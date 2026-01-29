import { RotateCw, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface RotationControlsProps {
  rotation: number;
  onRotate: (degrees: number) => void;
  compact?: boolean;
}

export function RotationControls({ rotation, onRotate, compact = false }: RotationControlsProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onRotate((rotation - 90 + 360) % 360)}
          title="Rotate left (Shift+R)"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onRotate((rotation + 90) % 360)}
          title="Rotate right (R)"
        >
          <RotateCw className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <RotateCw className="w-4 h-4 mr-2" />
          {rotation}°
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onRotate(0)}>
          0° (Original)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRotate(90)}>
          90° Clockwise
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRotate(180)}>
          180° Flip
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onRotate(270)}>
          270° Counter-clockwise
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
