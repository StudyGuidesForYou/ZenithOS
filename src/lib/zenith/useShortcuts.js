import { useEffect } from 'react';
import { useOS } from './osContext';

/* Desktop-wide shortcuts. Only browser-safe combos are bound (nothing the
   browser reserves, so a keystroke can never close the tab). */
export default function useShortcuts() {
  const { panel, togglePanel, closePanels, openApp, lock, cycleSwitcher, commitSwitcher, setWorkspace, workspaceCount, moveToWorkspace, focusedWindow } = useOS();

  useEffect(() => {
    const onKeyDown = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      const target = e.target;
      const tag = (target?.tagName || '').toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || target?.isContentEditable;

      if (e.key === 'Escape') {
        closePanels();
        return;
      }
      if (mod && (e.code === 'Space' || e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        togglePanel('spotlight');
        return;
      }
      if (mod && (e.code === 'Backquote' || (e.key === 'Tab' && !e.shiftKey))) {
        e.preventDefault();
        cycleSwitcher();
        return;
      }
      if ((e.key === 'F3' && !mod) || (mod && e.key === 'ArrowUp')) {
        e.preventDefault();
        togglePanel('mission');
        return;
      }
      if (mod && e.key === ',') {
        e.preventDefault();
        openApp('settings');
        return;
      }
      if (mod && /^[1-9]$/.test(e.key)) {
        const idx = Number(e.key) - 1;
        if (idx < (workspaceCount || 4)) {
          e.preventDefault();
          if (e.shiftKey && focusedWindow) moveToWorkspace(focusedWindow.id, idx);
          else setWorkspace(idx);
        }
        return;
      }
      if (mod && e.key === 'ArrowRight') {
        e.preventDefault();
        setWorkspace((w) => Math.min((workspaceCount || 4) - 1, w + 1));
        return;
      }
      if (mod && e.key === 'ArrowLeft') {
        e.preventDefault();
        setWorkspace((w) => Math.max(0, w - 1));
        return;
      }
      if (typing) return;
      if (mod && e.shiftKey && (e.code === 'KeyQ' || e.code === 'KeyL')) {
        e.preventDefault();
        lock();
      }
    };

    const onKeyUp = (e) => {
      if (panel === 'switcher' && !e.metaKey && !e.ctrlKey) commitSwitcher();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [panel, togglePanel, closePanels, openApp, lock, cycleSwitcher, commitSwitcher, setWorkspace, workspaceCount, moveToWorkspace, focusedWindow]);
}