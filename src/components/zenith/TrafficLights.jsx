import React from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';

const DOTS = [
  { id: 'close', color: '#ff5f57', Icon: X, title: 'Close' },
  { id: 'min', color: '#febc2e', Icon: Minus, title: 'Minimize' },
  { id: 'zoom', color: '#28c840', Icon: Maximize2, title: 'Zoom' },
];

export default function TrafficLights({ focused, zoomed, onClose, onMinimize, onZoom }) {
  const run = { close: onClose, min: onMinimize, zoom: onZoom };
  return (
    <span className="group/tl flex items-center gap-2" data-nodrag>
      {DOTS.map((dot) => (
        <button
          key={dot.id}
          type="button"
          title={dot.title}
          onClick={(e) => {
            e.stopPropagation();
            run[dot.id]?.();
          }}
          className="z-pressable flex h-[13px] w-[13px] items-center justify-center rounded-full"
          style={{
            background: focused ? dot.color : 'hsl(var(--z-border-strong))',
            boxShadow: 'inset 0 0 0 0.5px rgb(0 0 0 / 0.14)',
          }}
        >
          <dot.Icon
            className="h-[7px] w-[7px] text-black/55 opacity-0 transition-opacity group-hover/tl:opacity-100"
            strokeWidth={3.4}
            style={dot.id === 'zoom' && zoomed ? { transform: 'rotate(45deg)' } : undefined}
          />
        </button>
      ))}
    </span>
  );
}