import { useCallback, useEffect, useRef, useState } from 'react';
import { useOS } from '@/lib/zenith/osContext';

const EDGE = 18;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

/* Window drag + resize. When `options.wobbly` is on, the drag phase also
   drives a skew motion value (`options.wobbleSource`) from pointer velocity
   so the window jiggles as it moves and springs back on release. */
export default function useWindowInteractions(win, options = {}) {
  const { viewport, setWindowRect, applySnap, setSnapPreview, focusWindow, scale = 1 } = useOS();
  const MIN_W = Math.round(360 * scale);
  const MIN_H = Math.round(240 * scale);
  const state = useRef(null);
  const [busy, setBusy] = useState(false);
  const floating = useRef({ x: win.x, y: win.y, w: win.w, h: win.h });
  floating.current = { x: win.x, y: win.y, w: win.w, h: win.h };
  const viewportRef = useRef(viewport);
  viewportRef.current = viewport;

  const wobble = options.wobbly ? options.intensity || 0.5 : 0;
  const wobbleSource = options.wobbleSource;

  const start = useCallback(
    (e, mode, dir) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (e.target.closest('[data-nodrag]')) return;
      focusWindow(win.id);
      const rect = { ...floating.current };
      state.current = {
        mode,
        dir,
        px: e.clientX,
        py: e.clientY,
        lastX: e.clientX,
        lastT: performance.now(),
        rect,
        hint: null,
        grabbing: clamp((e.clientX - rect.x) / Math.max(rect.w, 1), 0.02, 0.98),
        floating: !win.maximized && !win.snap,
      };
      if (mode === 'resize' && !state.current.floating) {
        setWindowRect(win.id, { maximized: false, snap: null, ...rect });
      }
      document.body.style.userSelect = 'none';
      setBusy(true);
    },
    [focusWindow, setWindowRect, win.id, win.maximized, win.snap]
  );

  const minW = MIN_W;
  const minH = MIN_H;

  const move = useCallback(
    (e) => {
      const s = state.current;
      if (!s) return;
      const vp = viewportRef.current;
      const dx = e.clientX - s.px;
      const dy = e.clientY - s.py;

      if (s.mode === 'drag') {
        // wobble: derive a skew from horizontal velocity
        if (wobble && wobbleSource) {
          const now = performance.now();
          const dt = Math.max(1, now - s.lastT);
          const vx = (e.clientX - s.lastX) / dt; // px / ms
          const skew = clamp(vx * wobble * 11, -14, 14);
          wobbleSource.set(skew);
          s.lastX = e.clientX;
          s.lastT = now;
        }

        if (!s.floating) {
          if (Math.abs(dx) < 8 && dy < 10) return;
          const w = Math.min(s.rect.w, vp.w - 24);
          const h = Math.min(s.rect.h, vp.h - 24);
          s.rect = { x: e.clientX - w * s.grabbing, y: clamp(e.clientY - 18, 0, vp.h - h), w, h };
          s.px = e.clientX;
          s.py = e.clientY;
          s.floating = true;
          setWindowRect(win.id, { ...s.rect, maximized: false, snap: null });
          return;
        }
        setWindowRect(win.id, {
          x: clamp(s.rect.x + dx, -s.rect.w + 150, vp.w - 150),
          y: clamp(s.rect.y + dy, 0, vp.h - 48),
          maximized: false,
          snap: null,
        });
        let hint = null;
        if (e.clientY <= 4) hint = 'max';
        else if (e.clientX <= EDGE) hint = 'left';
        else if (e.clientX >= vp.w - EDGE) hint = 'right';
        s.hint = hint;
        setSnapPreview(hint);
        return;
      }

      const dir = s.dir || '';
      let { x, y, w, h } = s.rect;
      if (dir.includes('e')) w = clamp(s.rect.w + dx, minW, vp.w - s.rect.x);
      if (dir.includes('s')) h = clamp(s.rect.h + dy, minH, vp.h - s.rect.y);
      if (dir.includes('w')) {
        const nw = clamp(s.rect.w - dx, minW, s.rect.x + s.rect.w);
        x = s.rect.x + s.rect.w - nw;
        w = nw;
      }
      if (dir.includes('n')) {
        const nh = clamp(s.rect.h - dy, minH, s.rect.y + s.rect.h);
        y = s.rect.y + s.rect.h - nh;
        h = nh;
      }
      setWindowRect(win.id, { x, y, w, h, maximized: false, snap: null });
    },
    [setSnapPreview, setWindowRect, win.id, minW, minH, wobble, wobbleSource]
  );

  const end = useCallback(() => {
    const s = state.current;
    state.current = null;
    document.body.style.userSelect = '';
    setBusy(false);
    if (s?.mode === 'drag' && s.hint) applySnap(win.id, s.hint);
    setSnapPreview(null);
    if (wobbleSource) wobbleSource.set(0);
  }, [applySnap, setSnapPreview, win.id, wobbleSource]);

  useEffect(() => {
    if (!busy) return;
    const onMove = (e) => move(e);
    const onUp = () => end();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [busy, move, end]);

  return {
    busy,
    startDrag: (e) => start(e, 'drag'),
    startResize: (dir) => (e) => start(e, 'resize', dir),
  };
}