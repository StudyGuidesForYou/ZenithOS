import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plane, Sparkles, Moon, Sun, Bluetooth, Wifi, WifiOff, MonitorSmartphone, Settings as SettingsIcon, Lock, LayoutGrid } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import { SCALE_LIMITS, DOCK_SIZE_IDS } from '@/lib/zenith/settings';
import RangeSlider from '@/components/zenith/RangeSlider';

function Tile({ icon: Icon, label, on, onClick, hint }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`z-pressable flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left text-[12.5px] transition-colors ${
        on
          ? 'z-accent-soft border-transparent'
          : 'border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))] hover:bg-[hsl(var(--z-surface-soft))]/80'
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          on ? 'z-accent-bg' : 'bg-[hsl(var(--z-surface-strong))]'
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate">{label}</span>
        {hint && <span className="block truncate text-[10.5px] text-[hsl(var(--z-text-dim))]">{hint}</span>}
      </span>
    </button>
  );
}

export default function ControlCenter() {
  const { panel, closePanels, settings, updateSettings, setScale, openApp, lock, togglePanel } = useOS();
  const open = panel === 'control';

  const connectivity = [
    { id: 'wifi', label: settings.airplane ? 'Wi-Fi (airplane on)' : settings.wifi ? 'Wi-Fi on' : 'Wi-Fi off', icon: settings.wifi && !settings.airplane ? Wifi : WifiOff, on: settings.wifi && !settings.airplane, run: () => updateSettings({ wifi: !settings.wifi, airplane: false }) },
    { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth, on: settings.bluetooth, run: () => updateSettings({ bluetooth: !settings.bluetooth }) },
    { id: 'airplane', label: 'Airplane mode', icon: Plane, on: settings.airplane, run: () => updateSettings({ airplane: !settings.airplane }) },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-[68]" onClick={closePanels} />
          <motion.div
            className="z-glass-strong z-scroll fixed right-2 z-[69] w-[352px] max-w-[calc(100vw-16px)] overflow-y-auto rounded-3xl p-3"
            style={{ top: 'calc(var(--z-menubar) + 6px)', maxHeight: 'calc(100vh - var(--z-menubar) - 14px)' }}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: settings.reduceMotion ? 0 : 0.18, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-2 gap-2">
              {connectivity.map((t) => (
                <Tile key={t.id} icon={t.icon} label={t.label} on={t.on} onClick={t.run} />
              ))}
              <Tile
                icon={settings.theme === 'dark' ? Moon : Sun}
                label={settings.theme === 'dark' ? 'Dark appearance' : 'Light appearance'}
                on={settings.theme === 'dark'}
                onClick={() => updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' })}
              />
              <Tile
                icon={Sparkles}
                label="Night light"
                on={settings.nightLight}
                onClick={() => updateSettings({ nightLight: !settings.nightLight })}
              />
              <Tile
                icon={Sparkles}
                label="Reduce motion"
                on={settings.reduceMotion}
                onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
              />
              <Tile
                icon={MonitorSmartphone}
                label="Reduce transparency"
                on={!settings.transparency}
                onClick={() => updateSettings({ transparency: !settings.transparency })}
              />
            </div>

            <div className="mt-3 space-y-4 rounded-2xl border border-[hsl(var(--z-border))] p-3">
              <RangeSlider
                icon={Sun}
                label="Display brightness"
                value={settings.brightness}
                onChange={(v) => updateSettings({ brightness: v })}
              />
              <RangeSlider
                icon={MonitorSmartphone}
                label="Interface scale"
                min={SCALE_LIMITS.min}
                max={SCALE_LIMITS.max}
                step={SCALE_LIMITS.step}
                value={settings.scale}
                onChange={setScale}
                format={(v) => `${Math.round(v * 100)}%`}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="z-seg">
                {DOCK_SIZE_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    data-active={settings.dockSize === id ? 'true' : 'false'}
                    onClick={() => updateSettings({ dockSize: id })}
                    className="z-seg-item capitalize"
                  >
                    {id}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => togglePanel('mission')}
                className="z-pressable flex h-8 items-center gap-1.5 rounded-xl border border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))] px-2.5 text-[11.5px]"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                Mission Control
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  closePanels();
                  openApp('settings');
                }}
                className="z-hoverable z-pressable flex items-center justify-center gap-2 rounded-2xl border border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))] px-3 py-2.5 text-[12.5px]"
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </button>
              <button
                type="button"
                onClick={lock}
                className="z-hoverable z-pressable flex items-center justify-center gap-2 rounded-2xl border border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))] px-3 py-2.5 text-[12.5px]"
              >
                <Lock className="h-4 w-4" />
                Lock
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}