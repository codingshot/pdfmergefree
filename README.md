# PDF Merger

A free, privacy-focused PDF merger tool that runs entirely in your browser. Combine multiple PDFs, select individual pages, reorder them, and download your merged document.

## ✨ Features

### Core Functionality
- **Merge PDFs** - Combine multiple PDF files into a single document
- **Page Selection** - Choose which pages to include in the final PDF
- **Drag & Drop Reordering** - Easily rearrange pages with intuitive drag-and-drop
- **Page Thumbnails** - Visual preview of each page for easy identification
- **Multiple Download Formats** - Download as merged PDF, images (ZIP), or individual pages (ZIP)

### Views & Organization
- **Grid View** - Visual grid layout for easy page browsing
- **List View** - Compact list view optimized for reordering
- **Document Grouping** - Group pages by source document for bulk operations
- **Collapse/Expand Groups** - Manage large documents by collapsing groups

### Page Details
- **Page Detail Modal** - Double-click any page to view in larger size
- **Zoom Controls** - Zoom in/out on page details
- **Navigation** - Navigate between pages in the detail view
- **Selection Toggle** - Select/deselect pages from the detail view

### Mobile Responsive
- Fully responsive design for all screen sizes
- Touch-friendly controls
- Optimized layouts for mobile devices

### Privacy First
- **100% Browser-Based** - All processing happens locally
- **No Server Upload** - Your files never leave your device
- **No Data Collection** - We don't track or store any information

## 🛠️ Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **pdf-lib** - PDF manipulation
- **pdfjs-dist** - PDF rendering
- **@dnd-kit** - Drag and drop
- **JSZip** - ZIP file creation

## 🚀 Getting Started

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📋 To-Do / Future Ideas

### High Priority
- [ ] Rotate individual pages (90°, 180°, 270°)
- [ ] Split PDF feature (extract pages as separate files)
- [ ] PDF password/encryption support
- [ ] Page range selection (e.g., "1-5, 8, 10-12")

### Medium Priority
- [ ] Add text annotations to pages
- [ ] Compress PDF (reduce file size)
- [ ] OCR support for scanned PDFs
- [ ] PDF form filling
- [ ] Watermark support

### Low Priority / Nice to Have
- [ ] Cloud storage integration (Google Drive, Dropbox)
- [ ] PDF comparison tool
- [ ] Batch processing multiple merges
- [ ] Custom page sizes/margins
- [ ] PDF/A conversion for archiving
- [ ] Digital signature support

### UX Improvements
- [ ] Keyboard shortcuts (Ctrl+A for select all, Delete for remove, etc.)
- [ ] Undo/Redo functionality
- [ ] Progress indicator for large files
- [ ] Remember last used settings
- [ ] Dark mode support

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
