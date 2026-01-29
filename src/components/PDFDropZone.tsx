import { useCallback, useState } from 'react';
import { Upload, FileText } from 'lucide-react';

interface PDFDropZoneProps {
  onFilesAdded: (files: FileList | File[]) => void;
  loading: boolean;
}

export function PDFDropZone({ onFilesAdded, loading }: PDFDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        onFilesAdded(files);
      }
    },
    [onFilesAdded]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFilesAdded(files);
      }
      e.target.value = '';
    },
    [onFilesAdded]
  );

  return (
    <div
      className={`drop-zone cursor-pointer text-center ${
        isDragging ? 'drop-zone-active' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById('pdf-input')?.click()}
    >
      <input
        id="pdf-input"
        type="file"
        accept=".pdf,application/pdf"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        disabled={loading}
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
          {loading ? (
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-primary" />
          )}
        </div>
        
        <div>
          <p className="text-lg font-semibold text-foreground">
            {loading ? 'Processing PDFs...' : 'Drop PDF files here'}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            or click to browse
          </p>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="w-4 h-4" />
          <span>Supports multiple PDF files</span>
        </div>
      </div>
    </div>
  );
}
