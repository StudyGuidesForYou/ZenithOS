import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Check, X } from 'lucide-react';
import { GRAD, fmtTime } from '@/lib/zenith/chatData';
import MessageToolbar from './MessageToolbar';

/* A single message row: hover toolbar, right-click context menu, avatar
   (first of a group), author + numeric ID + timestamp, optional reply
   reference, markdown body, inline editor, and clickable reactions. */
export default function MessageRow({
  msg,
  isPinned,
  isSaved,
  showHeader,
  editing,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  actions,
}) {
  const [draft, setDraft] = useState(msg.content);
  const editRef = useRef(null);

  useEffect(() => {
    if (editing) {
      setDraft(msg.content);
      editRef.current?.focus();
    }
  }, [editing, msg.content]);

  return (
    <div
      className="group relative flex gap-3 rounded-lg px-2 py-0.5 hover:bg-white/[0.03]"
      onContextMenu={(e) => {
        e.preventDefault();
        actions.openContext?.(msg, e.clientX, e.clientY);
      }}
    >
      <MessageToolbar
        msg={msg}
        isPinned={isPinned}
        isSaved={isSaved}
        onReact={(e) => actions.toggleReaction(msg.id, e)}
        onReply={() => actions.reply(msg)}
        onSave={() => actions.save(msg)}
        onPin={() => actions.pin(msg.id)}
        onCopy={() => actions.copy(msg.content)}
        onDelete={() => actions.deleteMessage(msg.id)}
        onEdit={onEdit}
      />

      <div className="w-10 shrink-0 pt-1">
        {showHeader && (
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${GRAD[msg.color]} text-[15px] font-semibold capitalize text-white`}
          >
            {msg.author[0]}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        {showHeader && (
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold text-white">{msg.author}</span>
            <span className="font-mono text-[11px] text-white/30">#{msg.authorId}</span>
            <span className="text-[11px] text-white/40">Today at {fmtTime(msg.minutesAgo)}</span>
          </div>
        )}

        {msg.replyTo && (
          <div className="mb-0.5 flex items-center gap-1.5 border-l-2 border-white/20 pl-2 text-[12px] text-white/45">
            <span className="capitalize text-white/60">{msg.replyTo.author}</span>
            <span className="truncate">{msg.replyTo.content.replace(/[#*`>_~]/g, '')}</span>
          </div>
        )}

        {editing ? (
          <div className="mt-0.5 flex items-start gap-2">
            <textarea
              ref={editRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSaveEdit(draft);
                } else if (e.key === 'Escape') {
                  e.preventDefault();
                  onCancelEdit();
                }
              }}
              rows={Math.min(6, Math.max(1, draft.split('\n').length))}
              className="z-glass-soft w-full rounded-xl px-3 py-2 text-[15px] text-white/90 outline-none"
            />
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => onSaveEdit(draft)}
                className="z-pressable rounded-lg bg-emerald-500/80 p-1.5 text-white hover:bg-emerald-500"
                title="Save"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                className="z-hoverable rounded-lg bg-white/10 p-1.5 text-white/70 hover:bg-white/20"
                title="Cancel"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="z-md text-[15px] leading-relaxed text-white/85">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
            {msg.edited && <span className="ml-1 text-[10px] text-white/30">(edited)</span>}
          </div>
        )}

        {msg.reactions.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {msg.reactions.map((r) => (
              <button
                key={r.e}
                type="button"
                onClick={() => actions.toggleReaction(msg.id, r.e)}
                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[13px] ${
                  r.me
                    ? 'border-[hsl(var(--z-accent)/0.5)] bg-[hsl(var(--z-accent)/0.18)]'
                    : 'border-[hsl(var(--z-border))] bg-white/[0.06]'
                }`}
              >
                <span>{r.e}</span>
                <span className="text-white/55">{r.n}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}