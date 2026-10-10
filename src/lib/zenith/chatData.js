/* Mock data for the Chat app — frontend only. ONE server, ONE user (the
   local user). No dummy people or seed messages; channels start empty with
   an intro card. The user identity (name + unique numeric ID) comes from
   the real OS profile, so it matches the rest of ZenithOS. */

export const GRAD = {
  violet: 'from-violet-500 to-fuchsia-600',
  blue: 'from-sky-500 to-blue-600',
  emerald: 'from-emerald-500 to-teal-600',
  amber: 'from-amber-500 to-orange-600',
  rose: 'from-rose-500 to-pink-600',
  cyan: 'from-cyan-500 to-sky-600',
  indigo: 'from-indigo-500 to-violet-600',
  slate: 'from-slate-500 to-slate-700',
};

export const SERVERS = [
  {
    id: 'zenith',
    name: 'ZenithOS',
    abbr: 'Z',
    color: 'violet',
    categories: [
      {
        id: 'info',
        name: 'Information',
        channels: [
          { id: 'welcome', name: 'welcome', type: 'text', topic: 'Welcome to ZenithOS Chat — start here.' },
          { id: 'rules', name: 'rules', type: 'text', topic: 'The house rules.' },
        ],
      },
      {
        id: 'dev',
        name: 'Development',
        channels: [
          { id: 'general', name: 'general', type: 'text', topic: 'General chat' },
          { id: 'terminal', name: 'terminal-tricks', type: 'text', topic: 'Shell wizardry & matrix rain' },
          { id: 'calc', name: 'calculator', type: 'text', topic: 'Scientific mode is so clean' },
          { id: 'lounge', name: 'Lounge', type: 'voice' },
          { id: 'pairing', name: 'Pair Programming', type: 'voice' },
        ],
      },
    ],
  },
];

export const firstTextChannel = (server) => {
  for (const cat of server.categories) {
    const t = cat.channels.find((c) => c.type === 'text');
    if (t) return t.id;
  }
  return null;
};

export const findChannel = (server, channelId) => {
  for (const cat of server.categories) {
    const c = cat.channels.find((ch) => ch.id === channelId);
    if (c) return c;
  }
  return null;
};

export const allTextChannels = (server) =>
  server.categories.flatMap((c) => c.channels.filter((ch) => ch.type === 'text'));

export const statusColor = {
  online: '#22c55e',
  idle: '#eab308',
  dnd: '#ef4444',
  offline: '#64748b',
};

export const fmtTime = (minutesAgo) => {
  const d = new Date(Date.now() - minutesAgo * 60000);
  return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const EMOJIS = ['😀', '😂', '😍', '🥳', '🔥', '🎉', '💯', '👍', '👀', '✨', '🚀', '🧡', '💜', '🤔', '😎', '🙌'];
export const STATUS_EMOJIS = ['', '🟢', '🟡', '🔴', '🎮', '🎧', '💻', '✏️', '☕', '🌙', '🚀', '💡'];