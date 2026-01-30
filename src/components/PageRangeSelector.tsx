import { useState } from 'react';
import { Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PageRangeSelectorProps {
  totalPages: number;
  onSelectRange: (indices: number[]) => void;
  disabled: boolean;
}

export function PageRangeSelector({ totalPages, onSelectRange, disabled }: PageRangeSelectorProps) {
  const [open, setOpen] = useState(false);
  const [rangeInput, setRangeInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const parseRange = (input: string): number[] => {
    const indices: Set<number> = new Set();
    const parts = input.split(',').map((s) => s.trim()).filter(Boolean);

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
        if (isNaN(start) || isNaN(end)) {
          throw new Error(`Invalid range: ${part}`);
        }
        if (start < 1 || end > totalPages || start > end) {
          throw new Error(`Range ${part} is out of bounds (1-${totalPages})`);
        }
        for (let i = start; i <= end; i++) {
          indices.add(i - 1); // Convert to 0-indexed
        }
      } else {
        const num = parseInt(part, 10);
        if (isNaN(num)) {
          throw new Error(`Invalid number: ${part}`);
        }
        if (num < 1 || num > totalPages) {
          throw new Error(`Page ${num} is out of bounds (1-${totalPages})`);
        }
        indices.add(num - 1); // Convert to 0-indexed
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleApply = () => {
    setError(null);
    try {
      const indices = parseRange(rangeInput);
      if (indices.length === 0) {
        setError('Please enter at least one page or range');
        return;
      }
      onSelectRange(indices);
      setOpen(false);
      setRangeInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || totalPages === 0}>
          <Hash className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Range</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Select Page Range
          </DialogTitle>
          <DialogDescription>
            Enter page numbers or ranges to select. Use commas to separate, and dashes for ranges.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="range-input">Page Range</Label>
            <Input
              id="range-input"
              placeholder="e.g., 1-5, 8, 10-12"
              value={rangeInput}
              onChange={(e) => {
                setRangeInput(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleApply();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">
              Available pages: 1 to {totalPages}
            </p>
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => setRangeInput('1-' + totalPages)}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => setRangeInput(Array.from({ length: Math.ceil(totalPages / 2) }, (_, i) => i * 2 + 1).join(', '))}
            >
              Odd
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => setRangeInput(Array.from({ length: Math.floor(totalPages / 2) }, (_, i) => (i + 1) * 2).join(', '))}
            >
              Even
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
              onClick={() => setRangeInput('1-' + Math.ceil(totalPages / 2))}
            >
              First half
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm col-span-2 sm:col-span-1"
              onClick={() => setRangeInput((Math.ceil(totalPages / 2) + 1) + '-' + totalPages)}
            >
              Second half
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>
            Select Pages
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
