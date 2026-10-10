import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useOS } from '@/lib/zenith/osContext';
import AppView from '@/components/zenith/apps/registry';
import TrafficLights from '@/components/zenith/TrafficLights';
import useWindowInteractions from './useWindowInteractions';

const HANDLES = [
  ['n', 'left-4 right-4 top-0 h-1.5 cursor-ns-resize'],
  ['s', 'bottom-0 left-4 right-4 h-1.5 cursor-ns-resize'],
  ['w', 'bottom-4 left-0 top-4 w-1.5 cursor-ew-resize'],
  ['e', 'bottom-4 right-0 top-4 w-1.5 cursor-ew-resize'],
  ['nw', 'left-0 top-0 h-3 w-3 cursor-nwse-resize'],
  ['ne', 'right-0 top-0 h-3 w-3 cursor-nesw-resize'],
  ['sw', 'bottom-0 left-0 h-3 w-3 cursor-nesw-resize'],
  ['se', 'bottom-0 right-0 h-3 w-3 cursor-nwse-resize'],
];

export default function WindowFrame({ win, rect, presentation, inactive }) {
  const { settings, focusedId, closeWindow, minimizeWindow, toggleMaximize, focusWindow, panel } = useOS();

  // wobbly windows: a spring-driven skew that follows drag velocity
  const wobbleSource = useMotionValue(0);
  const wobbleSpring = useSpring(wobbleSource, { stiffness: 220, damping: 16, mass: 0.7 });

  const { busy, startDrag, startResize } = useWindowInteractions(win, {
    wobbly: settings.wobbly,
    intensity: settings.wobblyIntensity,
    wobbleSource,
  });
  const inMission = Boolean(presentation);
  const focused = focusedId === win.id && !inactive;
  const target = presentation || rect;
  const reduced = settings.reduceMotion;

  return (
    <motion.div
      data-window={win.appId}
      data-window-id={win.id}
      className="z-glass absolute flex flex-col overflow-hidden rounded-xl"
      style={{
        left: target.x,
        top: target.y,
        width: target.w,
        height: target.h,
        zIndex: 500 + win.z,
        transition: busy
          ? 'none'
          : 'left .3s cubic-bezier(.22,.9,.24,1), top .3s cubic-bezier(.22,.9,.24,1), width .3s cubic-bezier(.22,.9,.24,1), height .3s cubic-bezier(.22,.9,.24,1), box-shadow .3s ease',
        pointerEvents: win.minimized ? 'none' : 'auto',
        boxShadow: focused
          ? '0 42px 90px -26px rgb(2 1 12 / 0.78), 0 0 0 0.5px hsl(0 0% 100% / 0.12), inset 0 1px 0 0 hsl(var(--z-hi))'
          : '0 20px 50px -26px rgb(2 1 12 / 0.6), inset 0 1px 0 0 hsl(var(--z-hi))',
      }}
      initial={{ opacity: 0, scale: 0.94, y: 18 }}
      animate={{
        opacity: win.minimized ? 0 : 1,
        scale: win.minimized ? 0.86 : 1,
        y: win.minimized ? 90 : 0,
      }}
      exit={{ opacity: 0, scale: 0.95, y: 22 }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 430, damping: 36, mass: 0.9 }}
      onPointerDown={() => {
        if (!focused || panel === 'mission') focusWindow(win.id);
      }}
    >
      {/* wobble wrapper — only this layer skews, so the outer shell keeps
          crisp position/resize transitions. */}
      <motion.div
        className="relative flex h-full w-full flex-col"
        style={{ skewX: wobbleSpring, transformOrigin: '50% 18%' }}
      >
        <div
          data-titlebar="true"
          className={`relative flex h-10 shrink-0 touch-none items-center border-b border-[hsl(var(--z-border))] px-3 ${
            focused ? 'bg-white/[0.02]' : 'bg-transparent'
          }`}
          onPointerDown={inMission ? undefined : startDrag}
          onDoubleClick={() => !inMission && toggleMaximize(win.id)}
        >
          <TrafficLights
            focused={focused}
            zoomed={Boolean(win.maximized || win.snap)}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onZoom={() => toggleMaximize(win.id)}
          />
          <span className="pointer-events-none absolute inset-x-0 flex justify-center">
            <span
              className={`max-w-[58%] truncate text-[12.5px] font-medium ${
                focused ? '' : 'text-[hsl(var(--z-text-dim))]'
              }`}
            >
              {win.title}
            </span>
          </span>
        </div>

        <div className={`relative min-h-0 flex-1 overflow-hidden transition-opacity ${focused ? '' : 'opacity-[0.97]'}`}>
          <AppView win={win} />
        </div>

        {!inMission &&
          HANDLES.map(([dir, cls]) => (
            <div key={dir} data-nodrag className={`absolute z-30 ${cls}`} onPointerDown={startResize(dir)} />
          ))}
      </motion.div>

      {/* one-shot glare sweep when the window opens — a skewed highlight
          bar races across the glass, like light catching a fresh pane. */}
      {!reduced && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl" style={{ zIndex: 40 }}>
          <div
            className="z-glare absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            style={{ transform: 'skewX(-18deg)' }}
          />
        </div>
      )}
    </motion.div>
  );
}