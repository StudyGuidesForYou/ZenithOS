import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

const fmt = (ms) => {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const cs = Math.floor((ms % 1000) / 10);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
};

export default function StopwatchWidget() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(0);
  const baseRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = performance.now();
    const t = setInterval(() => {
      setElapsed(baseRef.current + (performance.now() - startRef.current));
    }, 33);
    return () => clearInterval(t);
  }, [running]);

  const toggle = () => {
    if (running) {
      baseRef.current = elapsed;
      setRunning(false);
    } else {
      setRunning(true);
    }
  };
  const reset = () => {
    baseRef.current = 0;
    setElapsed(0);
    setRunning(false);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-[26px] font-semibold tabular-nums" style={{ fontFamily: 'var(--font-mono)' }}>
        {fmt(elapsed)}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggle}
          className="z-accent-bg z-pressable flex h-7 w-7 items-center justify-center rounded-full"
          title={running ? 'Pause' : 'Start'}
        >
          {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          onClick={reset}
          className="z-hoverable flex h-7 w-7 items-center justify-center rounded-full"
          title="Reset"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}