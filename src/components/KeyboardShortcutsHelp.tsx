import { Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const shortcuts = [
  { keys: ['Ctrl', 'A'], action: 'Select all pages' },
  { keys: ['Ctrl', 'D'], action: 'Deselect all pages' },
  { keys: ['Delete'], action: 'Remove selected pages' },
  { keys: ['←', '→'], action: 'Navigate pages horizontally' },
  { keys: ['↑', '↓'], action: 'Navigate pages vertically' },
  { keys: ['R'], action: 'Rotate page right (90°)' },
  { keys: ['Shift', 'R'], action: 'Rotate page left (90°)' },
  { keys: ['Esc'], action: 'Close modal / Deselect' },
  { keys: ['Space'], action: 'Toggle page selection' },
];

export function KeyboardShortcutsHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Keyboard shortcuts">
          <Keyboard className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{shortcut.action}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, i) => (
                  <span key={i}>
                    <kbd className="px-2 py-1 text-xs font-semibold bg-muted rounded border border-border">
                      {key}
                    </kbd>
                    {i < shortcut.keys.length - 1 && (
                      <span className="mx-1 text-muted-foreground">+</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
