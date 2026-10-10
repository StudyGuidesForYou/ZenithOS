let ctx = null;
let volume = 0.4;

export const setSoundVolume = (v) => {
  volume = typeof v === 'number' ? v : 0.4;
};

const getCtx = () => {
  if (typeof window === 'undefined') return null;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  } catch (e) {
    return null;
  }
};

function tone({ freq = 660, dur = 0.08, type = 'sine', gain = 0.05, delay = 0 }) {
  if (volume <= 0) return;
  const c = getCtx();
  if (!c) return;
  try {
    const t = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(gain * volume, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t);
    osc.stop(t + dur + 0.03);
  } catch (e) {
    /* audio unavailable */
  }
}

export const playClick = () => tone({ freq: 1180, dur: 0.05, type: 'triangle', gain: 0.05 });
export const playOpen = () => {
  tone({ freq: 540, dur: 0.09, gain: 0.05 });
  tone({ freq: 810, dur: 0.12, gain: 0.04, delay: 0.05 });
};
export const playClose = () => tone({ freq: 400, dur: 0.1, gain: 0.04 });
export const playNotify = () => {
  tone({ freq: 880, dur: 0.12, gain: 0.05 });
  tone({ freq: 1320, dur: 0.2, gain: 0.035, delay: 0.09 });
};
export const playChime = () => {
  [523, 659, 784, 1046].forEach((f, i) => tone({ freq: f, dur: 0.6, gain: 0.045, delay: i * 0.15 }));
};