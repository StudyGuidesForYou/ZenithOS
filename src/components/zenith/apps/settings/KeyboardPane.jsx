import React from 'react';
import { Keyboard } from 'lucide-react';
import { Pane, Section, Card } from './parts';

const GROUPS = [
  {
    title: 'Search & apps',
    rows: [
      { keys: 'Ctrl + Space', action: 'Open Spotlight search' },
      { keys: 'Ctrl + K', action: 'Open Spotlight search' },
      { keys: 'Ctrl + `', action: 'Cycle through open apps' },
      { keys: 'Ctrl + ,', action: 'Open System Settings' },
    ],
  },
  {
    title: 'Windows',
    rows: [
      { keys: 'Drag the title bar', action: 'Move a window' },
      { keys: 'Flit to a screen edge', action: 'Snap left, right or maximise' },
      { keys: 'Double-click the title bar', action: 'Zoom the window' },
      { keys: 'F3 / Ctrl + ↑', action: 'Mission Control' },
      { keys: 'Esc', action: 'Close panels and overlays' },
    ],
  },
  {
    title: 'System',
    rows: [
      { keys: 'Ctrl + Shift + L', action: 'Lock the screen' },
      { keys: 'Enter (locked)', action: 'Unlock' },
      { keys: 'Ctrl + S', action: 'Save the note you are editing' },
    ],
  },
];

export default function KeyboardPane() {
  return (
    <Pane title="Shortcuts" subtitle="Every key ZenithOS listens for — nothing here can close your browser.">
      {GROUPS.map((group) => (
        <Section key={group.title} title={group.title}>
          <Card>
            {group.rows.map((row) => (
              <div
                key={row.keys}
                className="flex items-center gap-3 border-b border-[hsl(var(--z-border))] px-4 py-2.5 last:border-b-0"
              >
                <Keyboard className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--z-text-dim))]" />
                <span className="min-w-0 flex-1 text-[12.5px]">{row.action}</span>
                <span className="z-glass-soft shrink-0 rounded-lg px-2 py-1 text-[11px] tabular-nums">
                  {row.keys}
                </span>
              </div>
            ))}
          </Card>
        </Section>
      ))}
    </Pane>
  );
}