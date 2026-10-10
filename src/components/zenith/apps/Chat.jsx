import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { SERVERS, firstTextChannel, findChannel } from '@/lib/zenith/chatData';
import { useOS } from '@/lib/zenith/osContext';
import GuildRail from './chat/GuildRail';
import ChannelList from './chat/ChannelList';
import ChatView from './chat/ChatView';
import InfoDrawer from './chat/InfoDrawer';
import QuickSwitcher from './chat/QuickSwitcher';
import ContextMenu from './chat/ContextMenu';

const LS = {
  threads: 'zenith.chat.threads',
  pinned: 'zenith.chat.pinned',
  saved: 'zenith.chat.saved',
  drafts: 'zenith.chat.drafts',
  status: 'zenith.chat.status',
};

const load = (k, fallback) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

/* Slash commands (Discord/Vencord-style). Returns the rendered content, or
   null if the input should be treated as a normal message. */
const runSlash = (raw) => {
  const [cmd, ...rest] = raw.trim().split(/\s+/);
  const arg = rest.join(' ');
  switch (cmd.toLowerCase()) {
    case '/me':
      return arg ? `*${arg}*` : null;
    case '/shrug':
      return `${arg} \`¯\\_(ツ)_/¯\``;
    case '/tableflip':
      return `${arg} \`(╯°□°)╯︵ ┻━┻\``;
    case '/table':
      return `${arg} \`┬─┬ ノ( ゜-゜ノ)\``;
    case '/echo':
      return arg || null;
    case '/lenny':
      return `${arg} \`( ͡° ͜ʖ ͡°)\``;
    default:
      return null;
  }
};

/* Chat app — frontend only. The user identity comes from the real OS profile
   (the username you picked at onboarding + your unique numeric ID), so it
   matches the rest of ZenithOS. */
