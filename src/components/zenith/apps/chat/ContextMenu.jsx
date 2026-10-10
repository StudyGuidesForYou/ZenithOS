import React, { useEffect, useRef, useState } from 'react';
import { Bookmark, Copy, Edit3, Pin, Reply, Smile, Trash2, X } from 'lucide-react';
import { EMOJIS } from '@/lib/zenith/chatData';

/* Vencord-style right-click context menu for a message. Mirrors the hover
   toolbar but appears at the cursor with an emoji sub-palette. */
export default function ContextMenu({
  msg,
  x,
  y,
  isPinned,
  isSaved,
  onClose,
  onReact,
  onReply,
  onSave,
  onPin,
  onCopy,
  onEdit,
  onDelete,
}) {
  const ref = useRef(null);
  const [reactOpen, setReactOpen] = useState(false);

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // keep the menu on screen
  const style = {
    left: Math.min(x, window.innerWidth - 220),
    top: Math.min(y, window.innerHeight - 320),
  };

  const item = (label, icon, fn, danger) => (
    <button
      type="button"
      onClick={() => {
        fn();
        onClose();
      }}
      className={`z-hoverable flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[13px] ${
        danger ? 'text-rose-300 hover:bg-rose-500/15' : 'text-white/80 hover:bg-white/10'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div
      ref={ref}
      className="z-glass-strong fixed z-[80] w-52 rounded-2xl p-1.5"
      style={style}
      onContextMenu={(e) => e.preventDefault()}
    >
      {reactOpen ? (
        <div className="grid grid-cols-6 gap-0.5 rounded-xl bg-white/[0.04] p-1">
          {EMOJIS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => {
                onReact(e);
                onClose();
              }}
              className="z-hoverable rounded-lg p-1 text-[18px] hover:bg-white/10"
            >
              {e}
            </button>
          ))}
        </div>
      ) : (
        <>
          {item('Reply', <Reply className="h-4 w-4" />, onReply)}
          {item('React', <Smile className="h-4 w-4" />, () => setReactOpen(true))}
          {item(isSaved ? 'Unsave' : 'Save', <Bookmark className="h-4 w-4" />, onSave)}
          {item(isPinned ? 'Unpin' : 'Pin', <Pin className="h-4 w-4" />, onPin)}
          {item('Copy text', <Copy className="h-4 w-4" />, onCopy)}
          {msg.mine && item('Edit', <Edit3 className="h-4 w-4" />, onEdit)}
          {msg.mine && item('Delete', <Trash2 className="h-4 w-4" />, onDelete, true)}
        </>
      )}
      <button
        type="button"
        onClick={onClose}
        className="z-hoverable mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left text-[12px] text-white/40 hover:bg-white/10"
      >
        <X className="h-3.5 w-3.5" /> Close
      </button>
    </div>
  );
}