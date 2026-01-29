# Contributing to pdfmerge.free

Thank you for your interest in contributing to pdfmerge.free! This document provides guidelines and instructions for contributing.

## 🌟 Ways to Contribute

### 1. Report Bugs

Found a bug? Please open an issue with:

- **Clear title** describing the issue
- **Steps to reproduce** the bug
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Browser and OS** information

### 2. Suggest Features

Have an idea? Open an issue with the `enhancement` label:

- **Describe the feature** in detail
- **Explain the use case** and who would benefit
- **Provide mockups** if possible

### 3. Improve Documentation

- Fix typos or clarify existing documentation
- Add code examples or tutorials
- Translate documentation to other languages

### 4. Submit Code

We welcome pull requests! Here's how:

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/pdfmergefree.git
cd pdfmergefree

# 3. Create a feature branch
git checkout -b feature/your-feature-name

# 4. Install dependencies
npm install

# 5. Make your changes
# ... edit files ...

# 6. Test your changes
npm run dev
# Open http://localhost:5173 and test

# 7. Commit with a clear message
git commit -m "Add: description of your feature"

# 8. Push to your fork
git push origin feature/your-feature-name

# 9. Open a Pull Request on GitHub
```

## 📋 Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow existing code patterns
- Use meaningful variable and function names
- Add JSDoc comments for public functions

### Component Structure

```tsx
// Use functional components with hooks
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // State hooks at the top
  const [state, setState] = useState();
  
  // Callbacks and effects next
  const handleClick = useCallback(() => {
    // ...
  }, []);
  
  // Render at the bottom
  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

### Styling

- Use Tailwind CSS classes
- Use semantic design tokens from `index.css`
- Ensure mobile responsiveness
- Test in both light and dark modes

### Commit Messages

Use clear, descriptive commit messages:

```
Add: new feature description
Fix: bug description
Update: what was changed
Remove: what was removed
Refactor: what was refactored
Docs: documentation changes
```

## 🧪 Testing

Before submitting a PR:

1. **Test in multiple browsers** (Chrome, Firefox, Safari)
2. **Test on mobile devices** or responsive mode
3. **Test both light and dark modes**
4. **Test with various PDF files** (large, multi-page, etc.)

## 📁 Project Structure

```
pdfmergefree/
├── src/
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── ...          # Feature components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── types/           # TypeScript types
│   ├── lib/             # Utility functions
│   └── main.tsx         # App entry point
├── public/              # Static assets
├── index.html           # HTML template
└── ...                  # Config files
```

## 🔍 Code Review Process

1. All PRs require at least one review
2. Address all review comments
3. Keep PRs focused and reasonably sized
4. Update documentation if needed

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers warmly
- Focus on constructive feedback
- Help others learn and grow
- Accept responsibility for mistakes

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information

## ❓ Questions?

- Open a [GitHub Issue](https://github.com/codingshot/pdfmergefree/issues)
- Tweet at [@plugrel](https://x.com/plugrel)

---

Thank you for contributing to pdfmerge.free! 🎉