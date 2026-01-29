import { Download, FileImage, FileArchive, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { DownloadFormat } from '@/types/pdf';

interface DownloadMenuProps {
  disabled: boolean;
  loading: boolean;
  selectedCount: number;
  onDownload: (format: DownloadFormat) => void;
}

export function DownloadMenu({ disabled, loading, selectedCount, onDownload }: DownloadMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button disabled={disabled || loading} className="shadow-lg shadow-primary/25">
          <Download className="w-4 h-4 mr-2" />
          Download ({selectedCount})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => onDownload('pdf')} className="cursor-pointer">
          <FileText className="w-4 h-4 mr-2" />
          Download as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload('images')} className="cursor-pointer">
          <FileImage className="w-4 h-4 mr-2" />
          Download as Images
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDownload('zip')} className="cursor-pointer">
          <FileArchive className="w-4 h-4 mr-2" />
          Download as ZIP
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
