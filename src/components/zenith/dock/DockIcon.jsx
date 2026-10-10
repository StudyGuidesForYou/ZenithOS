import React from 'react';
import { motion, useTransform, useSpring } from 'framer-motion';

/* A single dock tile. Magnification grows the slot's width/height (real
   layout), so flexbox pushes neighbouring tiles aside the way macOS does —
   no overlap. The spring is tuned tight so it tracks the pointer without
   float; combined with the (no-longer-animating) wallpaper, the dock bar's
   backdrop-filter only re-rasters during the hover itself, which stays smooth. */
export default function DockIcon({
  id,
  appId,
  label,
  size,
  magnify,
  pointerX,
  getCenter,
  reach,
  active,
  dim,
  hovered,
  bounce,
  onOpen,
  onHover,
  register,
  children,
}) {
  const factor = useTransform(pointerX, (x) => {
    if (!magnify || x == null) return 0;
    const c = getCenter(id);
    if (!c) return 0;
    return Math.max(0, 1 - Math.abs(x - c) / reach);
  });
  const smooth = useSpring(factor, { stiffness: 600, damping: 38, mass: 0.3 });
  const w = useTransform(smooth, (f) => size * (1 + f * 0.5));
  const h = useTransform(smooth, (f) => size * (1 + f * 0.5));
  const yLift = useTransform(smooth, (f) => -f * size * 0.24);

  return (
    <motion.button
      type="button"
      ref={(el) => register(id, el)}
      onPointerEnter={() => onHover(id)}
      onPointerLeave={() => onHover(null)}
      onClick={onOpen}
      className="relative flex shrink-0 items-end justify-center"
      style={{ width: w, height: h, y: yLift, willChange: 'width, height, transform' }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={bounce ? { y: [0, -13, 0] } : { y: 0 }}
        transition={
          bounce
            ? { duration: 0.62, times: [0, 0.45, 1], ease: 'easeOut' }
            : { duration: 0.12 }
        }
      >
        {children ?? (
          <span className="flex h-full w-full items-center justify-center">{appId && null}</span>
        )}
      </motion.div>

      {active && (
        <span
          className="absolute -bottom-[5px] h-[3px] rounded-full bg-[hsl(var(--z-text))]"
          style={{ width: Math.max(6, size * 0.22), opacity: dim ? 0.4 : 0.85 }}
        />
      )}

      <span
        className="z-glass-strong pointer-events-none absolute bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] transition-opacity duration-150"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        {label}
      </span>
    </motion.button>
  );
}