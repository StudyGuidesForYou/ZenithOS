import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CalendarWidget() {
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });

  const startWeekday = new Date(cursor.y, cursor.m, 1).getDay();
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const cells = Array.from({ length: startWeekday + daysInMonth }, (_, i) => i - startWeekday + 1);

  const shift = (delta) =>
    setCursor((c) => {
      const next = new Date(c.y, c.m + delta, 1);
      return { y: next.getFullYear(), m: next.getMonth() };
    });

  const isToday = (day) =>
    day > 0 &&
    day === today.getDate() &&
    cursor.m === today.getMonth() &&
    cursor.y === today.getFullYear();

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[12.5px] font-medium">
          {new Date(cursor.y, cursor.m, 1).toLocaleDateString([], { month: 'long', year: 'numeric' })}
        </p>
        <span className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => shift(-1)}
            className="z-hoverable flex h-6 w-6 items-center justify-center rounded-lg"
            title="Previous month"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            className="z-hoverable flex h-6 w-6 items-center justify-center rounded-lg"
            title="Next month"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </span>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="text-[9.5px] font-semibold uppercase tracking-wide text-[hsl(var(--z-text-dim))]">
            {d}
          </span>
        ))}
        {cells.map((day, i) => (
          <span
            key={i}
            className={`mx-auto flex h-6 w-6 items-center justify-center rounded-full text-[11.5px] ${
              isToday(day) ? 'z-accent-bg font-semibold' : day > 0 ? '' : 'opacity-0'
            }`}
          >
            {day > 0 ? day : ''}
          </span>
        ))}
      </div>
    </div>
  );
}