import { useState, useMemo } from 'react';
import { Minimize2, Target, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { PageSelection } from '@/types/pdf';

interface CompressionDialogProps {
  pages: PageSelection[];
  selectedCount: number;
  onCompress: (quality: number, targetSizeKB?: number, applyToAll?: boolean) => void;
  loading: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function CompressionDialog({ pages, selectedCount, onCompress, loading }: CompressionDialogProps) {
  const [open, setOpen] = useState(false);
  const [quality, setQuality] = useState(0.7);
  const [useTargetSize, setUseTargetSize] = useState(false);
  const [targetSizeKB, setTargetSizeKB] = useState(500);
  const [applyToAll, setApplyToAll] = useState(true);

  // Estimate sizes
  const estimatedSizes = useMemo(() => {
    const selectedPages = applyToAll ? pages : pages.filter(p => p.selected);
    const totalOriginal = selectedPages.reduce((acc, p) => acc + (p.originalSize || 50000), 0);
    const estimatedCompressed = totalOriginal * quality;
    const savings = totalOriginal - estimatedCompressed;
    const savingsPercent = totalOriginal > 0 ? (savings / totalOriginal) * 100 : 0;

    return {
      original: totalOriginal,
      compressed: estimatedCompressed,
      savings,
      savingsPercent,
      pageCount: selectedPages.length,
    };
  }, [pages, quality, applyToAll]);

  const handleCompress = () => {
    onCompress(quality, useTargetSize ? targetSizeKB : undefined, applyToAll);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={pages.length === 0}>
          <Minimize2 className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Compress</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Minimize2 className="w-5 h-5" />
            Compress PDF Pages
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Apply to selection */}
          <div className="flex items-center justify-between">
            <Label htmlFor="apply-all" className="flex flex-col gap-1">
              <span>Apply to all pages</span>
              <span className="text-xs text-muted-foreground font-normal">
                {applyToAll ? `All ${pages.length} pages` : `${selectedCount} selected pages`}
              </span>
            </Label>
            <Switch
              id="apply-all"
              checked={applyToAll}
              onCheckedChange={setApplyToAll}
            />
          </div>

          {/* Quality slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Compression Quality</Label>
              <span className="text-sm font-medium">{Math.round(quality * 100)}%</span>
            </div>
            <Slider
              value={[quality]}
              onValueChange={([v]) => setQuality(v)}
              min={0.1}
              max={1}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>

          {/* Target size option */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="use-target" className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                Target file size
              </Label>
              <Switch
                id="use-target"
                checked={useTargetSize}
                onCheckedChange={setUseTargetSize}
              />
            </div>
            {useTargetSize && (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={targetSizeKB}
                  onChange={(e) => setTargetSizeKB(Number(e.target.value))}
                  className="w-24"
                  min={10}
                  max={10000}
                />
                <span className="text-sm text-muted-foreground">KB per page</span>
              </div>
            )}
          </div>

          {/* Size preview */}
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <HardDrive className="w-4 h-4" />
              Size Estimate
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Original</p>
                <p className="font-medium">{formatBytes(estimatedSizes.original)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Compressed</p>
                <p className="font-medium text-primary">{formatBytes(estimatedSizes.compressed)}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-sm">
                <span className="text-muted-foreground">Savings: </span>
                <span className="font-medium text-success">
                  ~{formatBytes(estimatedSizes.savings)} ({Math.round(estimatedSizes.savingsPercent)}%)
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCompress} disabled={loading}>
            {loading ? 'Compressing...' : `Compress ${estimatedSizes.pageCount} Pages`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
