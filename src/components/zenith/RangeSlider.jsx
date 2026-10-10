import React from 'react';

/* macOS-style slider: a thin track that fills with the accent colour and a
   white thumb. Works for 0…1 values as well as ranges like UI scale. */
export default function RangeSlider({
  icon: Icon,
  value,
  onChange,
  onIconClick,
  label,
  min = 0,
  max = 1,
  step = 0.02,
  format,
}) {
  const pct = max === min ? 0 : Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="flex items-center gap-3">
      {Icon && (
        <button
          type="button"
          onClick={onIconClick}
          disabled={!onIconClick}
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))] ${
            onIconClick ? 'z-hoverable z-pressable' : ''
          }`}
        >
          <Icon className="h-4 w-4" />
        </button>
      )}
      <div className="min-w-0 flex-1">
        {(label || format) && (
          <div className="mb-1.5 flex items-center justify-between gap-2">
            {label && <p className="truncate text-[11.5px] text-[hsl(var(--z-text-dim))]">{label}</p>}
            <span className="shrink-0 text-[11px] tabular-nums text-[hsl(var(--z-text-dim))]">
              {format ? format(value) : `${Math.round(value * 100)}%`}
            </span>
          </div>
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="z-slider w-full"
          style={{
            backgroundImage: 'linear-gradient(hsl(var(--z-accent)), hsl(var(--z-accent)))',
            backgroundSize: `${pct}% 100%`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
    </div>
  );
}