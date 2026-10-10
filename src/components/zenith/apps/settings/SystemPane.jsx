import React, { useMemo, useState } from 'react';
import { Cpu, HardDrive, RotateCcw, Sparkles, User } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import BrandLogo from '@/components/zenith/BrandLogo';
import { Pane, Section, Card, Row, SliderRow } from './parts';

const QUOTA = 5 * 1024 * 1024;

export default function SystemPane() {
  const { settings, updateSettings, resetSettings, fs } = useOS();
  const [confirm, setConfirm] = useState(null);

  const stats = useMemo(() => {
    const nodes = Object.values(fs.nodes);
    const bytes = fs.size();
    return {
      files: nodes.filter((n) => n.type === 'file').length,
      folders: nodes.filter((n) => n.type === 'folder').length,
      kb: (bytes / 1024).toFixed(1),
      percent: Math.min(100, Math.round((bytes / QUOTA) * 100)),
    };
  }, [fs]);

  const specs = [
    { label: 'Resolution', value: `${window.innerWidth} × ${window.innerHeight}` },
    { label: 'Logical cores', value: String(navigator.hardwareConcurrency || '—') },
    { label: 'Memory', value: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : '—' },
    { label: 'Interface scale', value: `${Math.round(settings.scale * 100)}%` },
    { label: 'Appearance', value: settings.theme === 'dark' ? 'Dark glass' : 'Light glass' },
    { label: 'Build', value: '2026.10 · Aurora 1.1' },
  ];

  return (
    <Pane title="System" subtitle="Your account, storage and the reset buttons.">
      <Section title="Account" hint="Shown on the lock screen and in the menu bar.">
        <Card>
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--z-surface-soft))]">
              <User className="h-3.5 w-3.5" />
            </span>
            <input
              value={settings.username}
              onChange={(e) => updateSettings({ username: e.target.value })}
              className="min-w-0 flex-1 bg-transparent text-[12.5px] outline-none"
              placeholder="Your name"
            />
          </div>
        </Card>
      </Section>

      <Section title="Storage">
        <div className="rounded-2xl border border-[hsl(var(--z-border))] p-4">
          <div className="flex items-center gap-2 text-[12.5px]">
            <HardDrive className="h-4 w-4" />
            Zenith drive
            <span className="ml-auto text-[hsl(var(--z-text-dim))]">{stats.kb} KB used</span>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--z-border))]">
            <div
              className="z-accent-bg h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, stats.percent)}%` }}
            />
          </div>
          <p className="mt-2.5 text-[11px] text-[hsl(var(--z-text-dim))]">
            {stats.files} files · {stats.folders} folders stored privately on this device
          </p>
        </div>
      </Section>

      <Section title="Reset" hint="Nothing here can leave the desktop in a broken state — both options are safe.">
        <Card>
          <Row
            icon={RotateCcw}
            label="Reset all settings"
            hint="Back to the factory look: scale 100%, violet accent, default dock."
            onClick={() => setConfirm('settings')}
          />
          <Row
            icon={RotateCcw}
            label="Reset settings and erase the drive"
            hint="Removes every file and folder you created on this device."
            onClick={() => setConfirm('all')}
          />
        </Card>

        {confirm && (
          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-3.5 py-3">
            <span className="text-[12px]">
              {confirm === 'all' ? 'Erase every file and reset the desktop?' : 'Reset all settings?'}
            </span>
            <button
              type="button"
              onClick={() => {
                if (confirm === 'all') fs.reset();
                resetSettings();
                setConfirm(null);
              }}
              className="ml-auto rounded-xl bg-rose-500 px-3 py-1.5 text-[11.5px] font-medium text-white"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setConfirm(null)}
              className="rounded-xl border border-[hsl(var(--z-border-strong))] px-3 py-1.5 text-[11.5px]"
            >
              Cancel
            </button>
          </div>
        )}
      </Section>

      <Section title="About">
        <div className="flex flex-col gap-5 rounded-2xl border border-[hsl(var(--z-border))] p-5 sm:flex-row sm:items-center">
          <BrandLogo className="h-[84px] w-[84px]" glow />
          <div>
            <p className="text-[16px] font-semibold">ZenithOS 1.1 “Aurora”</p>
            <p className="mt-1 text-[12px] text-[hsl(var(--z-text-dim))]">
              A liquid-glass desktop environment running entirely in your browser.
            </p>
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[hsl(var(--z-text-dim))]">
              <Sparkles className="h-3 w-3" /> Built with Base44
            </p>
          </div>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {specs.map((s) => (
            <div key={s.label} className="rounded-2xl border border-[hsl(var(--z-border))] px-3 py-2.5">
              <dt className="text-[10.5px] uppercase tracking-[0.14em] text-[hsl(var(--z-text-dim))]">{s.label}</dt>
              <dd className="mt-0.5 truncate text-[12.5px]">{s.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[hsl(var(--z-text-dim))]">
          <Cpu className="h-3 w-3" /> Everything you create stays on this device — nothing is uploaded.
        </p>
      </Section>
    </Pane>
  );
}