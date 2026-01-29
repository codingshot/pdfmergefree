export interface PDFFile {
  id: string;
  name: string;
  file: File;
  arrayBuffer: ArrayBuffer;
  pageCount: number;
}

export interface PageSelection {
  id: string;
  pdfId: string;
  pdfName: string;
  pageNumber: number;
  selected: boolean;
  thumbnail?: string;
}

export type ViewMode = 'grid' | 'list';

export type DownloadFormat = 'pdf' | 'images' | 'zip';

export interface DocumentGroup {
  pdfId: string;
  pdfName: string;
  pages: PageSelection[];
  allSelected: boolean;
  collapsed: boolean;
}
