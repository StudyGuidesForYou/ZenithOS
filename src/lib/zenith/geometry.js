/* Window geometry + Mission Control layout. All values are logical pixels
   inside the desktop surface (already inset by the menu bar). The dock
   floats on top of this surface; maximized windows cover it entirely. */

export const effectiveRect = (win, viewport) => {
  const vh = Math.max(200, viewport.h);
  const fullH = Math.max(vh, viewport.fullH || vh);
  // Phones and very narrow windows always use the full surface.
  if (viewport.w < 760) return { x: 0, y: 0, w: viewport.w, h: fullH };
  // Maximized: cover the whole screen below the menu bar (hides the dock).
  if (win.maximized) return { x: 0, y: 0, w: viewport.w, h: fullH };
  if (win.snap === 'left') return { x: 0, y: 0, w: Math.round(viewport.w / 2), h: vh };
  if (win.snap === 'right') return { x: Math.round(viewport.w / 2), y: 0, w: Math.ceil(viewport.w / 2), h: vh };
  const w = Math.min(win.w, viewport.w);
  const h = Math.min(win.h, vh);
  return {
    x: Math.max(Math.min(win.x, viewport.w - 120), -w + 120),
    y: Math.max(Math.min(win.y, vh - 60), 0),
    w,
    h,
  };
};

/* Mission Control: spread every window into a tidy grid, keeping each
   window's aspect ratio. Returns { [windowId]: rect }. */
export const missionSlots = (windows, viewport) => {
  const list = windows.filter((w) => !w.minimized);
  const slots = {};
  if (!list.length) return slots;
  const pad = viewport.w < 760 ? 16 : 42;
  const gap = viewport.w < 760 ? 12 : 24;
  const cols = Math.min(viewport.w < 760 ? 2 : 3, Math.ceil(Math.sqrt(list.length)));
  const rows = Math.ceil(list.length / cols);
  const cellW = Math.max(80, (viewport.w - pad * 2 - gap * (cols - 1)) / cols);
  const cellH = Math.max(60, (viewport.h - pad * 2 - gap * (rows - 1)) / rows);

  list.forEach((w, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const base = effectiveRect(w, viewport);
    const fit = Math.min(cellW / Math.max(base.w, 1), cellH / Math.max(base.h, 1), 1);
    const bw = Math.max(120, Math.round(base.w * fit));
    const bh = Math.max(80, Math.round(base.h * fit));
    slots[w.id] = {
      x: Math.round(pad + col * (cellW + gap) + (cellW - bw) / 2),
      y: Math.round(pad + row * (cellH + gap) + (cellH - bh) / 2),
      w: bw,
      h: bh,
    };
  });
  return slots;
};