export interface PDFFile {
  id: string;
  name: string;
  file: File;
  arrayBuffer: ArrayBuffer;
  pageCount: number;
  isImage?: boolean; // For converted images
}

export interface PageSelection {
  id: string;
  pdfId: string;
  pdfName: string;
  pageNumber: number;
  selected: boolean;
  thumbnail?: string;
  rotation: number; // 0, 90, 180, 270
  compressionQuality: number; // 0.1 to 1.0
  annotations: Annotation[];
  originalSize?: number; // bytes
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

export interface Annotation {
  id: string;
  type: 'highlight' | 'signature' | 'text' | 'drawing';
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  content?: string; // for text or signature data URL
  points?: { x: number; y: number }[]; // for drawing
}

export interface CompressionSettings {
  enabled: boolean;
  quality: number; // 0.1 to 1.0
  targetSizeKB?: number;
}

export interface PageSizeSettings {
  preset: 'original' | 'a4' | 'letter' | 'legal' | 'a3' | 'a5' | 'tabloid' | 'custom';
  width: number; // in points (72 points = 1 inch)
  height: number;
  orientation: 'portrait' | 'landscape';
}

export interface PDFExportSettings {
  password?: string;
  pageSize: PageSizeSettings;
}
