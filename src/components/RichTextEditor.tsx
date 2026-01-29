import { useState, useRef, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  FileText,
  Plus,
  Type,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';

interface RichTextEditorProps {
  onCreateDocument: (name: string, htmlContent: string) => void;
  loading: boolean;
}

export function RichTextEditor({ onCreateDocument, loading }: RichTextEditorProps) {
  const [open, setOpen] = useState(false);
  const [docName, setDocName] = useState('New Document');
  const [fontSize, setFontSize] = useState('16');
  const editorRef = useRef<HTMLDivElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleCreate = () => {
    const content = editorRef.current?.innerHTML || '<p>Empty document</p>';
    onCreateDocument(docName || 'New Document', content);
    setOpen(false);
    // Reset editor
    if (editorRef.current) {
      editorRef.current.innerHTML = '<p>Start typing your document here...</p>';
    }
    setDocName('New Document');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={loading}>
          <FileText className="w-4 h-4 sm:mr-2" />
          <span className="hidden sm:inline">Create Doc</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Create New Document
          </DialogTitle>
          <DialogDescription>
            Create a document using the rich text editor. It will be converted to PDF and added to your pages.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="space-y-2">
            <Label htmlFor="doc-name">Document Name</Label>
            <Input
              id="doc-name"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Enter document name..."
            />
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/50 rounded-lg border">
            {/* Headings */}
            <Toggle
              size="sm"
              onPressedChange={() => execCommand('formatBlock', 'h1')}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() => execCommand('formatBlock', 'h2')}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() => execCommand('formatBlock', 'h3')}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() => execCommand('formatBlock', 'p')}
              title="Paragraph"
            >
              <Type className="w-4 h-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Font size */}
            <Select value={fontSize} onValueChange={(v) => {
              setFontSize(v);
              execCommand('fontSize', v === '12' ? '2' : v === '14' ? '3' : v === '16' ? '4' : v === '18' ? '5' : v === '24' ? '6' : '7');
            }}>
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="12">12px</SelectItem>
                <SelectItem value="14">14px</SelectItem>
                <SelectItem value="16">16px</SelectItem>
                <SelectItem value="18">18px</SelectItem>
                <SelectItem value="24">24px</SelectItem>
                <SelectItem value="32">32px</SelectItem>
              </SelectContent>
            </Select>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Text formatting */}
            <Toggle
              size="sm"
              onPressedChange={() => execCommand('bold')}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() => execCommand('italic')}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() => execCommand('underline')}
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-4 h-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Alignment */}
            <Toggle
              size="sm"
              onPressedChange={() => execCommand('justifyLeft')}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() => execCommand('justifyCenter')}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() => execCommand('justifyRight')}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </Toggle>

            <Separator orientation="vertical" className="h-6 mx-1" />

            {/* Lists */}
            <Toggle
              size="sm"
              onPressedChange={() => execCommand('insertUnorderedList')}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </Toggle>
            <Toggle
              size="sm"
              onPressedChange={() => execCommand('insertOrderedList')}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </Toggle>
          </div>

          {/* Editor area */}
          <div
            ref={editorRef}
            contentEditable
            className="flex-1 min-h-[300px] max-h-[400px] overflow-auto p-4 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring prose prose-sm max-w-none"
            style={{ fontFamily: 'inherit' }}
            suppressContentEditableWarning
          >
            <p>Start typing your document here...</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Create PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
