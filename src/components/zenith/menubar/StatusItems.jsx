import React, { useEffect, useState } from 'react';
import { Battery, BatteryCharging, Bluetooth, Plug, Search, SlidersHorizontal, Volume2, VolumeX, Wifi, WifiOff } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import useBattery from '@/lib/zenith/useBattery';

function TrayButton({ onClick, title, active, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="z-menubar-item flex h-6 items-center gap-1.5 px-1.5"
      data-open={active ? 'true' : 'false'}
    >
      {children}
    </button>
  );
}

export default function StatusItems() {
  const { settings, updateSettings, togglePanel, panel, openApp } = useOS();
  const [now, setNow] = useState(new Date());
  const battery = useBattery();

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(i);
  }, []);

  const wireless = settings.wifi && !settings.airplane;
  const muted = settings.volume <= 0;

  return (
    <div className="flex items-center gap-0.5">
      <TrayButton
        title="Spotlight search"
        onClick={() => togglePanel('spotlight')}
        active={panel === 'spotlight'}
      >
        <Search className="h-3.5 w-3.5" />
      </TrayButton>

      <TrayButton
        title={settings.airplane ? 'Airplane mode' : wireless ? 'Wi-Fi connected' : 'Wi-Fi off'}
        onClick={() => updateSettings({ wifi: !settings.wifi, airplane: false })}
      >
        {wireless ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
      </TrayButton>

      {settings.bluetooth && (
        <TrayButton title="Bluetooth" onClick={() => updateSettings({ bluetooth: false })}>
          <Bluetooth className="h-3.5 w-3.5" />
        </TrayButton>
      )}

      <TrayButton
        title={battery.ac ? 'On AC power' : `Battery ${battery.level}%${battery.charging ? ' (charging)' : ''}`}
        onClick={() => togglePanel('control')}
      >
        {battery.ac ? (
          <Plug className="h-3.5 w-3.5" />
        ) : battery.charging ? (
          <BatteryCharging className="h-4 w-4" />
        ) : (
          <Battery className="h-4 w-4" />
        )}
        {!battery.ac && <span className="text-[11px] tabular-nums">{battery.level}%</span>}
      </TrayButton>

      <TrayButton
        title={muted ? 'Muted' : `Volume ${Math.round(settings.volume * 100)}%`}
        onClick={() => togglePanel('control')}
        active={panel === 'control'}
      >
        {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
      </TrayButton>

      <TrayButton title="Control Center" onClick={() => togglePanel('control')} active={panel === 'control'}>
        <SlidersHorizontal className="h-3.5 w-3.5" />
      </TrayButton>

      <TrayButton
        title="Notifications and widgets"
        onClick={() => togglePanel('notifications')}
        active={panel === 'notifications'}
      >
        <span className="text-[12px] font-medium tabular-nums">
          {now.toLocaleDateString([], { weekday: 'short' })} {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
        </span>
      </TrayButton>

      <TrayButton title="System Settings" onClick={() => openApp('settings')}>
        <span className="z-accent-bg flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold">
          Z
        </span>
      </TrayButton>
    </div>
  );
}