import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FilePlus,
  FolderPlus,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  RefreshCw,
  Sparkles,
  Terminal as TerminalIcon,
} from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import { DESKTOP_ICONS } from '@/lib/zenith/apps';
import DesktopIcon from './DesktopIcon';
import DesktopWidgets from '@/components/zenith/widgets/DesktopWidgets';

const COL_W = 104;
const ROW_H = 100;
const PAD_X = 16;
const PAD_Y = 16;

export default function Desktop() {
  const { openApp, fs, closeOverlays, notify, settings, updateSettings, panel, togglePanel, viewport } = useOS();
  const [menu, setMenu] = useState(null);
  const [selected, setSelected] = useState(null);
  const touch = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches,
    []
  );

  const cols = Math.max(1, Math.floor((Math.max(320, viewport.w) - PAD_X) / COL_W));

  const open = (appId, payload = null) => {
    setMenu(null);
    openApp(appId, payload);
  };

  const menuItems = [
    {
      label: 'New note',
      icon: FilePlus,
      run: () => {
        const path = fs.createFile('/Documents', 'Untitled note.txt', '');
        open('notepad', { path });
      },
    },
    {
      label: 'New folder',
      icon: FolderPlus,
      run: () => {
        fs.mkdir('/Documents', 'New folder');
        notify({ title: 'Folder created', body: 'New folder was added to Documents' });
        setMenu(null);
      },
    },
    { label: 'Open Terminal here', icon: TerminalIcon, run: () => open('terminal', { cwd: '/Documents' }) },
    { separator: true },
    { label: 'Mission Control', icon: LayoutGrid, run: () => { setMenu(null); togglePanel('mission'); } },
    { label: 'Launchpad', icon: LayoutGrid, run: () => { setMenu(null); togglePanel('launchpad'); } },
    {
      label: settings.widgetsOnDesktop ? 'Hide widgets' : 'Show widgets',
      icon: Sparkles,
      run: () => {
        updateSettings({ widgetsOnDesktop: !settings.widgetsOnDesktop });
        setMenu(null);
      },
    },
    { separator: true },
    { label: 'Change wallpaper', icon: ImageIcon, run: () => open('settings', { pane: 'appearance' }) },
    {
      label: 'Refresh',
      icon: RefreshCw,
      run: () => {
        setMenu(null);
        notify({ title: 'Desktop refreshed', body: 'Everything is up to date' });
      },
    },
    { label: 'About ZenithOS', icon: Info, run: () => open('settings', { pane: 'about' }) },
  ];

  const onContextMenu = (e) => {
    e.preventDefault();
    closeOverlays();
    setSelected(null);
    setMenu({
      x: Math.min(e.clientX, Math.max(8, window.innerWidth - 236)),
      y: Math.min(e.clientY, Math.max(8, window.innerHeight - 380)),
    });
  };

  return (
    <div
      className="absolute inset-0"
      onContextMenu={onContextMenu}
      onPointerDown={(e) => {
        if (e.target === e.currentTarget || e.target.dataset?.desktop === 'true') {
          setMenu(null);
          setSelected(null);
          closeOverlays();
        }
      }}
    >
      {DESKTOP_ICONS.map((appId, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const defaultPos = { x: PAD_X + col * COL_W, y: PAD_Y + row * ROW_H };
        return (
          <DesktopIcon
            key={appId}
            appId={appId}
            defaultPos={defaultPos}
            selected={selected === appId}
            onSelect={setSelected}
            onOpen={open}
            touch={touch}
          />
        );
      })}

      {settings.widgetsOnDesktop && panel !== 'notifications' && (
        <DesktopWidgets />
      )}

      <AnimatePresence>
        {menu && (
          <>
            <div
              className="fixed inset-0 z-[41]"
              onClick={() => setMenu(null)}
              onContextMenu={(e) => {
                e.preventDefault();
                setMenu(null);
              }}
            />
            <motion.div
              className="z-glass-strong fixed z-[42] w-[228px] overflow-hidden rounded-2xl p-1.5"
              style={{ left: menu.x, top: menu.y }}
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -4 }}
              transition={{ duration: 0.14, ease: 'easeOut' }}
            >
              {menuItems.map((item, i) =>
                item.separator ? (
                  <div key={`sep-${i}`} className="my-1 h-px bg-[hsl(var(--z-border))]" />
                ) : (
                  <button key={item.label} type="button" onClick={item.run} className="z-menu-item">
                    <item.icon className="h-3.5 w-3.5 shrink-0 opacity-85" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </button>
                )
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}