export default function Chat() {
  const { profile, openApp, notify } = useOS();
  const user = useMemo(
    () => ({
      name: profile?.username || 'Zenith User',
      id: profile?.handle || '0000000000',
      color: 'violet',
      status: 'online',
    }),
    [profile]
  );

  const [serverId, setServerId] = useState(SERVERS[0].id);
  const [channelId, setChannelId] = useState(firstTextChannel(SERVERS[0]));
  const [threads, setThreads] = useState(() => load(LS.threads, {}));
  const [pinned, setPinned] = useState(() => load(LS.pinned, {}));
  const [saved, setSaved] = useState(() => load(LS.saved, []));
  const [drafts, setDrafts] = useState(() => load(LS.drafts, {}));
  const [status, setStatus] = useState(() => load(LS.status, { emoji: '', text: '' }));
  const [showMembers, setShowMembers] = useState(true);
  const [drawer, setDrawer] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [quickOpen, setQuickOpen] = useState(false);
  const [ctxMenu, setCtxMenu] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const server = useMemo(() => SERVERS.find((s) => s.id === serverId), [serverId]);
  const channel = useMemo(() => findChannel(server, channelId), [server, channelId]);
  const key = `${serverId}:${channelId}`;
  const messages = threads[key] || [];
  const pinnedIds = new Set(pinned[key] || []);
  const savedIds = new Set(saved.map((m) => m.id));

  useEffect(() => save(LS.threads, threads), [threads]);
  useEffect(() => save(LS.pinned, pinned), [pinned]);
  useEffect(() => save(LS.saved, saved), [saved]);
  useEffect(() => save(LS.drafts, drafts), [drafts]);
  useEffect(() => save(LS.status, status), [status]);

  useEffect(() => setReplyTo(null), [channelId]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const send = (text) => {
    if (!text.trim()) return;
    const rendered = runSlash(text) ?? text;
    const msg = {
      id: `u${Date.now()}`,
      author: user.name,
      authorId: user.id,
      color: user.color,
      minutesAgo: 0,
      content: rendered,
      reactions: [],
      replyTo: replyTo ? { author: replyTo.author, content: replyTo.content } : null,
      mine: true,
    };
    setThreads((t) => ({ ...t, [key]: [...(t[key] || []), msg] }));
    setReplyTo(null);
    setDrafts((d) => ({ ...d, [channelId]: '' }));
  };

  const editMessage = useCallback(
    (msgId, newContent) => {
      const clean = newContent.trim();
      setThreads((t) => {
        const list = t[key] || [];
        if (!clean) return { ...t, [key]: list.filter((m) => m.id !== msgId) };
        return { ...t, [key]: list.map((m) => (m.id === msgId ? { ...m, content: clean, edited: true } : m)) };
      });
    },
    [key]
  );

  const setDraft = (text) => setDrafts((d) => ({ ...d, [channelId]: text }));

  const toggleReaction = useCallback(
    (msgId, emoji) => {
      setThreads((t) => {
        const list = t[key] || [];
        const next = list.map((m) => {
          if (m.id !== msgId) return m;
          const existing = m.reactions.find((r) => r.e === emoji);
          let reactions;
          if (!existing) reactions = [...m.reactions, { e: emoji, n: 1, me: true }];
          else if (existing.me)
            reactions = m.reactions
              .map((r) => (r.e === emoji ? { ...r, n: r.n - 1, me: false } : r))
              .filter((r) => r.n > 0);
          else reactions = m.reactions.map((r) => (r.e === emoji ? { ...r, n: r.n + 1, me: true } : r));
          return { ...m, reactions };
        });
        return { ...t, [key]: next };
      });
    },
    [key]
  );

  const deleteMessage = useCallback(
    (msgId) => setThreads((t) => ({ ...t, [key]: (t[key] || []).filter((m) => m.id !== msgId) })),
    [key]
  );

  const pinMessage = useCallback(
    (msgId) =>
      setPinned((p) => {
        const list = p[key] || [];
        return { ...p, [key]: list.includes(msgId) ? list.filter((x) => x !== msgId) : [...list, msgId] };
      }),
    [key]
  );

  const saveMessage = useCallback(
    (msg) => setSaved((s) => (s.some((m) => m.id === msg.id) ? s : [...s, msg])),
    []
  );
  const unsaveMessage = useCallback((msgId) => setSaved((s) => s.filter((m) => m.id !== msgId)), []);
  const copyMessage = useCallback((content) => navigator.clipboard?.writeText(content), []);

  const openContext = useCallback((msg, x, y) => setCtxMenu({ msg, x, y }), []);
  const closeContext = useCallback(() => setCtxMenu(null), []);

  const actions = {
    toggleReaction,
    reply: (msg) => setReplyTo(msg),
    save: (msg) => saveMessage({ ...msg, _serverId: serverId, _channelId: channelId }),
    pin: pinMessage,
    copy: copyMessage,
    deleteMessage,
    edit: editMessage,
    openContext,
  };

  const pinnedMessages = (pinned[key] || [])
    .map((id) => messages.find((m) => m.id === id))
    .filter(Boolean);

  return (
    <div className="relative flex h-full overflow-hidden">
      <GuildRail
        onOpenSaved={() => setDrawer('saved')}
        onOpenSettings={() => openApp('settings')}
        onAddServer={() => notify({ title: 'Chat', body: 'Multi-server support is coming soon.' })}
      />
      <ChannelList
        server={server}
        active={channelId}
        onSelect={setChannelId}
        user={user}
        status={status}
        onStatusChange={setStatus}
        onNotify={notify}
      />
      <ChatView
        server={server}
        channel={channel}
        messages={messages}
        user={user}
        draft={drafts[channelId] || ''}
        onDraftChange={setDraft}
        onSend={send}
        showMembers={showMembers}
        onToggleMembers={() => setShowMembers((v) => !v)}
        onOpenDrawer={setDrawer}
        replyTo={replyTo}
        setReplyTo={setReplyTo}
        pinnedIds={pinnedIds}
        savedIds={savedIds}
        actions={actions}
        editingId={editingId}
        setEditingId={setEditingId}
      />

      {drawer && (
        <InfoDrawer
          mode={drawer}
          pinnedMessages={pinnedMessages}
          savedMessages={saved}
          onClose={() => setDrawer(null)}
          onUnpin={pinMessage}
          onUnsave={unsaveMessage}
          onJump={(sid, cid) => {
            setServerId(sid);
            setChannelId(cid);
            setDrawer(null);
          }}
        />
      )}

      {quickOpen && (
        <QuickSwitcher
          server={server}
          channelId={channelId}
          onSelect={(cid) => {
            setChannelId(cid);
            setQuickOpen(false);
          }}
          onClose={() => setQuickOpen(false)}
        />
      )}

      {ctxMenu && (
        <ContextMenu
          msg={ctxMenu.msg}
          x={ctxMenu.x}
          y={ctxMenu.y}
          isPinned={pinnedIds.has(ctxMenu.msg.id)}
          isSaved={savedIds.has(ctxMenu.msg.id)}
          onClose={closeContext}
          onReact={(e) => toggleReaction(ctxMenu.msg.id, e)}
          onReply={() => setReplyTo(ctxMenu.msg)}
          onSave={() => actions.save(ctxMenu.msg)}
          onPin={() => pinMessage(ctxMenu.msg.id)}
          onCopy={() => copyMessage(ctxMenu.msg.content)}
          onEdit={() => setEditingId(ctxMenu.msg.id)}
          onDelete={() => deleteMessage(ctxMenu.msg.id)}
        />
      )}
    </div>
  );
}