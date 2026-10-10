const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import {
  EyeOff,
  Info,
  Keyboard,
  LayoutGrid,
  Lock,
  LogOut,
  Power,
  RotateCcw,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';

import { WALLPAPERS } from '@/lib/zenith/wallpapers';
import { targetForFile } from '@/lib/zenith/search';
import ZenithMark from '@/components/zenith/ZenithMark';
import StatusItems from './StatusItems';
import MenuBarMenu from './MenuBarMenu';

export default function MenuBar() {
  const {
    settings,
    updateSettings,
    openApp,
    fs,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    minimizeAll,
    focusedWindow,
    lock,
    restart,
    shutdown,
    togglePanel,
  } = useOS();
  const [openIndex, setOpenIndex] = useState(null);
  const recent = fs.recent();

  const focusedTitle = focusedWindow ? focusedWindow.title : 'Zenith';
  const canWindow = Boolean(focusedWindow);

  const nextWallpaper = () => {
    const i = WALLPAPERS.findIndex((w) => w.id === settings.wallpaper);
    const next = WALLPAPERS[(i + 1 + WALLPAPERS.length) % WALLPAPERS.length];
    updateSettings({ wallpaper: next.id, customWallpaper: '' });
  };

  const menus = [
    {
      title: 'Zenith',
      brand: true,
      items: [
        { label: 'About This Zenith', icon: Info, run: () => openApp('settings', { pane: 'about' }) },
        {
          label: 'System Settings…',
          icon: SlidersHorizontal,
          hint: '⌃,',
          run: () => openApp('settings'),
        },
        { type: 'separator' },
        { type: 'label', label: 'Recent Items' },
        ...(recent.length
          ? recent.slice(0, 4).map((file) => ({
              key: file.path,
              label: file.name,
              hint: file.parent === '/' ? undefined : file.parent,
              run: () => {
                const target = targetForFile(file);
                openApp(target.appId, target.payload);
              },
            }))
          : [{ label: 'No recent items', disabled: true, run: () => {} }]),
        { type: 'separator' },
        { label: 'Launchpad', icon: LayoutGrid, run: () => togglePanel('launchpad') },
        { label: 'Mission Control', icon: LayoutGrid, hint: 'F3', run: () => togglePanel('mission') },
        { label: 'Show Desktop', icon: LayoutGrid, run: minimizeAll },
        { type: 'separator' },
        {
          label: 'Do Not Disturb',
          checked: settings.dnd,
          run: () => updateSettings({ dnd: !settings.dnd }),
        },
        { label: 'Shortcuts', icon: Keyboard, run: () => openApp('settings', { pane: 'keyboard' }) },
        { label: 'Lock Screen', icon: Lock, run: lock },
        { label: 'Log Out…', icon: LogOut, run: () => db.auth.logout() },
        { label: 'Restart…', icon: RotateCcw, run: restart },
        { label: 'Shut Down…', icon: Power, run: shutdown },
      ],
    },
  ];

  if (focusedWindow) {
    menus.push({
      title: focusedTitle,
      items: [
        { label: `Hide ${focusedTitle}`, icon: EyeOff, run: () => minimizeWindow(focusedWindow.id) },
        { type: 'separator' },
        { label: `Quit ${focusedTitle}`, icon: X, run: () => closeWindow(focusedWindow.id) },
      ],
    });
  }

  menus.push(
    {
      title: 'File',
      items: [
        { label: 'New Window', disabled: !focusedWindow, run: () => openApp(focusedWindow.appId) },
        { label: 'Open Files…', run: () => openApp('files') },
        { type: 'separator' },
        { label: 'Close Window', disabled: !canWindow, run: () => closeWindow(focusedWindow.id) },
      ],
    },
    {
      title: 'View',
      items: [
        {
          label: 'Desktop Widgets',
          checked: settings.widgetsOnDesktop,
          run: () => updateSettings({ widgetsOnDesktop: !settings.widgetsOnDesktop }),
        },
        {
          label: 'Enter Full Screen',
          checked: Boolean(focusedWindow?.maximized),
          disabled: !canWindow,
          run: () => toggleMaximize(focusedWindow.id),
        },
        { type: 'separator' },
        { label: 'Next Wallpaper', run: nextWallpaper },
        {
          label: settings.theme === 'dark' ? 'Light Appearance' : 'Dark Appearance',
          checked: settings.theme === 'light',
          run: () => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' }),
        },
      ],
    },
    {
      title: 'Window',
      items: [
        { label: 'Minimize', disabled: !canWindow, run: () => minimizeWindow(focusedWindow.id) },
        { label: 'Zoom', disabled: !canWindow, run: () => toggleMaximize(focusedWindow.id) },
        { type: 'separator' },
        { label: 'Mission Control', hint: 'F3', run: () => togglePanel('mission') },
        { label: 'Show Desktop', run: minimizeAll },
      ],
    },
    {
      title: 'Help',
      items: [
        { label: 'ZenithOS Shortcuts', icon: Keyboard, run: () => openApp('settings', { pane: 'keyboard' }) },
        { label: 'About ZenithOS', icon: Info, run: () => openApp('settings', { pane: 'about' }) },
      ],
    }
  );

  return (
    <header
      className="z-menubar absolute inset-x-0 top-0 z-[70] flex items-stretch gap-0.5 pl-2 pr-1.5 text-[12.5px] text-[hsl(var(--z-text))]"
      style={{ height: 'var(--z-menubar)' }}
    >
      {openIndex !== null && <div className="fixed inset-0 z-[79]" onPointerDown={() => setOpenIndex(null)} />}

      {menus.map((menu, i) => (
        <div key={menu.title} className="relative flex items-stretch">
          <button
            type="button"
            className={`z-menubar-item my-1 flex items-center gap-1.5 px-2 ${menu.brand ? 'font-medium' : ''}`}
            data-open={openIndex === i ? 'true' : 'false'}
            onPointerDown={(e) => {
              e.preventDefault();
              setOpenIndex((cur) => (cur === i ? null : i));
            }}
            onMouseEnter={() => setOpenIndex((cur) => (cur === null ? null : i))}
          >
            {menu.brand && <ZenithMark className="h-3.5 w-3.5" />}
            <span className="whitespace-nowrap">{menu.brand ? 'Zenith' : menu.title}</span>
          </button>
          {i !== 0 && (
            <div className="absolute left-0 top-full">
              <MenuBarMenu open={openIndex === i} items={menu.items} />
            </div>
          )}
        </div>
      ))}

      <div className="ml-auto flex items-stretch gap-1">
        <WorkspacePager />
        <StatusItems />
      </div>

      {openIndex === 0 && (
        <div className="absolute left-0 top-full pl-2">
          <MenuBarMenu open items={menus[0].items} />
        </div>
      )}
    </header>
  );
}

/* Linux-style workspace pager in the menu bar — click to switch, ⌃1-4 / ⌃←→
   are bound globally. */
function WorkspacePager() {
  const { workspace, workspaceCount, setWorkspace } = useOS();
  return (
    <div className="flex items-center gap-0.5 px-1">
      {Array.from({ length: workspaceCount }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => setWorkspace(i)}
          title={`Workspace ${i + 1}`}
          className={`z-menubar-item flex h-5 w-5 items-center justify-center rounded-md text-[11px] tabular-nums ${
            workspace === i ? 'bg-[hsl(var(--z-accent)/0.85)] text-white' : 'text-white/55'
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}