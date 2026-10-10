import React, { useState } from 'react';
import { Bookmark, Copy, Edit3, Pin, Reply, Smile, Trash2 } from 'lucide-react';
import { EMOJIS } from '@/lib/zenith/chatData';

/* Floating per-message action toolbar (appears on hover): react, reply, edit
   (own messages), save, pin, copy, delete. */
export default function MessageToolbar({
  msg,
  isPinned,
  isSaved,
  onReact,
  onReply,
  onSave,
  onPin,
  onCopy,
  onDelete,
  onEdit,
}) {
  const [reactOpen, setReactOpen] = useState(false);

  return (
    <div className="absolute right-2 top-0 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
      {reactOpen && (
        <div className="z-glass-strong absolute right-0 top-8 flex gap-0.5 rounded-xl p-1">
          {EMOJIS.slice(0, 8).map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                onReact(e);
                setReactOpen(false);
              }}
              className="z-hoverable rounded-lg p-1 text-[18px] hover:bg-white/10"
            >
              {e}
            </button>
          ))}
        </div>
      )}

      <button
        type="button"
        title="React"
        onClick={() => setReactOpen((v) => !v)}
        className="z-hoverable rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
      >
        <Smile className="h-4 w-4" />
      </button>
      <button
        type="button"
        title="Reply"
        onClick={onReply}
        className="z-hoverable rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
      >
        <Reply className="h-4 w-4" />
      </button>
      {msg.mine && (
        <button
          type="button"
          title="Edit"
          onClick={onEdit}
          className="z-hoverable rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
        >
          <Edit3 className="h-4 w-4" />
        </button>
      )}
      <button
        type="button"
        title={isSaved ? 'Unsave' : 'Save to Saved'}
        onClick={onSave}
        className={`z-hoverable rounded-md p-1.5 ${
          isSaved ? 'text-emerald-400' : 'text-white/60 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Bookmark className="h-4 w-4" fill={isSaved ? 'currentColor' : 'none'} />
      </button>
      <button
        type="button"
        title={isPinned ? 'Unpin' : 'Pin'}
        onClick={onPin}
        className={`z-hoverable rounded-md p-1.5 ${
          isPinned ? 'text-amber-400' : 'text-white/60 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Pin className="h-4 w-4" fill={isPinned ? 'currentColor' : 'none'} />
      </button>
      <button
        type="button"
        title="Copy"
        onClick={onCopy}
        className="z-hoverable rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
      >
        <Copy className="h-4 w-4" />
      </button>
      {msg.mine && (
        <button
          type="button"
          title="Delete"
          onClick={onDelete}
          className="z-hoverable rounded-md p-1.5 text-white/60 hover:bg-rose-500/20 hover:text-rose-300"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}