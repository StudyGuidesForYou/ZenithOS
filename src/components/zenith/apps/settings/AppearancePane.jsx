import React, { useState } from 'react';
import { Check, Eye, Moon, Sparkles, Sun, Wallpaper as WallpaperIcon } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import { ACCENTS, WALLPAPERS } from '@/lib/zenith/wallpapers';
import { GLASS_QUALITIES } from '@/lib/zenith/settings';
import { Pane, Section, Segmented, SliderRow } from './parts';

export default function AppearancePane() {
  const { settings, updateSettings, resetSettings } = useOS();
  const [url, setUrl] = useState(settings.customWallpaper || '');

  return (
    <Pane title="Appearance" subtitle="Wallpaper, accent colour and how much glass you want.">
      <Section
        title="Wallpaper"
        hint="Animated liquid presets, or paste a link to your own picture."
        action={
          <button
            type="button"
            onClick={resetSettings}
            className="z-hoverable rounded-lg px-2 py-1 text-[11px] text-[hsl(var(--z-text-dim))]"
          >
            Reset all settings
          </button>
        }
      >
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {WALLPAPERS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => updateSettings({ wallpaper: w.id, customWallpaper: '' })}
              className={`group overflow-hidden rounded-2xl border transition-all ${
                settings.wallpaper === w.id && !settings.customWallpaper
                  ? 'border-transparent ring-2 ring-[hsl(var(--z-accent))]'
                  : 'border-[hsl(var(--z-border))] hover:border-[hsl(var(--z-border-strong))]'
              }`}
            >
              <span className="relative block h-[68px] w-full" style={{ background: w.base }}>
                {w.orbs.map((o, i) => (
                  <span
                    key={i}
                    className="absolute rounded-full"
                    style={{
                      width: o.w / 5,
                      height: o.h / 5,
                      left: o.x,
                      top: o.y,
                      background: `radial-gradient(circle at 50% 50%, ${o.color}, transparent 70%)`,
                      filter: 'blur(12px)',
                    }}
                  />
                ))}
              </span>
              <span className="flex items-center justify-between px-3 py-2 text-[11.5px]">
                {w.name}
                {settings.wallpaper === w.id && !settings.customWallpaper && (
                  <Check className="h-3 w-3 text-[hsl(var(--z-accent))]" />
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Eye className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[hsl(var(--z-text-dim))]" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://… picture URL"
              className="z-input h-9 w-full pl-8 pr-2 text-[12px]"
            />
          </div>
          <button
            type="button"
            onClick={() => updateSettings({ customWallpaper: url.trim() })}
            className="z-accent-soft z-pressable h-9 shrink-0 rounded-xl border px-3 text-[12px]"
          >
            Use picture
          </button>
          {settings.customWallpaper && (
            <button
              type="button"
              onClick={() => {
                setUrl('');
                updateSettings({ customWallpaper: '' });
              }}
              className="z-hoverable h-9 shrink-0 rounded-xl border border-[hsl(var(--z-border))] px-3 text-[12px]"
            >
              Clear
            </button>
          )}
        </div>
      </Section>

      <Section title="Accent colour" hint="Highlights, toggles and the dock indicator.">
        <div className="flex flex-wrap items-center gap-2.5">
          {ACCENTS.map((a) => (
            <button
              key={a.id}
              type="button"
              title={a.name}
              onClick={() => updateSettings({ accent: a.id })}
              className={`h-9 w-9 rounded-full border transition-transform ${
                settings.accent === a.id ? 'scale-110 border-white' : 'border-white/20 hover:scale-105'
              }`}
              style={{
                background: a.hex,
                boxShadow: settings.accent === a.id ? `0 0 20px ${a.hex}80` : 'none',
              }}
            />
          ))}
        </div>
      </Section>

      <Section title="Window style">
        <div className="space-y-3 rounded-2xl border border-[hsl(var(--z-border))] p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {settings.theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="text-[12.5px]">Appearance</span>
            </div>
            <Segmented
              value={settings.theme}
              onChange={(id) => updateSettings({ theme: id })}
              options={[
                { id: 'dark', label: 'Dark' },
                { id: 'light', label: 'Light' },
              ]}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <WallpaperIcon className="h-4 w-4" />
              <span className="text-[12.5px]">Transparency</span>
            </div>
            <Segmented
              value={settings.transparency ? 'on' : 'off'}
              onChange={(id) => updateSettings({ transparency: id === 'on' })}
              options={[
                { id: 'on', label: 'Glass' },
                { id: 'off', label: 'Solid' },
              ]}
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4" />
              <span className="text-[12.5px]">Glass quality</span>
            </div>
            <Segmented
              value={settings.glassQuality}
              onChange={(id) => updateSettings({ glassQuality: id })}
              options={GLASS_QUALITIES.map((q) => ({ id: q, label: q[0].toUpperCase() + q.slice(1) }))}
            />
          </div>

          <SliderRow
            icon={Sparkles}
            label="Glass blur intensity"
            value={settings.blur}
            min={8}
            max={80}
            step={1}
            onChange={(v) => updateSettings({ blur: Math.round(v) })}
            format={(v) => `${Math.round(v)}px`}
          />
        </div>
      </Section>
    </Pane>
  );
}