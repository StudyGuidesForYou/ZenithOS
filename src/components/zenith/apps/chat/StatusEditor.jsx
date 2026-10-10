import React, { useEffect, useRef, useState } from 'react';
import { STATUS_EMOJIS } from '@/lib/zenith/chatData';

/* Custom status popover — pick an emoji + a short line. Discord has custom
   status; this one is sleeker and lives right above the user panel. */
export default function StatusEditor({ status, onChange, onClose }) {
  const [emoji, setEmoji] = useState(status.emoji || '');
  const [text, setText] = useState(status.text || '');
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [onClose]);

  const commit = () => {
    onChange({ emoji, text: text.slice(0, 80) });
    onClose();
  };

  return (
    <div
      ref={ref}
      className="z-glass-strong absolute bottom-[54px] left-2 z-40 w-64 rounded-2xl p-3"
    >
      <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-white/45">
        Set custom status
      </p>
      <div className="mb-2 flex flex-wrap gap-1">
        {STATUS_EMOJIS.map((e) => (
          <button
            key={e || 'none'}
            type="button"
            onClick={() => setEmoji(e)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-[16px] ${
              emoji === e
                ? 'bg-[hsl(var(--z-accent)/0.3)] ring-1 ring-[hsl(var(--z-accent)/0.6)]'
                : 'hover:bg-white/10'
            }`}
          >
            {e || '∅'}
          </button>
        ))}
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What are you up to?"
        maxLength={80}
        className="z-input mb-2 w-full rounded-lg px-2.5 py-2 text-[13px]"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            onChange({ emoji: '', text: '' });
            onClose();
          }}
          className="z-hoverable flex-1 rounded-lg px-3 py-1.5 text-[13px] text-white/60 hover:bg-white/10"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={commit}
          className="z-pressable flex-1 rounded-lg bg-[hsl(var(--z-accent))] px-3 py-1.5 text-[13px] font-medium text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}