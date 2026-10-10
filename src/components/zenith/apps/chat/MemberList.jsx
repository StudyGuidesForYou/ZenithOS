import React from 'react';
import { statusColor, GRAD } from '@/lib/zenith/chatData';

/* Member list — frontend preview shows just the local user (no dummy
   people). Their unique numeric ID is shown under the name. */
export default function MemberList({ user }) {
  return (
    <div className="z-glass-soft hidden w-56 shrink-0 flex-col lg:flex">
      <div className="border-b border-[hsl(var(--z-border))] px-4 py-3 text-[12px] font-semibold uppercase tracking-wide text-white/40">
        Members — 1
      </div>
      <div className="z-scroll min-h-0 flex-1 overflow-y-auto px-2 py-2">
        <div className="mb-3">
          <p className="px-1.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/35">
            Online — 1
          </p>
          <div className="z-hoverable flex items-center gap-2.5 rounded-lg px-1.5 py-1.5">
            <div className="relative">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${GRAD[user.color]} text-[12px] font-semibold capitalize text-white`}
              >
                {user.name[0]}
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[hsl(var(--z-surface-solid))]"
                style={{ background: statusColor.online }}
              />
            </div>
            <div className="leading-tight">
              <span className="text-[14px] text-violet-300">{user.name}</span>
              <p className="font-mono text-[10px] text-white/35">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}