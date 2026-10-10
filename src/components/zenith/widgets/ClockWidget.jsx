import React, { useEffect, useState } from 'react';

export default function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[hsl(var(--z-text-dim))]">
          {now.toLocaleDateString([], { weekday: 'long' })}
        </p>
        <p
          className="mt-1 text-[20px] font-medium leading-tight"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {now.toLocaleDateString([], { month: 'long', day: 'numeric' })}
        </p>
      </div>
      <p className="text-[38px] font-semibold leading-none tabular-nums" style={{ fontFamily: 'var(--font-heading)' }}>
        {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        <span className="ml-1 align-super text-[13px] font-medium text-[hsl(var(--z-text-dim))]">
          {now.toLocaleTimeString([], { second: '2-digit' }).slice(-2)}
        </span>
      </p>
    </div>
  );
}