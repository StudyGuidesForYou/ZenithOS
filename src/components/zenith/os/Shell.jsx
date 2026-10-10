import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useOS } from '@/lib/zenith/osContext';
import { accentOf } from '@/lib/zenith/wallpapers';
import useShortcuts from '@/lib/zenith/useShortcuts';
import Wallpaper from '@/components/zenith/Wallpaper';
import Desktop from '@/components/zenith/Desktop';
import WindowLayer from '@/components/zenith/windows/WindowLayer';
import MenuBar from '@/components/zenith/menubar/MenuBar';
import Dock from '@/components/zenith/dock/Dock';
import Launchpad from '@/components/zenith/Launchpad';
import Spotlight from '@/components/zenith/Spotlight';
import ControlCenter from '@/components/zenith/ControlCenter';
import NotificationCenter from '@/components/zenith/NotificationCenter';
import AppSwitcher from '@/components/zenith/AppSwitcher';
import Toasts from '@/components/zenith/Toasts';
import BootScreen from '@/components/zenith/BootScreen';
import LockScreen from '@/components/zenith/LockScreen';
import ShutdownScreen from '@/components/zenith/ShutdownScreen';

export default function Shell() {
  const { settings, phase, finishBoot, scale, chrome } = useOS();
  useShortcuts();

  // UI scaling: Tailwind spacing is rem-based, so the whole desktop scales
  // with the document root font-size. Scoping it here (and restoring on
  // unmount) keeps the auth pages at the browser default.
  useEffect(() => {
    document.documentElement.style.fontSize = `${16 * scale}px`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [scale]);

  return (
    <div
      className={`zenith-root ${settings.reduceMotion ? 'z-reduce' : ''}`}
      data-theme={settings.theme}
      data-transparency={settings.transparency ? 'on' : 'off'}
      data-glass={settings.glassQuality || 'high'}
      data-cursor={settings.cursorUrl ? 'true' : undefined}
      style={{
        '--z-accent': accentOf(settings.accent).h,
        '--z-blur': settings.transparency ? `${settings.blur}px` : '0px',
        '--z-menubar': `${chrome.menubarH}px`,
        '--z-dock': `${chrome.dockH}px`,
        '--z-scale': scale,
        '--z-cursor': settings.cursorUrl ? `url(${settings.cursorUrl}) 4 4` : undefined,
        fontSize: `${16 * scale}px`,
      }}
    >
      <Wallpaper id={settings.wallpaper} custom={settings.customWallpaper} />

      {/* desktop surface: inset by the menu bar only — the dock floats on
          top, so maximized windows can cover it for true full-screen. */}
      <div className="absolute inset-x-0 z-10" style={{ top: 'var(--z-menubar)', bottom: 0 }}>
        <Desktop />
        <WindowLayer />
      </div>

      <MenuBar />
      <Dock />
      <Launchpad />
      <Spotlight />
      <ControlCenter />
      <NotificationCenter />
      <AppSwitcher />
      <Toasts />

      <div
        className="pointer-events-none absolute inset-0 z-[95] bg-black transition-opacity duration-500"
        style={{ opacity: Math.max(0, (1 - settings.brightness) * 0.62) }}
      />
      {settings.nightLight && (
        <div
          className="pointer-events-none absolute inset-0 z-[96]"
          style={{ background: 'rgba(255,166,66,0.13)', mixBlendMode: 'overlay' }}
        />
      )}

      <AnimatePresence>{phase === 'boot' && <BootScreen key="boot" onDone={finishBoot} />}</AnimatePresence>
      <AnimatePresence>{phase === 'locked' && <LockScreen key="lock" />}</AnimatePresence>
      <AnimatePresence>{phase === 'off' && <ShutdownScreen key="off" />}</AnimatePresence>
    </div>
  );
}