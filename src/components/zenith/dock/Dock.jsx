import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import { LayoutGrid, Minimize2 } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import { APPS, PINNED } from '@/lib/zenith/apps';
import { DOCK_SIZES } from '@/lib/zenith/settings';
import AppIcon from '@/components/zenith/AppIcon';
import ZenithMark from '@/components/zenith/ZenithMark';
import DockIcon from './DockIcon';

export default function Dock() {
  const {
    taskbarApps,
    windows,
    focusedId,
    openApp,
    minimizeWindow,
    focusWindow,
    minimizeAll,
    settings,
    panel,
    togglePanel,
  } = useOS();

  // pointerX is a motion value, not React state — moving the cursor across the
  // dock never re-renders this component; each icon reads it via useTransform.
  const pointerX = useMotionValue(null);
  const [hovered, setHovered] = useState(null);
  const [peek, setPeek] = useState(false);
  const [bounceId, setBounceId] = useState(null);
  const refs = useRef({});
  const centers = useRef({});
  const magnify = settings.dockMagnify;
  const scale = settings.scale || 1;

  const hasMaximized = windows.some((w) => !w.minimized && w.maximized);
  const autohide = settings.dockAutohide || hasMaximized;

  // A swipe up from the bottom edge reveals the hidden dock on touch; the
  // mouse path simply peeks when the cursor reaches the bottom row.
  useEffect(() => {
    if (!autohide) {
      setPeek(false);
      return;
    }
    let hideTimer;
    const reveal = () => {
      setPeek(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setPeek(false), 2800);
    };
    const onMove = (e) => setPeek(e.clientY > window.innerHeight - 10);
    const onTouch = (e) => {
      const t = e.touches[0];
      if (t && t.clientY > window.innerHeight - 24) reveal();
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('touchstart', onTouch, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('touchstart', onTouch);
      clearTimeout(hideTimer);
    };
  }, [autohide]);

  const launch = useCallback(
    (appId) => {
      setBounceId(appId);
      openApp(appId);
      setTimeout(() => setBounceId((cur) => (cur === appId ? null : cur)), 700);
    },
    [openApp]
  );

  const minimized = windows.filter((w) => w.minimized);
  const tiles = PINNED.length + 4 + minimized.length;
  const wanted = (DOCK_SIZES[settings.dockSize] || DOCK_SIZES.medium) * scale;
  const size = Math.max(
    Math.round(28 * scale),
    Math.min(wanted, Math.floor((Math.max(window.innerWidth, 320) - 40) / Math.max(tiles, 1)) - 6)
  );

  const register = useCallback((id, el) => {
    if (el) refs.current[id] = el;
    else delete refs.current[id];
  }, []);

  const measure = useCallback(() => {
    const next = {};
    Object.entries(refs.current).forEach(([id, el]) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      next[id] = r.left + r.width / 2;
    });
    centers.current = next;
  }, []);

  const getCenter = useCallback((id) => centers.current[id], []);
  const reach = size * 2.7;

  const onAppClick = (appId, list) => {
    const visible = list.filter((w) => !w.minimized).sort((a, b) => b.z - a.z);
    if (visible.some((w) => w.id === focusedId)) {
      minimizeWindow(visible[0].id);
      return;
    }
    const top = list.slice().sort((a, b) => b.z - a.z)[0];
    if (top) focusWindow(top.id);
    else launch(appId);
  };

  const iconProps = (id) => ({
    id,
    size,
    magnify,
    pointerX,
    getCenter,
    reach,
    hovered: settings.dockLabels && hovered === id,
    onHover: setHovered,
    register,
    bounce: bounceId === id,
  });

  return (
    <motion.div
      className="absolute inset-x-0 bottom-0 z-[65] flex items-end justify-center pb-2"
      style={{ height: 'var(--z-dock)' }}
      animate={{ y: autohide && !peek ? '120%' : 0, opacity: autohide && !peek ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
      onPointerEnter={measure}
      onPointerMove={(e) => {
        if (magnify) pointerX.set(e.clientX);
      }}
      onPointerLeave={() => {
        pointerX.set(null);
        setHovered(null);
      }}
    >
      <div className="z-dockbar flex items-end gap-1.5 rounded-[1.5rem] px-2.5 py-2" data-dock="true">
        <DockIcon
          {...iconProps('launchpad')}
          label="Launchpad"
          active={panel === 'launchpad'}
          onOpen={() => togglePanel('launchpad')}
        >
          <span className="flex h-full w-full items-center justify-center rounded-[23%] bg-gradient-to-br from-violet-500/80 via-purple-600/70 to-fuchsia-600/70">
            <ZenithMark className="h-[52%] w-[52%]" />
          </span>
        </DockIcon>

        <span className="mx-1 h-[60%] w-px shrink-0 self-center bg-[hsl(var(--z-border))]" />

        {PINNED.map((appId) => {
          const app = APPS[appId];
          if (!app) return null;
          const list = taskbarApps.find((t) => t.appId === appId)?.windows || [];
          const active = list.length > 0;
          return (
            <DockIcon
              key={appId}
              {...iconProps(appId)}
              label={app.name}
              active={active}
              dim={list.every((w) => w.minimized)}
              onOpen={() => onAppClick(appId, list)}
            >
              <AppIcon appId={appId} className="h-full w-full" iconClass="h-[46%] w-[46%]" />
            </DockIcon>
          );
        })}

        {minimized.length > 0 && (
          <span className="mx-1 h-[60%] w-px shrink-0 self-center bg-[hsl(var(--z-border))]" />
        )}

        {minimized.map((w) => (
          <DockIcon
            key={w.id}
            {...iconProps(w.id)}
            label={w.title}
            onOpen={() => focusWindow(w.id)}
          >
            <span className="relative flex h-full w-full items-center justify-center rounded-[23%] border border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))]">
              <AppIcon appId={w.appId} className="h-[58%] w-[58%]" iconClass="h-[46%] w-[46%]" />
            </span>
          </DockIcon>
        ))}

        <span className="mx-1 h-[60%] w-px shrink-0 self-center bg-[hsl(var(--z-border))]" />

        <DockIcon
          {...iconProps('mission')}
          label="Mission Control"
          active={panel === 'mission'}
          onOpen={() => togglePanel('mission')}
        >
          <span className="flex h-full w-full items-center justify-center rounded-[23%] border border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))]">
            <LayoutGrid className="h-[46%] w-[46%] text-[hsl(var(--z-text))]" />
          </span>
        </DockIcon>

        <DockIcon {...iconProps('showdesktop')} label="Show Desktop" onOpen={minimizeAll}>
          <span className="flex h-full w-full items-center justify-center rounded-[23%] border border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))]">
            <Minimize2 className="h-[46%] w-[46%] text-[hsl(var(--z-text))]" />
          </span>
        </DockIcon>
      </div>
    </motion.div>
  );
}