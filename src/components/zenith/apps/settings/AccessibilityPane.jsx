const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useRef } from 'react';
import { Ear, Eye, Keyboard, MousePointer2, Sparkles, Volume2, Waves, Zap } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';

import { Pane, Section, Card, Row, SliderRow } from './parts';

export default function AccessibilityPane() {
  const { settings, updateSettings, notify } = useOS();
  const fileRef = useRef(null);

  const onCursorFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { file_url } = await db.integrations.Core.UploadPublicFile({ file });
      updateSettings({ cursorUrl: file_url });
      notify({ title: 'Custom pointer installed', body: file.name });
    } catch {
      notify({ title: 'Upload failed', body: 'Could not read that file.' });
    }
  };

  return (
    <Pane title="Accessibility" subtitle="Comfort controls for motion, contrast and legibility.">
      <Section title="Motion & contrast">
        <Card>
          <Row
            icon={Zap}
            label="Reduce motion"
            hint="Calmer transitions and no floating light."
            on={settings.reduceMotion}
            onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
          />
          <Row
            icon={Eye}
            label="Reduce transparency"
            hint="Solid surfaces instead of frosted glass — easier to read."
            on={!settings.transparency}
            onClick={() => updateSettings({ transparency: !settings.transparency })}
          />
          <Row
            icon={Sparkles}
            label="Desktop widgets"
            hint="Turn the widget board off for a cleaner desktop."
            on={settings.widgetsOnDesktop}
            onClick={() => updateSettings({ widgetsOnDesktop: !settings.widgetsOnDesktop })}
          />
        </Card>
      </Section>

      <Section title="Wobbly windows" hint="Windows jiggle and skew as you drag them, then spring back.">
        <Card>
          <Row
            icon={Waves}
            label="Enable wobbly windows"
            hint="A playful, Compiz-style drag effect."
            on={settings.wobbly}
            onClick={() => updateSettings({ wobbly: !settings.wobbly })}
          />
          <SliderRow
            icon={Waves}
            label="Wobble intensity"
            value={settings.wobblyIntensity}
            min={0}
            max={1}
            step={0.05}
            onChange={(v) => updateSettings({ wobblyIntensity: v })}
            format={(v) => `${Math.round(v * 100)}%`}
          />
        </Card>
      </Section>

      <Section title="Pointer" hint="Use your own .png or .cur file as the system cursor.">
        <Card>
          <div className="flex items-center gap-3 border-b border-[hsl(var(--z-border))] px-4 py-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--z-surface-soft))]">
              <MousePointer2 className="h-3.5 w-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12.5px]">Custom cursor</span>
              <span className="block truncate text-[11px] text-[hsl(var(--z-text-dim))]">
                {settings.cursorUrl ? 'Custom pointer in use' : 'Default arrow'}
              </span>
            </span>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="z-accent-soft z-pressable rounded-lg border px-2.5 py-1 text-[11.5px]"
            >
              Choose file
            </button>
            {settings.cursorUrl && (
              <button
                type="button"
                onClick={() => updateSettings({ cursorUrl: '' })}
                className="z-hoverable rounded-lg border border-[hsl(var(--z-border))] px-2.5 py-1 text-[11.5px]"
              >
                Reset
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/x-icon,image/svg+xml,image/gif"
              onChange={onCursorFile}
              className="hidden"
            />
          </div>
        </Card>
      </Section>

      <Section title="Hearing">
        <Card>
          <Row
            icon={Volume2}
            label="Interface sounds"
            hint="Chimes, clicks and notification tones."
            on={settings.sounds}
            onClick={() => updateSettings({ sounds: !settings.sounds })}
          />
          <Row
            icon={Ear}
            label="Volume"
            hint={`Currently ${Math.round(settings.volume * 100)}% — adjust in Display & Sound.`}
            on={settings.volume > 0}
            onClick={() => updateSettings({ volume: settings.volume > 0 ? 0 : 0.4 })}
          />
        </Card>
      </Section>

      <Section title="Legibility" hint="Bigger text everywhere is one setting away.">
        <button
          type="button"
          onClick={() => updateSettings({ scale: 1.25 })}
          className="z-hoverable z-pressable flex items-center gap-2.5 rounded-2xl border border-[hsl(var(--z-border))] px-3.5 py-2.5 text-[12.5px]"
        >
          <Keyboard className="h-4 w-4" />
          Bump the interface scale to 125%
        </button>
      </Section>
    </Pane>
  );
}