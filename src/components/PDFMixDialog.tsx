import { useState } from 'react';
import { Shuffle, ArrowDownUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { DocumentGroup, PageSelection } from '@/types/pdf';

interface PDFMixDialogProps {
  documentGroups: DocumentGroup[];
  pages: PageSelection[];
  onMix: (mixedPages: PageSelection[]) => void;
  disabled: boolean;
}

export function PDFMixDialog({ documentGroups, pages, onMix, disabled }: PDFMixDialogProps) {
  const [open, setOpen] = useState(false);
  const [doc1Id, setDoc1Id] = useState<string>('');
  const [doc2Id, setDoc2Id] = useState<string>('');
  const [reverseDoc2, setReverseDoc2] = useState(false);
  const [alternateMode, setAlternateMode] = useState<'1-1' | '2-1' | '1-2'>('1-1');

  const handleMix = () => {
    if (!doc1Id || !doc2Id) return;

    const doc1Pages = pages.filter((p) => p.pdfId === doc1Id);
    const doc2Pages = pages.filter((p) => p.pdfId === doc2Id);
    const otherPages = pages.filter((p) => p.pdfId !== doc1Id && p.pdfId !== doc2Id);

    // Optionally reverse doc2
    const orderedDoc2 = reverseDoc2 ? [...doc2Pages].reverse() : doc2Pages;

    // Alternate pages based on mode
    const mixed: PageSelection[] = [];
    const maxLen = Math.max(doc1Pages.length, orderedDoc2.length);

    for (let i = 0; i < maxLen; i++) {
      if (alternateMode === '1-1') {
        // One from doc1, one from doc2
        if (i < doc1Pages.length) mixed.push(doc1Pages[i]);
        if (i < orderedDoc2.length) mixed.push(orderedDoc2[i]);
      } else if (alternateMode === '2-1') {
        // Two from doc1, one from doc2
        const idx1a = i * 2;
        const idx1b = i * 2 + 1;
        if (idx1a < doc1Pages.length) mixed.push(doc1Pages[idx1a]);
        if (idx1b < doc1Pages.length) mixed.push(doc1Pages[idx1b]);
        if (i < orderedDoc2.length) mixed.push(orderedDoc2[i]);
      } else if (alternateMode === '1-2') {
        // One from doc1, two from doc2
        if (i < doc1Pages.length) mixed.push(doc1Pages[i]);
        const idx2a = i * 2;
        const idx2b = i * 2 + 1;
        if (idx2a < orderedDoc2.length) mixed.push(orderedDoc2[idx2a]);
        if (idx2b < orderedDoc2.length) mixed.push(orderedDoc2[idx2b]);
      }
    }

    // Add remaining pages from other documents
    onMix([...mixed, ...otherPages]);
    setOpen(false);
  };

  const canMix = doc1Id && doc2Id && doc1Id !== doc2Id;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled || documentGroups.length < 2}
          title="PDF Mix - Alternate pages from two documents"
        >
          <Shuffle className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Mix</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shuffle className="w-5 h-5" />
            PDF Mix
          </DialogTitle>
          <DialogDescription>
            Merge two PDFs by alternating their pages. Ideal for combining single-sided scans of front and back pages.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>First Document (Front Pages)</Label>
            <Select value={doc1Id} onValueChange={setDoc1Id}>
              <SelectTrigger>
                <SelectValue placeholder="Select first document..." />
              </SelectTrigger>
              <SelectContent>
                {documentGroups.map((group) => (
                  <SelectItem key={group.pdfId} value={group.pdfId}>
                    {group.pdfName} ({group.pages.length} pages)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Second Document (Back Pages)</Label>
            <Select value={doc2Id} onValueChange={setDoc2Id}>
              <SelectTrigger>
                <SelectValue placeholder="Select second document..." />
              </SelectTrigger>
              <SelectContent>
                {documentGroups
                  .filter((g) => g.pdfId !== doc1Id)
                  .map((group) => (
                    <SelectItem key={group.pdfId} value={group.pdfId}>
                      {group.pdfName} ({group.pages.length} pages)
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reverse Second Document</Label>
              <p className="text-xs text-muted-foreground">
                Useful when back pages are scanned in reverse order
              </p>
            </div>
            <Switch checked={reverseDoc2} onCheckedChange={setReverseDoc2} />
          </div>

          <div className="space-y-2">
            <Label>Alternating Pattern</Label>
            <Select value={alternateMode} onValueChange={(v) => setAlternateMode(v as typeof alternateMode)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-1">1:1 - One page from each</SelectItem>
                <SelectItem value="2-1">2:1 - Two from first, one from second</SelectItem>
                <SelectItem value="1-2">1:2 - One from first, two from second</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {canMix && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4" />
                Pages will be interleaved: Doc1-P1, Doc2-P1, Doc1-P2, Doc2-P2...
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleMix} disabled={!canMix}>
            <Shuffle className="w-4 h-4 mr-2" />
            Mix Pages
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
