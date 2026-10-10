import React, { useEffect, useRef, useState } from 'react';
import { Hash, Search } from 'lucide-react';
import { allTextChannels } from '@/lib/zenith/chatData';

/* ⌘/Ctrl+K quick switcher — fuzzy jump to any text channel. Discord has a
   quick switcher; this one is a sleek glass overlay. */
export default function QuickSwitcher({ server, channelId, onSelect, onClose }) {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  const channels = allTextChannels(server);
  const filtered = channels.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="absolute inset-0 z-40 flex items-start justify-center bg-black/40 pt-20"
      onClick={onClose}
    >
      <div
        className="z-glass-strong w-[420px] max-w-[90%] overflow-hidden rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 border-b border-[hsl(var(--z-border))] px-3 py-2.5">
          <Search className="h-4 w-4 text-white/40" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jump to channel…"
            className="flex-1 bg-transparent text-[14px] text-white outline-none placeholder:text-white/35"
          />
          <span className="font-mono text-[10px] text-white/30">⌘K</span>
        </div>
        <div className="z-scroll max-h-72 overflow-y-auto p-1.5">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[14px] ${
                c.id === channelId
                  ? 'bg-[hsl(var(--z-accent)/0.22)] text-white'
                  : 'text-white/70 hover:bg-white/[0.06]'
              }`}
            >
              <Hash className="h-4 w-4 text-white/40" />
              <span className="truncate">{c.name}</span>
              {c.id === channelId && <span className="ml-auto text-[11px] text-white/40">current</span>}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="py-6 text-center text-[13px] text-white/40">No channels found.</p>
          )}
        </div>
      </div>
    </div>
  );
}