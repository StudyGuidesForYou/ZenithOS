import {
  Folder,
  FileText,
  Calculator as CalculatorIcon,
  Terminal as TerminalIcon,
  Image as ImageIcon,
  Paintbrush,
  Settings as SettingsIcon,
  MessagesSquare,
} from 'lucide-react';

export const APPS = {
  files: {
    id: 'files',
    name: 'Files',
    icon: Folder,
    tile: 'from-sky-400 via-cyan-400 to-blue-600',
    size: { w: 980, h: 640 },
  },
  notepad: {
    id: 'notepad',
    name: 'Notes',
    icon: FileText,
    tile: 'from-amber-300 via-orange-400 to-rose-500',
    size: { w: 840, h: 600 },
  },
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    icon: TerminalIcon,
    tile: 'from-slate-500 via-slate-700 to-slate-900',
    size: { w: 800, h: 500 },
  },
  photos: {
    id: 'photos',
    name: 'Photos',
    icon: ImageIcon,
    tile: 'from-fuchsia-400 via-pink-500 to-rose-500',
    size: { w: 900, h: 620 },
  },
  canvas: {
    id: 'canvas',
    name: 'Canvas',
    icon: Paintbrush,
    tile: 'from-emerald-300 via-teal-400 to-cyan-600',
    size: { w: 940, h: 660 },
  },
  calculator: {
    id: 'calculator',
    name: 'Calculator',
    icon: CalculatorIcon,
    tile: 'from-violet-400 via-purple-500 to-indigo-600',
    size: { w: 400, h: 580 },
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    icon: SettingsIcon,
    tile: 'from-zinc-300 via-zinc-400 to-zinc-600',
    size: { w: 940, h: 660 },
    single: true,
  },
  chat: {
    id: 'chat',
    name: 'Chat',
    icon: MessagesSquare,
    tile: 'from-indigo-400 via-violet-500 to-fuchsia-500',
    size: { w: 1040, h: 680 },
  },
};

export const DESKTOP_ICONS = ['files', 'notepad', 'terminal', 'photos', 'canvas', 'calculator', 'settings', 'chat'];

export const PINNED = ['files', 'notepad', 'terminal', 'photos', 'canvas', 'calculator', 'settings', 'chat'];