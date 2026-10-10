import React from 'react';
import { Bookmark, Pin, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GRAD } from '@/lib/zenith/chatData';

/* Right-hand drawer for Pinned (shared, per channel) or Saved (personal
   bookmarks, gathered from any channel). Saved entries can jump back to
   their origin channel. */
export default function InfoDrawer({
  mode,
  pinnedMessages,
  savedMessages,
  onClose,
  onUnpin,
  onUnsave,
  onJump,
}) {
  const isPinned = mode === 'pinned';
  const messages = isPinned ? pinnedMessages : savedMessages;

  return (
    <div className="z-glass-soft absolute right-0 top-0 z-30 flex h-full w-72 flex-col border-l border-[hsl(var(--z-border))]">
      <header className="flex items-center justify-between border-b border-[hsl(var(--z-border))] px-4 py-3">
        <div className="flex items-center gap-2">
          {isPinned ? (
            <Pin className="h-4 w-4 text-amber-400" />
          ) : (
            <Bookmark className="h-4 w-4 text-emerald-400" />
          )}
          <span className="text-[15px] font-semibold text-white">
            {isPinned ? 'Pinned Messages' : 'Saved Messages'}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="z-hoverable rounded-md p-1 text-white/55 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </header>

      <div className="z-scroll min-h-0 flex-1 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <p className="mt-8 text-center text-[13px] text-white/40">
            {isPinned ? 'No pinned messages yet.' : 'No saved messages yet.'}
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="z-glass-soft mb-2 rounded-xl p-3">
              <div className="mb-1 flex items-center gap-2">
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br ${GRAD[m.color]} text-[11px] font-semibold capitalize text-white`}
                >
                  {m.author[0]}
                </div>
                <span className="text-[13px] font-medium text-white">{m.author}</span>
                {!isPinned && m._channelId && (
                  <span className="text-[11px] text-white/35">#{m._channelId}</span>
                )}
              </div>
              <div className="z-md text-[13px] text-white/80">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
              <div className="mt-2 flex gap-2">
                {!isPinned && (
                  <button
                    type="button"
                    onClick={() => onJump(m._serverId, m._channelId)}
                    className="z-hoverable rounded-md px-2 py-0.5 text-[11px] text-[hsl(var(--z-accent))] hover:bg-white/10"
                  >
                    Jump
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => (isPinned ? onUnpin(m.id) : onUnsave(m.id))}
                  className="z-hoverable rounded-md px-2 py-0.5 text-[11px] text-rose-300 hover:bg-rose-500/15"
                >
                  {isPinned ? 'Unpin' : 'Unsave'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}