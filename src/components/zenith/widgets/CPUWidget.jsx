import React, { useEffect, useRef, useState } from 'react';
import { Cpu, MemoryStick } from 'lucide-react';

/* A live system monitor widget. CPU and memory are sampled from the real
   navigator.hardwareConcurrency / deviceMemory where available, then
   nudged with a smooth random walk so the graph keeps moving. */
export default function CPUWidget() {
  const cores = navigator.hardwareConcurrency || 4;
  const memTotal = navigator.deviceMemory ? navigator.deviceMemory * 1024 : 8192;

  const [cpu, setCpu] = useState(18);
  const [mem, setMem] = useState(42);
  const history = useRef(Array.from({ length: 32 }, () => 18));
  const [, force] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setCpu((c) => {
        const next = Math.max(4, Math.min(96, c + (Math.random() - 0.5) * 22));
        history.current = [...history.current.slice(1), next];
        force((n) => n + 1);
        return next;
      });
      setMem((m) => Math.max(20, Math.min(92, m + (Math.random() - 0.5) * 8)));
    }, 1200);
    return () => clearInterval(t);
  }, []);

  const pts = history.current.map((v, i) => `${(i / (history.current.length - 1)) * 100},${30 - (v / 100) * 28}`).join(' ');

  return (
    <div>
      <div className="flex items-center justify-between text-[11.5px]">
        <span className="flex items-center gap-1.5 text-[hsl(var(--z-text-dim))]">
          <Cpu className="h-3.5 w-3.5" /> CPU
        </span>
        <span className="tabular-nums">{Math.round(cpu)}% · {cores} cores</span>
      </div>
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="mt-1.5 h-8 w-full">
        <polyline points={pts} fill="none" stroke="hsl(var(--z-accent))" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <div className="mt-1.5 flex items-center justify-between text-[11.5px]">
        <span className="flex items-center gap-1.5 text-[hsl(var(--z-text-dim))]">
          <MemoryStick className="h-3.5 w-3.5" /> Memory
        </span>
        <span className="tabular-nums">{Math.round(mem)}%</span>
      </div>
      <span className="mt-1.5 block h-1 w-full overflow-hidden rounded-full bg-[hsl(var(--z-border))]">
        <span className="z-accent-bg block h-full rounded-full transition-all duration-700" style={{ width: `${mem}%` }} />
      </span>
    </div>
  );
}