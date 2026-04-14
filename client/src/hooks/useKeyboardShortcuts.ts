import { useEffect } from 'react';

type ShortcutHandlers = {
  undo: () => void;
  redo: () => void;
  duplicate: () => void;
  deleteSelected: () => void;
  save: () => void;
};

export const useKeyboardShortcuts = (handlers: ShortcutHandlers) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const ctrl = event.ctrlKey || event.metaKey;
      if (ctrl && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        handlers.undo();
      }
      if (ctrl && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        handlers.redo();
      }
      if (ctrl && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        handlers.duplicate();
      }
      if (ctrl && event.shiftKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        handlers.save();
      }
      if (event.key === 'Delete') handlers.deleteSelected();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlers]);
};
