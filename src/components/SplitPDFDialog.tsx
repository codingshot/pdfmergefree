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
  onSplit: (mode: 'individual' | 'chunks', chunkSize?: number, baseFileName?: string) => void;
  disabled: boolean;
}

export function SplitPDFDialog({ selectedCount, onSplit, disabled }: SplitPDFDialogProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'individual' | 'chunks'>('individual');
  const [chunkSize, setChunkSize] = useState('2');
  const [baseFileName, setBaseFileName] = useState('page');

  const handleSplit = () => {
    if (mode === 'individual') {
      onSplit('individual', undefined, baseFileName);
    } else {
      const size = parseInt(chunkSize, 10);
      if (size > 0) {
        onSplit('chunks', size, baseFileName);
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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
          {/* Base filename */}
          <div className="space-y-2">
            <Label htmlFor="base-filename">File name prefix</Label>
            <Input
              id="base-filename"
              placeholder="e.g., document, page"
              value={baseFileName}
              onChange={(e) => setBaseFileName(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Files will be named: {baseFileName}-1.pdf, {baseFileName}-2.pdf, etc.
            </p>
          </div>

          <RadioGroup value={mode} onValueChange={(v) => setMode(v as 'individual' | 'chunks')}>
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="individual" id="individual" className="mt-1" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="individual" className="font-medium cursor-pointer">
                  One page per file
                </Label>
                <p className="text-xs text-muted-foreground">
                  Each selected page becomes its own PDF file
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="chunks" id="chunks" className="mt-1" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="chunks" className="font-medium cursor-pointer">
                  Split into chunks
                </Label>
                <p className="text-xs text-muted-foreground">
                  Group pages into files of specified size
                </p>
                {mode === 'chunks' && (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      id="chunk-size"
                      type="number"
                      min="1"
                      max={selectedCount}
                      value={chunkSize}
                      onChange={(e) => setChunkSize(e.target.value)}
                      className="w-20"
                    />
                    <span className="text-xs text-muted-foreground">pages per file</span>
                  </div>
                )}
              </div>
            </div>
          </RadioGroup>

          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="text-muted-foreground">
              {mode === 'individual' ? (
                <>This will create <strong>{selectedCount}</strong> PDF file{selectedCount !== 1 ? 's' : ''} in a ZIP archive.</>
              ) : (
                <>This will create <strong>{Math.ceil(selectedCount / parseInt(chunkSize || '1', 10))}</strong> PDF file{Math.ceil(selectedCount / parseInt(chunkSize || '1', 10)) !== 1 ? 's' : ''} in a ZIP archive.</>
              )}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSplit} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Download ZIP
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
