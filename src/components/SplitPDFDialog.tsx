import { useState } from 'react';
import { Scissors, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SplitPDFDialogProps {
  selectedCount: number;
  onSplit: (mode: 'individual' | 'chunks', chunkSize?: number) => void;
  disabled: boolean;
}

export function SplitPDFDialog({ selectedCount, onSplit, disabled }: SplitPDFDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'individual' | 'chunks'>('individual');
  const [chunkSize, setChunkSize] = useState('2');

  const handleSplit = () => {
    if (mode === 'individual') {
      onSplit('individual');
    } else {
      const size = parseInt(chunkSize, 10);
      if (size > 0) {
        onSplit('chunks', size);
      }
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || selectedCount === 0}
          title="Split selected pages into separate files"
        >
          <Scissors className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Split</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scissors className="w-5 h-5" />
            Split PDF
          </DialogTitle>
          <DialogDescription>
            Split {selectedCount} selected page{selectedCount !== 1 ? 's' : ''} into separate PDF files.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'individual' | 'chunks')}>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="individual" id="individual" />
              <div className="space-y-1">
                <Label htmlFor="individual" className="font-medium cursor-pointer">
                  One page per file
                </Label>
                <p className="text-xs text-muted-foreground">
                  Each selected page becomes its own PDF file
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <RadioGroupItem value="chunks" id="chunks" />
              <div className="space-y-1">
                <Label htmlFor="chunks" className="font-medium cursor-pointer">
                  Split into chunks
                </Label>
                <p className="text-xs text-muted-foreground">
                  Group pages into files of specified size
                </p>
              </div>
            </div>
          </RadioGroup>

          {mode === 'chunks' && (
            <div className="space-y-2 pl-6">
              <Label htmlFor="chunk-size">Pages per file</Label>
              <Input
                id="chunk-size"
                type="number"
                min="1"
                max={selectedCount}
                value={chunkSize}
                onChange={(e) => setChunkSize(e.target.value)}
                className="w-24"
              />
            </div>
          )}

          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="text-muted-foreground">
              {mode === 'individual' ? (
                <>This will create <strong>{selectedCount}</strong> PDF file{selectedCount !== 1 ? 's' : ''}.</>
              ) : (
                <>This will create <strong>{Math.ceil(selectedCount / parseInt(chunkSize || '1', 10))}</strong> PDF file{Math.ceil(selectedCount / parseInt(chunkSize || '1', 10)) !== 1 ? 's' : ''}.</>
              )}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSplit}>
            <Download className="w-4 h-4 mr-2" />
            Download Split PDFs
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
