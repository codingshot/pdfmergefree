import { useState, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import type { PDFFile, PageSelection } from '@/types/pdf';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export function usePDFProcessor() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [pages, setPages] = useState<PageSelection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateThumbnail = async (
    arrayBuffer: ArrayBuffer,
    pageNum: number
  ): Promise<string> => {
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer.slice(0) });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(pageNum);
    
    const scale = 0.5;
    const viewport = page.getViewport({ scale });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
    }).promise;
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const addPDFs = useCallback(async (files: FileList | File[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const newFiles: PDFFile[] = [];
      const newPages: PageSelection[] = [];
      
      for (const file of Array.from(files)) {
        if (file.type !== 'application/pdf') {
          continue;
        }
        
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();
        
        const pdfFile: PDFFile = {
          id: crypto.randomUUID(),
          name: file.name,
          file,
          arrayBuffer,
          pageCount,
        };
        
        newFiles.push(pdfFile);
        
        for (let i = 1; i <= pageCount; i++) {
          const thumbnail = await generateThumbnail(arrayBuffer, i);
          newPages.push({
            id: `${pdfFile.id}-${i}`,
            pdfId: pdfFile.id,
            pdfName: file.name,
            pageNumber: i,
            selected: true,
            thumbnail,
          });
        }
      }
      
      setPdfFiles((prev) => [...prev, ...newFiles]);
      setPages((prev) => [...prev, ...newPages]);
    } catch (err) {
      setError('Failed to process PDF files. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const togglePageSelection = useCallback((pageId: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, selected: !page.selected } : page
      )
    );
  }, []);

  const reorderPages = useCallback((newOrder: PageSelection[]) => {
    setPages(newOrder);
  }, []);

  const removePDF = useCallback((pdfId: string) => {
    setPdfFiles((prev) => prev.filter((pdf) => pdf.id !== pdfId));
    setPages((prev) => prev.filter((page) => page.pdfId !== pdfId));
  }, []);

  const removeAllPDFs = useCallback(() => {
    setPdfFiles([]);
    setPages([]);
  }, []);

  const mergePDFs = useCallback(async (): Promise<Uint8Array | null> => {
    const selectedPages = pages.filter((p) => p.selected);
    
    if (selectedPages.length === 0) {
      setError('Please select at least one page to merge.');
      return null;
    }
    
    try {
      setLoading(true);
      const mergedPdf = await PDFDocument.create();
      
      for (const page of selectedPages) {
        const pdfFile = pdfFiles.find((f) => f.id === page.pdfId);
        if (!pdfFile) continue;
        
        const sourcePdf = await PDFDocument.load(pdfFile.arrayBuffer);
        const [copiedPage] = await mergedPdf.copyPages(sourcePdf, [page.pageNumber - 1]);
        mergedPdf.addPage(copiedPage);
      }
      
      return await mergedPdf.save();
    } catch (err) {
      setError('Failed to merge PDFs. Please try again.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [pages, pdfFiles]);

  const downloadMergedPDF = useCallback(async () => {
    const mergedBytes = await mergePDFs();
    if (!mergedBytes) return;
    
    const blob = new Blob([new Uint8Array(mergedBytes)], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'merged.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [mergePDFs]);

  return {
    pdfFiles,
    pages,
    loading,
    error,
    addPDFs,
    togglePageSelection,
    reorderPages,
    removePDF,
    removeAllPDFs,
    downloadMergedPDF,
    selectedCount: pages.filter((p) => p.selected).length,
  };
}
