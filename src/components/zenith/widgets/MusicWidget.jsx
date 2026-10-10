import React, { useEffect, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';

/* A tiny "now playing" widget with an animated equalizer. No audio plays —
   the bars dance on a timer so the desktop has a bit of motion. */
const BARS = 14;

export default function MusicWidget() {
  const [playing, setPlaying] = useState(true);
  const [track] = useState({ title: 'Liquid Glass', artist: 'Aurora' });

  return (
    <div>
      <div className="flex items-end gap-3">
        <span className="z-accent-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[15px] font-bold">
          ♪
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-medium">{track.title}</p>
          <p className="truncate text-[11px] text-[hsl(var(--z-text-dim))]">{track.artist}</p>
        </div>
      </div>

      <div className="mt-3 flex h-7 items-end gap-[3px]">
        {Array.from({ length: BARS }).map((_, i) => (
          <span
            key={i}
            className="z-eq z-accent-bg w-[5px] flex-1 rounded-full"
            style={{
              height: '100%',
              animationDelay: `${(i % 7) * 0.12}s`,
              animationDuration: `${0.7 + (i % 5) * 0.12}s`,
              animationPlayState: playing ? 'running' : 'paused',
              opacity: 0.55 + (i % 4) * 0.12,
            }}
          />
        ))}
      </div>

      <div className="mt-2.5 flex items-center justify-center gap-3">
        <button type="button" className="z-hoverable flex h-7 w-7 items-center justify-center rounded-full" title="Previous">
          <SkipBack className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="z-accent-bg z-pressable flex h-8 w-8 items-center justify-center rounded-full"
          title={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <button type="button" className="z-hoverable flex h-7 w-7 items-center justify-center rounded-full" title="Next">
          <SkipForward className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}