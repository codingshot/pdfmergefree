import { useState, useCallback, useMemo } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import type { PDFFile, PageSelection, DocumentGroup, DownloadFormat, Annotation } from '@/types/pdf';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export function usePDFProcessor() {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [pages, setPages] = useState<PageSelection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [focusedPageIndex, setFocusedPageIndex] = useState<number>(-1);

  const generateThumbnail = async (
    arrayBuffer: ArrayBuffer,
    pageNum: number
  ): Promise<{ thumbnail: string; size: number }> => {
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
    
    const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
    // Estimate size based on canvas dimensions
    const size = Math.round((canvas.width * canvas.height * 3) / 10); // rough estimate
    
    return { thumbnail, size };
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
          const { thumbnail, size } = await generateThumbnail(arrayBuffer, i);
          newPages.push({
            id: `${pdfFile.id}-${i}`,
            pdfId: pdfFile.id,
            pdfName: file.name,
            pageNumber: i,
            selected: true,
            thumbnail,
            rotation: 0,
            compressionQuality: 1.0,
            annotations: [],
            originalSize: size,
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

  const selectAll = useCallback(() => {
    setPages((prev) => prev.map((page) => ({ ...page, selected: true })));
  }, []);

  const deselectAll = useCallback(() => {
    setPages((prev) => prev.map((page) => ({ ...page, selected: false })));
  }, []);

  const removeSelectedPages = useCallback(() => {
    setPages((prev) => prev.filter((page) => !page.selected));
  }, []);

  const rotatePage = useCallback((pageId: string, newRotation: number) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, rotation: newRotation } : page
      )
    );
  }, []);

  const rotateSelectedPages = useCallback((direction: 'left' | 'right') => {
    const delta = direction === 'right' ? 90 : -90;
    setPages((prev) =>
      prev.map((page) =>
        page.selected
          ? { ...page, rotation: (page.rotation + delta + 360) % 360 }
          : page
      )
    );
  }, []);

  const updatePageAnnotations = useCallback((pageId: string, annotations: Annotation[]) => {
    setPages((prev) =>
      prev.map((page) =>
        page.id === pageId ? { ...page, annotations } : page
      )
    );
  }, []);

  const compressPages = useCallback((quality: number, _targetSizeKB?: number, applyToAll?: boolean) => {
    setPages((prev) =>
      prev.map((page) =>
        applyToAll || page.selected
          ? { ...page, compressionQuality: quality }
          : page
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
    setCollapsedGroups(new Set());
    setFocusedPageIndex(-1);
  }, []);

  // Group pages by document
  const documentGroups = useMemo((): DocumentGroup[] => {
    const groupMap = new Map<string, PageSelection[]>();
    
    pages.forEach((page) => {
      const existing = groupMap.get(page.pdfId) || [];
      groupMap.set(page.pdfId, [...existing, page]);
    });

    return Array.from(groupMap.entries()).map(([pdfId, groupPages]) => ({
      pdfId,
      pdfName: groupPages[0].pdfName,
      pages: groupPages,
      allSelected: groupPages.every((p) => p.selected),
      collapsed: collapsedGroups.has(pdfId),
    }));
  }, [pages, collapsedGroups]);

  const toggleGroupCollapse = useCallback((pdfId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(pdfId)) {
        next.delete(pdfId);
      } else {
        next.add(pdfId);
      }
      return next;
    });
  }, []);

  const selectAllInGroup = useCallback((pdfId: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.pdfId === pdfId ? { ...page, selected: true } : page
      )
    );
  }, []);

  const deselectAllInGroup = useCallback((pdfId: string) => {
    setPages((prev) =>
      prev.map((page) =>
        page.pdfId === pdfId ? { ...page, selected: false } : page
      )
    );
  }, []);

  // Navigation
  const navigateFocus = useCallback((direction: 'up' | 'down' | 'left' | 'right', columns: number = 6) => {
    if (pages.length === 0) return;

    setFocusedPageIndex((prev) => {
      if (prev === -1) return 0;

      let next = prev;
      switch (direction) {
        case 'left':
          next = Math.max(0, prev - 1);
          break;
        case 'right':
          next = Math.min(pages.length - 1, prev + 1);
          break;
        case 'up':
          next = Math.max(0, prev - columns);
          break;
        case 'down':
          next = Math.min(pages.length - 1, prev + columns);
          break;
      }
      return next;
    });
  }, [pages.length]);

  const toggleFocusedSelection = useCallback(() => {
    if (focusedPageIndex >= 0 && focusedPageIndex < pages.length) {
      togglePageSelection(pages[focusedPageIndex].id);
    }
  }, [focusedPageIndex, pages, togglePageSelection]);

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
        
        // Apply rotation
        if (page.rotation !== 0) {
          copiedPage.setRotation(degrees(page.rotation));
        }
        
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

  const downloadAsImages = useCallback(async () => {
    const selectedPages = pages.filter((p) => p.selected);
    
    if (selectedPages.length === 0) {
      setError('Please select at least one page to download.');
      return;
    }

    setLoading(true);
    try {
      const zip = new JSZip();
      
      for (let i = 0; i < selectedPages.length; i++) {
        const page = selectedPages[i];
        if (page.thumbnail) {
          const base64Data = page.thumbnail.split(',')[1];
          zip.file(`page-${i + 1}.jpg`, base64Data, { base64: true });
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pages-images.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download images. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pages]);

  const downloadAsZip = useCallback(async () => {
    const selectedPages = pages.filter((p) => p.selected);
    
    if (selectedPages.length === 0) {
      setError('Please select at least one page to download.');
      return;
    }

    setLoading(true);
    try {
      const zip = new JSZip();
      
      // Create individual PDFs for each page
      for (let i = 0; i < selectedPages.length; i++) {
        const page = selectedPages[i];
        const pdfFile = pdfFiles.find((f) => f.id === page.pdfId);
        if (!pdfFile) continue;

        const singlePagePdf = await PDFDocument.create();
        const sourcePdf = await PDFDocument.load(pdfFile.arrayBuffer);
        const [copiedPage] = await singlePagePdf.copyPages(sourcePdf, [page.pageNumber - 1]);
        
        // Apply rotation
        if (page.rotation !== 0) {
          copiedPage.setRotation(degrees(page.rotation));
        }
        
        singlePagePdf.addPage(copiedPage);
        
        const pdfBytes = await singlePagePdf.save();
        zip.file(`page-${i + 1}.pdf`, pdfBytes);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'pages.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download ZIP. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pages, pdfFiles]);

  const download = useCallback(async (format: DownloadFormat) => {
    switch (format) {
      case 'pdf':
        return downloadMergedPDF();
      case 'images':
        return downloadAsImages();
      case 'zip':
        return downloadAsZip();
    }
  }, [downloadMergedPDF, downloadAsImages, downloadAsZip]);

  // Calculate total estimated size
  const estimatedSize = useMemo(() => {
    const selectedPages = pages.filter((p) => p.selected);
    return selectedPages.reduce((acc, p) => {
      const originalSize = p.originalSize || 50000;
      return acc + originalSize * p.compressionQuality;
    }, 0);
  }, [pages]);

  return {
    pdfFiles,
    pages,
    loading,
    error,
    addPDFs,
    togglePageSelection,
    selectAll,
    deselectAll,
    removeSelectedPages,
    rotatePage,
    rotateSelectedPages,
    updatePageAnnotations,
    compressPages,
    reorderPages,
    removePDF,
    removeAllPDFs,
    downloadMergedPDF,
    download,
    selectedCount: pages.filter((p) => p.selected).length,
    documentGroups,
    toggleGroupCollapse,
    selectAllInGroup,
    deselectAllInGroup,
    focusedPageIndex,
    setFocusedPageIndex,
    navigateFocus,
    toggleFocusedSelection,
    estimatedSize,
  };
}
