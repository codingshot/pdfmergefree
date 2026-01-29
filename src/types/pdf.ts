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
