import React, { useEffect, useState } from 'react';
import {
  Eye,
  Info,
  Keyboard,
  LayoutGrid,
  MonitorSmartphone,
  Search,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import AppearancePane from './settings/AppearancePane';
import DesktopPane from './settings/DesktopPane';
import DisplayPane from './settings/DisplayPane';
import AccessibilityPane from './settings/AccessibilityPane';
import WidgetsPane from './settings/WidgetsPane';
import KeyboardPane from './settings/KeyboardPane';
import SystemPane from './settings/SystemPane';

const SECTIONS = [
  { id: 'appearance', label: 'Appearance', icon: Eye, Pane: AppearancePane },
  { id: 'desktop', label: 'Desktop & Dock', icon: LayoutGrid, Pane: DesktopPane },
  { id: 'display', label: 'Display & Sound', icon: MonitorSmartphone, Pane: DisplayPane },
  { id: 'widgets', label: 'Widgets', icon: Sparkles, Pane: WidgetsPane },
  { id: 'accessibility', label: 'Accessibility', icon: SlidersHorizontal, Pane: AccessibilityPane },
  { id: 'keyboard', label: 'Shortcuts', icon: Keyboard, Pane: KeyboardPane },
  { id: 'about', label: 'System & About', icon: Info, Pane: SystemPane },
];

export default function Settings({ payload }) {
  const [tab, setTab] = useState(payload?.pane || 'appearance');
  const [q, setQ] = useState('');

  useEffect(() => {
    if (payload?.pane) setTab(payload.pane);
  }, [payload?.pane]);

  const visible = SECTIONS.filter((s) => s.label.toLowerCase().includes(q.trim().toLowerCase()));
  const section = SECTIONS.find((s) => s.id === tab) || SECTIONS[0];
  const Pane = section.Pane;

  return (
    <div className="flex h-full">
      <aside className="flex w-[146px] shrink-0 flex-col border-r border-[hsl(var(--z-border))] p-2 sm:w-[212px] sm:p-3">
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[hsl(var(--z-text-dim))]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="z-input h-8 w-full pl-7 pr-2 text-[12px]"
          />
        </div>

        <nav className="z-scroll -mx-1 space-y-0.5 overflow-y-auto px-1">
          {visible.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setTab(s.id)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-[12.5px] transition-colors ${
                tab === s.id ? 'z-accent-soft' : 'hover:bg-[hsl(var(--z-surface-soft))]'
              }`}
            >
              <s.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{s.label}</span>
            </button>
          ))}
          {visible.length === 0 && (
            <p className="px-2.5 py-2 text-[11.5px] text-[hsl(var(--z-text-dim))]">No settings match.</p>
          )}
        </nav>
      </aside>

      <div className="z-scroll min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <Pane />
      </div>
    </div>
  );
}