import React, { useEffect, useRef, useState } from 'react';
import { Bookmark, Eye, EyeOff, Gift, Hash, Pin, Search, Smile, Users, Volume2, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { EMOJIS } from '@/lib/zenith/chatData';
import MemberList from './MemberList';
import MessageRow from './MessageRow';

/* Center column: header (search + pinned/saved/members toggles), grouped
   message list with inline edit + right-click context menu, and a composer
   with reply preview, live markdown preview, slash commands, and an emoji
   palette. */
export default function ChatView({
  server: _server,
  channel,
  messages,
  user,
  draft,
  onDraftChange,
  onSend,
  showMembers,
  onToggleMembers,
  onOpenDrawer,
  replyTo,
  setReplyTo,
  pinnedIds,
  savedIds,
  actions,
  editingId,
  setEditingId,
}) {
  const [text, setText] = useState(draft);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [preview, setPreview] = useState(false);
  const [query, setQuery] = useState('');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setText(draft);
  }, [draft, channel?.id]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, channel?.id]);

  useEffect(() => {
    if (replyTo) inputRef.current?.focus();
  }, [replyTo]);

  if (!channel) {
    return <div className="flex flex-1 items-center justify-center text-white/40">Select a channel</div>;
  }

  const isVoice = channel.type === 'voice';
  const pinnedCount = pinnedIds.size;

  const q = query.trim().toLowerCase();
  const filtered = q ? messages.filter((m) => m.content.toLowerCase().includes(q)) : messages;

  const groups = [];
  filtered.forEach((msg) => {
    const last = groups[groups.length - 1];
    if (last && last.author === msg.author && !msg.replyTo) last.items.push(msg);
    else groups.push({ author: msg.author, items: [msg] });
  });

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText('');
    onDraftChange('');
    setEmojiOpen(false);
  };

  const onChange = (v) => {
    setText(v);
    onDraftChange(v);
  };

  return (
    <div className="flex min-w-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="z-glass-soft flex items-center gap-3 border-b border-[hsl(var(--z-border))] px-4 py-2.5">
          {isVoice ? (
            <Volume2 className="h-5 w-5 text-white/50" />
          ) : (
            <Hash className="h-5 w-5 text-white/50" />
          )}
          <span className="text-[15px] font-semibold text-white">{channel.name}</span>
          {channel.topic && (
            <>
              <span className="h-4 w-px bg-[hsl(var(--z-border))]" />
              <span className="truncate text-[13px] text-white/45">{channel.topic}</span>
            </>
          )}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => onOpenDrawer('pinned')}
              className="z-hoverable relative rounded-md p-1.5 text-white/55 hover:text-white"
              title="Pinned"
            >
              <Pin className="h-4 w-4" />
              {pinnedCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white">
                  {pinnedCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => onOpenDrawer('saved')}
              className="z-hoverable rounded-md p-1.5 text-white/55 hover:text-white"
              title="Saved"
            >
              <Bookmark className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onToggleMembers}
              className={`z-hoverable rounded-md p-1.5 ${
                showMembers ? 'text-white' : 'text-white/55 hover:text-white'
              }`}
              title="Members"
            >
              <Users className="h-4 w-4" />
            </button>
            <div className="relative ml-1">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="z-input h-8 w-40 rounded-lg py-0 pl-7 pr-2 text-[13px]"
              />
            </div>
          </div>
        </header>

        {isVoice ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-white/50">
            <Volume2 className="h-12 w-12" />
            <p className="text-[15px] font-medium text-white/80">{channel.name}</p>
            <p className="text-[13px]">Voice channels aren’t wired up yet — backend coming soon.</p>
          </div>
        ) : (
          <>
            <div ref={scrollRef} className="z-scroll min-h-0 flex-1 overflow-y-auto px-4 py-4">
              <div className="mb-5 rounded-2xl border border-[hsl(var(--z-border))] bg-white/[0.03] p-3 text-[13px] text-white/55">
                <p className="font-semibold text-white/80">Welcome to #{channel.name}!</p>
                <p>
                  This is the beginning of the #{channel.name} channel. {channel.topic}
                </p>
                <p className="mt-2 text-[12px] text-white/35">
                  Tip: try slash commands —{' '}
                  <span className="z-mono text-white/55">/me /shrug /tableflip /lenny</span> — or right-click a
                  message for more actions.
                </p>
              </div>

              {q && (
                <div className="mb-3 text-[12px] text-white/45">
                  {filtered.length} result{filtered.length === 1 ? '' : 's'} for “{query}”
                </div>
              )}

              {groups.map((g, gi) => (
                <div key={gi} className="mb-1">
                  {g.items.map((msg, ii) => (
                    <MessageRow
                      key={msg.id}
                      msg={msg}
                      showHeader={ii === 0}
                      isPinned={pinnedIds.has(msg.id)}
                      isSaved={savedIds.has(msg.id)}
                      editing={editingId === msg.id}
                      onEdit={() => setEditingId(msg.id)}
                      onSaveEdit={(t) => {
                        actions.edit(msg.id, t);
                        setEditingId(null);
                      }}
                      onCancelEdit={() => setEditingId(null)}
                      actions={actions}
                    />
                  ))}
                </div>
              ))}

              {q && filtered.length === 0 && (
                <p className="py-10 text-center text-[13px] text-white/40">No messages match your search.</p>
              )}
            </div>

            <div className="px-4 pb-4">
              {replyTo && (
                <div className="z-glass-soft mb-2 flex items-center gap-2 rounded-xl px-3 py-2 text-[12px] text-white/60">
                  <span className="text-white/40">Replying to</span>
                  <span className="font-medium capitalize text-white">@{replyTo.author}</span>
                  <span className="truncate text-white/45">
                    {replyTo.content.replace(/[#*`>_~]/g, '')}
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="ml-auto rounded-md p-1 text-white/50 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {preview && text.trim() && (
                <div className="z-glass-soft mb-2 rounded-xl p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-white/35">
                    Markdown preview
                  </p>
                  <div className="z-md text-[15px] text-white/85">
                    <ReactMarkdown>{text}</ReactMarkdown>
                  </div>
                </div>
              )}

              {emojiOpen && (
                <div className="z-glass-strong mb-2 grid grid-cols-8 gap-1 rounded-2xl p-2">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => onChange(text + e)}
                      className="z-hoverable rounded-lg p-1.5 text-[20px] hover:bg-white/10"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}

              <form onSubmit={submit} className="z-glass-soft flex items-center gap-2 rounded-2xl px-3 py-2">
                <button
                  type="button"
                  onClick={() => onChange(text + EMOJIS[Math.floor(Math.random() * EMOJIS.length)])}
                  className="z-hoverable rounded-full p-1 text-white/55 hover:text-white"
                  title="Insert an emoji"
                >
                  <Gift className="h-5 w-5" />
                </button>
                <input
                  ref={inputRef}
                  value={text}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={`Message #${channel.name}`}
                  className="flex-1 bg-transparent text-[15px] text-white/90 outline-none placeholder:text-white/35"
                />
                <button
                  type="button"
                  onClick={() => setPreview((v) => !v)}
                  className={`z-hoverable rounded-full p-1 ${
                    preview ? 'text-[hsl(var(--z-accent))]' : 'text-white/55 hover:text-white'
                  }`}
                  title="Markdown preview"
                >
                  {preview ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setEmojiOpen((v) => !v)}
                  className={`z-hoverable rounded-full p-1 ${
                    emojiOpen ? 'text-[hsl(var(--z-accent))]' : 'text-white/55 hover:text-white'
                  }`}
                  title="Emoji"
                >
                  <Smile className="h-5 w-5" />
                </button>
                {text.trim() && (
                  <button
                    type="submit"
                    className="z-pressable rounded-full bg-[hsl(var(--z-accent))] px-3 py-1 text-[13px] font-medium text-white"
                  >
                    Send
                  </button>
                )}
              </form>
            </div>
          </>
        )}
      </div>

      {showMembers && <MemberList user={user} />}
    </div>
  );
}