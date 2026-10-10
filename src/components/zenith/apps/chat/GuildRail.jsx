import React from 'react';
import { Bookmark, Plus, Settings } from 'lucide-react';
import { SERVERS, GRAD } from '@/lib/zenith/chatData';

/* Server rail. Top button is a personal "Saved Messages" hub; the gear opens
   the real ZenithOS Settings app. */
export default function GuildRail({ onOpenSaved, onOpenSettings, onAddServer }) {
  return (
    <div className="z-glass-soft flex w-[70px] shrink-0 flex-col items-center gap-2 py-3">
      <button
        type="button"
        onClick={onOpenSaved}
        title="Saved Messages"
        className="z-pressable flex h-11 w-11 items-center justify-center rounded-[1.3rem] bg-white/[0.06] text-emerald-300 transition-all hover:rounded-2xl hover:bg-emerald-400/15"
      >
        <Bookmark className="h-5 w-5" />
      </button>

      <div className="h-px w-8 bg-[hsl(var(--z-border))]" />

      <div className="z-scroll flex flex-1 flex-col items-center gap-2 overflow-y-auto">
        {SERVERS.map((s) => (
          <div key={s.id} className="relative flex items-center">
            <span className="absolute -left-3 h-7 w-1.5 rounded-full bg-[hsl(var(--z-accent))]" />
            <button
              type="button"
              title={s.name}
              className={`z-pressable flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${GRAD[s.color]} text-[15px] font-semibold text-white shadow-md ring-2 ring-white/30`}
            >
              {s.abbr}
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={onAddServer}
          title="Add a server"
          className="z-pressable flex h-11 w-11 items-center justify-center rounded-[1.3rem] bg-white/[0.06] text-emerald-300 transition-all hover:rounded-2xl hover:bg-emerald-400/15"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenSettings}
        title="Settings"
        className="z-pressable flex h-11 w-11 items-center justify-center rounded-[1.3rem] bg-white/[0.06] text-white/70 transition-all hover:rounded-2xl hover:bg-white/[0.12]"
      >
        <Settings className="h-5 w-5" />
      </button>
    </div>
  );
}