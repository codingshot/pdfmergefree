import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsOptions {
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDelete: () => void;
  onNavigateUp: () => void;
  onNavigateDown: () => void;
  onNavigateLeft: () => void;
  onNavigateRight: () => void;
  onRotateRight: () => void;
  onRotateLeft: () => void;
  onEscape: () => void;
  enabled: boolean;
}

export function useKeyboardShortcuts({
  onSelectAll,
  onDeselectAll,
  onDelete,
  onNavigateUp,
  onNavigateDown,
  onNavigateLeft,
  onNavigateRight,
  onRotateRight,
  onRotateLeft,
  onEscape,
  enabled,
}: KeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      
      // Don't trigger shortcuts when typing in input fields
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Ctrl/Cmd + A: Select All
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        onSelectAll();
        return;
      }

      // Ctrl/Cmd + D: Deselect All
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        onDeselectAll();
        return;
      }

      // Delete or Backspace: Remove selected
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDelete();
        return;
      }

      // Arrow keys: Navigate
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onNavigateUp();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        onNavigateDown();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onNavigateLeft();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        onNavigateRight();
        return;
      }

      // R: Rotate right
      if (e.key === 'r' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        onRotateRight();
        return;
      }

      // Shift + R: Rotate left
      if (e.key === 'R' && e.shiftKey) {
        e.preventDefault();
        onRotateLeft();
        return;
      }

      // Escape: Close modal/deselect
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
        return;
      }
    },
    [
      enabled,
      onSelectAll,
      onDeselectAll,
      onDelete,
      onNavigateUp,
      onNavigateDown,
      onNavigateLeft,
      onNavigateRight,
      onRotateRight,
      onRotateLeft,
      onEscape,
    ]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
