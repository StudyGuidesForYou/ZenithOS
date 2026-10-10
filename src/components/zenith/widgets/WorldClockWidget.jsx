import React, { useEffect, useState } from 'react';

const ZONES = [
  { label: 'Local', tz: undefined },
  { label: 'NYC', tz: 'America/New_York' },
  { label: 'London', tz: 'Europe/London' },
  { label: 'Tokyo', tz: 'Asia/Tokyo' },
];

export default function WorldClockWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-1.5">
      {ZONES.map((z) => (
        <div key={z.label} className="flex items-center justify-between text-[11.5px]">
          <span className="text-[hsl(var(--z-text-dim))]">{z.label}</span>
          <span className="tabular-nums">
            {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: z.tz })}
          </span>
        </div>
      ))}
    </div>
  );
}