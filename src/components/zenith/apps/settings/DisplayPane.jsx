import React from 'react';
import { Bluetooth, MonitorSmartphone, Moon, Plane, RefreshCw, Sparkles, Sun, Wifi } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import { SCALE_LIMITS } from '@/lib/zenith/settings';
import { Pane, Section, Card, Row, SliderRow, Segmented } from './parts';

const PRESETS = [
  { id: 'small', label: 'Small', value: 0.85 },
  { id: 'default', label: 'Default', value: 1 },
  { id: 'large', label: 'Large', value: 1.25 },
  { id: 'huge', label: 'Huge', value: 1.5 },
];

export default function DisplayPane() {
  const { settings, updateSettings, setScale } = useOS();

  const activePreset =
    PRESETS.find((p) => Math.abs(p.value - settings.scale) < 0.03)?.id || 'custom';

  return (
    <Pane title="Display & Sound" subtitle="Brightness, interface scale and connectivity.">
      <Section title="Interface scale" hint="Makes the entire desktop bigger or smaller — menus, dock and every app.">
        <Card>
          <SliderRow
            icon={MonitorSmartphone}
            label="Scale"
            value={settings.scale}
            min={SCALE_LIMITS.min}
            max={SCALE_LIMITS.max}
            step={SCALE_LIMITS.step}
            onChange={setScale}
            format={(v) => `${Math.round(v * 100)}%`}
            action={
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Segmented
                  value={activePreset}
                  onChange={(id) => {
                    const preset = PRESETS.find((p) => p.id === id);
                    if (preset) setScale(preset.value);
                  }}
                  options={PRESETS}
                />
                <button
                  type="button"
                  onClick={() => setScale(1)}
                  className="z-hoverable flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] text-[hsl(var(--z-text-dim))]"
                >
                  <RefreshCw className="h-3 w-3" />
                  Reset to 100%
                </button>
              </div>
            }
          />
        </Card>
      </Section>

      <Section title="Display" hint="Screen brightness and warm tones for late sessions.">
        <Card>
          <SliderRow
            icon={Sun}
            label="Brightness"
            value={settings.brightness}
            min={0.4}
            max={1}
            step={0.02}
            onChange={(v) => updateSettings({ brightness: v })}
          />
          <Row
            icon={Moon}
            label="Night light"
            hint="Shifts the desktop toward warmer colours."
            on={settings.nightLight}
            onClick={() => updateSettings({ nightLight: !settings.nightLight })}
          />
        </Card>
      </Section>

      <Section title="Sound">
        <Card>
          <SliderRow
            icon={Sun}
            label="Output volume"
            value={settings.volume}
            min={0}
            max={1}
            step={0.02}
            onChange={(v) => updateSettings({ volume: v })}
          />
          <Row
            icon={Sparkles}
            label="Interface sounds"
            hint="Chimes, clicks and notification tones."
            on={settings.sounds}
            onClick={() => updateSettings({ sounds: !settings.sounds })}
          />
        </Card>
      </Section>

      <Section title="Connectivity">
        <Card>
          {[
            { id: 'wifi', label: 'Wi-Fi', hint: settings.wifi && !settings.airplane ? 'Connected to Zenith-Net 6E' : 'Off', icon: Wifi },
            { id: 'bluetooth', label: 'Bluetooth', hint: 'Pair keyboards and headphones.', icon: Bluetooth },
            { id: 'airplane', label: 'Airplane mode', hint: 'Disable all wireless radios.', icon: Plane },
          ].map((row) => (
            <Row
              key={row.id}
              icon={row.icon}
              label={row.label}
              hint={row.hint}
              on={Boolean(settings[row.id])}
              onClick={() => updateSettings({ [row.id]: !settings[row.id] })}
            />
          ))}
        </Card>
      </Section>
    </Pane>
  );
}