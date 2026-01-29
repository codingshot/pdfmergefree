# pdfmerge.free

A free, open-source, privacy-focused PDF merger tool that runs entirely in your browser. Combine multiple PDFs, select individual pages, reorder them, and download your merged document.

🌐 **Live:** [pdfmerge.free](https://pdfmerge.free)  
📦 **GitHub:** [codingshot/pdfmergefree](https://github.com/codingshot/pdfmergefree/)  
🐦 **Twitter:** [@plugrel](https://x.com/plugrel)

---

## ✨ Features

### Core Functionality
- **Merge PDFs** - Combine multiple PDF files into a single document
- **Page Selection** - Choose which pages to include in the final PDF
- **Drag & Drop Reordering** - Easily rearrange pages with intuitive drag-and-drop
- **Page Thumbnails** - Visual preview of each page for easy identification
- **Page Range Selection** - Select pages using ranges like "1-5, 8, 10-12"

### Export Options
| Format | Description |
|--------|-------------|
| **Merged PDF** | All selected pages combined into a single PDF document |
| **Images (ZIP)** | Each page exported as a JPEG image in a ZIP archive |
| **Individual PDFs (ZIP)** | Each page as a separate PDF file in a ZIP archive |
| **Split PDFs** | Split selected pages into individual files or chunked groups |

### Page Manipulation
- **Page Rotation** - Rotate pages 90°, 180°, or 270° before merging
- **Compression** - Compress pages to reduce file size with quality preview
- **Annotations** - Add highlights, drawings, and signatures to pages
- **Page Details Modal** - View pages in full size with zoom controls
- **Page Size Customization** - Set custom page sizes (A4, Letter, Legal, A3, A5, Tabloid) and orientation

### File Conversion
- **Image to PDF** - Convert JPEG and PNG images to PDF before merging
- **Rich Text Editor** - Create new PDF documents directly using a built-in rich text editor
- **Multi-format Support** - Accept PDFs, PNGs, and JPEGs in a single workflow

### Advanced Features
- **PDF Mix Module** - Merge two PDFs by alternating pages (ideal for single-sided scans)
- **Reverse Order Support** - Handle back pages scanned in reverse order
- **Alternating Patterns** - Support for 1:1, 2:1, or 1:2 page alternation
- **Dark Mode** - Toggle between light and dark themes

### Views & Organization
- **Grid View** - Visual grid layout for easy page browsing
- **List View** - Compact list view optimized for reordering
- **Document Grouping** - Group pages by source document for bulk operations
- **Page Numbers** - Clear page position indicators (e.g., "3/10")

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+A` | Select all pages |
| `Ctrl+D` | Deselect all pages |
| `Delete` | Remove selected pages |
| `←` `→` `↑` `↓` | Navigate between pages |
| `R` | Rotate selected pages right (90°) |
| `Shift+R` | Rotate selected pages left (90°) |
| `Esc` | Close modal / Deselect |

### 📱 Mobile Responsive
- Fully responsive design for all screen sizes
- Touch-friendly controls and gestures
- Optimized layouts for mobile and tablet devices
- Adaptive toolbar that collapses on smaller screens

### 🔒 Privacy First
- **100% Browser-Based** - All processing happens locally in your browser
- **No Server Upload** - Your files never leave your device
- **No Data Collection** - We don't track or store any information
- **No Registration** - Use immediately without creating an account
- **No Watermarks** - Clean output with no branding added

---

## 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI components |
| **pdf-lib** | PDF manipulation |
| **pdfjs-dist** | PDF rendering |
| **@dnd-kit** | Drag and drop |
| **JSZip** | ZIP file creation |
| **next-themes** | Dark mode support |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/codingshot/pdfmergefree.git

# Navigate to project directory
cd pdfmergefree

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

---

## 📋 Roadmap

### Completed ✅
- [x] Merge multiple PDFs
- [x] Drag-and-drop page reordering
- [x] Page rotation (90°, 180°, 270°)
- [x] Keyboard shortcuts
- [x] Compression with size preview
- [x] Annotations (highlights, signatures)
- [x] Custom page size and orientation
- [x] Image to PDF conversion (JPEG, PNG)
- [x] PDF Mix module (alternating pages)
- [x] Rich text document creator
- [x] Page range selection
- [x] Split PDF feature
- [x] Dark mode toggle
- [x] Page number labels
- [x] Mobile responsive design

### In Progress 🚧
- [ ] Watermark support
- [ ] Undo/Redo for page operations
- [ ] Progress indicator for large files

### Planned 📝
- [ ] OCR support for scanned PDFs
- [ ] PDF form filling
- [ ] Batch processing multiple merges
- [ ] Cloud storage integration (Google Drive, Dropbox)
- [ ] PDF comparison tool
- [ ] PDF/A conversion for archiving

---

## 📄 License

MIT License

Copyright (c) 2024 pdfmerge.free

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how you can help:

### Ways to Contribute

1. **🐛 Report Bugs**
   - Open an issue describing the bug
   - Include steps to reproduce
   - Add screenshots if applicable

2. **💡 Suggest Features**
   - Open an issue with the `enhancement` label
   - Describe the feature and its use case
   - Explain why it would be valuable

3. **📝 Improve Documentation**
   - Fix typos or clarify existing docs
   - Add examples or tutorials
   - Translate documentation

4. **💻 Submit Code**
   - Fork the repository
   - Create a feature branch (`git checkout -b feature/amazing-feature`)
   - Make your changes
   - Run tests and linting
   - Commit with clear messages (`git commit -m 'Add amazing feature'`)
   - Push to your branch (`git push origin feature/amazing-feature`)
   - Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes across different browsers
- Ensure mobile responsiveness

### Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn and grow

---

## 🙏 Acknowledgments

- [pdf-lib](https://pdf-lib.js.org/) - PDF creation and modification
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF rendering
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Lucide](https://lucide.dev/) - Icon library

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/codingshot/pdfmergefree/issues)
- **Twitter:** [@plugrel](https://x.com/plugrel)

---

Made with ❤️ by the pdfmerge.free community