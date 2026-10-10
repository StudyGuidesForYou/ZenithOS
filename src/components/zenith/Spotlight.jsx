import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FileText,
  Image as ImageIcon,
  LayoutGrid,
  Lock,
  Maximize2,
  Minimize2,
  Moon,
  Power,
  RotateCcw,
  Search,
  Settings as SettingsIcon,
  Sparkles,
  Sun,
  Wallpaper,
} from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import { allFiles, isImageName } from '@/lib/zenith/fs';
import { matchApps, matchFiles, targetForFile, fileKind } from '@/lib/zenith/search';
import { WALLPAPERS } from '@/lib/zenith/wallpapers';
import AppIcon from '@/components/zenith/AppIcon';

export default function Spotlight() {
  const os = useOS();
  const { panel, closePanels, openApp, fs, settings, updateSettings, focusedWindow, minimizeAll } = os;
  const open = panel === 'spotlight';
  const [q, setQ] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setQ('');
    setIndex(0);
    const t = setTimeout(() => inputRef.current?.focus(), 110);
    return () => clearTimeout(t);
  }, [open]);

  const files = useMemo(() => allFiles(fs.nodes), [fs.nodes]);

  const results = useMemo(() => {
    const query = q.trim();
    const commands = [
      { id: 'c-lock', label: 'Lock Screen', icon: Lock, run: os.lock },
      { id: 'c-theme', label: settings.theme === 'dark' ? 'Switch to Light Appearance' : 'Switch to Dark Appearance', icon: settings.theme === 'dark' ? Sun : Moon, run: () => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' }) },
      { id: 'c-widgets', label: settings.widgetsOnDesktop ? 'Hide Desktop Widgets' : 'Show Desktop Widgets', icon: Sparkles, run: () => updateSettings({ widgetsOnDesktop: !settings.widgetsOnDesktop }) },
      { id: 'c-mission', label: 'Mission Control', icon: LayoutGrid, run: () => os.togglePanel('mission') },
      { id: 'c-desktop', label: 'Show Desktop', icon: Minimize2, run: minimizeAll },
      ...(focusedWindow
        ? [{ id: 'c-full', label: 'Toggle Full Screen', icon: Maximize2, run: () => os.toggleMaximize(focusedWindow.id) }]
        : []),
      { id: 'c-settings', label: 'Zenith Settings', icon: SettingsIcon, run: () => openApp('settings') },
      { id: 'c-restart', label: 'Restart ZenithOS', icon: RotateCcw, run: os.restart },
      { id: 'c-shutdown', label: 'Shut Down', icon: Power, run: os.shutdown },
      ...WALLPAPERS.map((w) => ({
        id: `w-${w.id}`,
        label: `Set wallpaper: ${w.name}`,
        icon: Wallpaper,
        run: () => updateSettings({ wallpaper: w.id, customWallpaper: '' }),
      })),
    ].filter((c) => !query || c.label.toLowerCase().includes(query.toLowerCase()));

    const appHits = matchApps(query).map((app) => ({
      id: `app-${app.id}`,
      label: app.name,
      sub: 'Application',
      appId: app.id,
      run: () => openApp(app.id),
    }));

    const fileHits = matchFiles(files, query, query ? 4 : 3).map((file) => ({
      id: `file-${file.path}`,
      label: file.name,
      sub: `${file.parent} · ${fileKind(file.name)}`,
      icon: isImageName(file.name) ? ImageIcon : FileText,
      run: () => {
        const target = targetForFile(file);
        openApp(target.appId, target.payload);
      },
    }));

    return [...appHits, ...fileHits, ...commands].slice(0, 10);
  }, [q, settings.theme, settings.widgetsOnDesktop, files, focusedWindow, openApp, updateSettings, minimizeAll, os]);

  useEffect(() => {
    setIndex(0);
  }, [q]);

  const runAt = (i) => {
    const item = results[i];
    if (!item) return;
    closePanels();
    item.run();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      runAt(index);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[84] flex flex-col items-center"
          data-spotlight="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: settings.reduceMotion ? 0 : 0.16 }}
        >
          <div className="absolute inset-0" onClick={closePanels} />

          <motion.div
            className="relative mt-[16vh] w-[640px] max-w-[92vw]"
            initial={{ opacity: 0, y: -10, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: settings.reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 px-4">
              <Search className="h-5 w-5 shrink-0 text-[hsl(var(--z-text-dim))]" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Spotlight Search"
                className="h-12 w-full bg-transparent text-[17px] outline-none placeholder:text-[hsl(var(--z-text-dim))]"
              />
            </div>

            {results.length > 0 && (
              <div className="z-glass-strong z-scroll mt-2 max-h-[52vh] overflow-y-auto rounded-2xl p-1.5">
                {results.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onPointerEnter={() => setIndex(i)}
                    onClick={() => runAt(i)}
                    className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left ${
                      i === index ? 'bg-[hsl(var(--z-accent))] text-white' : 'text-[hsl(var(--z-text))]'
                    }`}
                  >
                    {item.appId ? (
                      <AppIcon appId={item.appId} className="h-7 w-7" iconClass="h-[46%] w-[46%]" />
                    ) : (
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--z-surface-soft))]">
                        {item.icon ? <item.icon className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13.5px]">{item.label}</span>
                      {item.sub && (
                        <span className={`block truncate text-[11px] ${i === index ? 'text-white/75' : 'text-[hsl(var(--z-text-dim))]'}`}>
                          {item.sub}
                        </span>
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {results.length === 0 && (
              <p className="z-glass-strong mt-2 rounded-2xl px-4 py-6 text-center text-[13px] text-[hsl(var(--z-text-dim))]">
                No results for “{q}”
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}