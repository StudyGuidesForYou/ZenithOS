const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

const KEY = 'zenith.fs.v1';

export const joinPath = (parent, name) => (parent === '/' ? `/${name}` : `${parent}/${name}`);
export const parentOf = (p) => {
  const i = p.lastIndexOf('/');
  return i <= 0 ? '/' : p.slice(0, i);
};
export const baseName = (p) => p.slice(p.lastIndexOf('/') + 1);
export const extOf = (name) => {
  const i = name.lastIndexOf('.');
  return i > 0 ? name.slice(i + 1).toLowerCase() : '';
};
export const isImageName = (name) => ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extOf(name));
export const isTextName = (name) => ['txt', 'md', 'json', 'js', 'css', 'html', 'log'].includes(extOf(name)) || extOf(name) === '';

export const resolvePath = (cwd, input) => {
  if (!input || input === '~') return '/';
  const start = input.startsWith('/') ? input : `${cwd === '/' ? '' : cwd}/${input}`;
  const parts = [];
  start.split('/').forEach((seg) => {
    if (!seg || seg === '.') return;
    if (seg === '..') parts.pop();
    else parts.push(seg);
  });
  return `/${parts.join('/')}`;
};

const PIC_AURORA =
  'https://media.db.com/images/public/6ac5b14a8c2be67ed4e18411/4424730c1_generated_image.png';
const PIC_MOUNTAIN =
  'https://media.db.com/images/public/6ac5b14a8c2be67ed4e18411/b0cd9f387_generated_image.png';
const PIC_CITY =
  'https://media.db.com/images/public/6ac5b14a8c2be67ed4e18411/fe13fadd1_generated_image.png';

export function createInitialFs() {
  const t = Date.now();
  const file = (parent, name, content) => ({
    [joinPath(parent, name)]: { name, parent, type: 'file', content, updated: t },
  });
  const folder = (path) => ({
    [path]: { name: baseName(path), parent: parentOf(path), type: 'folder', updated: t },
  });

  return {
    ...folder('/Documents'),
    ...folder('/Pictures'),
    ...folder('/Music'),
    ...folder('/System'),
    ...file(
      '/Documents',
      'Welcome to ZenithOS.md',
      `# Welcome to ZenithOS\n\nYou are running a desktop environment built entirely for the browser.\n\n## Try this\n\n- Drag a window by its title bar, then fling it against the left or right edge to snap it.\n- Right-click the desktop for the quick menu.\n- Open **Terminal** and type \`neofetch\`.\n- Change your wallpaper and accent color in **Settings**.\n\nEverything you create is saved on this device.`
    ),
    ...file(
      '/Documents',
      'Terminal Cheatsheet.txt',
      `ls, cd, pwd, cat, mkdir, touch, echo, rm, clr, open\n\nExtras:\n  neofetch        system summary\n  wallpaper <id>  aurora | nebula | sunset | emerald | graphite\n  accent <id>     violet | magenta | blue | cyan | emerald | amber | rose\n  theme dark|light\n  open <app>      files | notepad | terminal | photos | canvas | calculator | settings`
    ),
    ...file('/Documents', 'Ideas.txt', `- glass everything\n- animate everything\n- ship it`),
    ...file('/System', 'About.txt', 'ZenithOS 1.0 "Aurora" — liquid glass desktop environment.'),
    ...file('/Pictures', 'Aurora.png', PIC_AURORA),
    ...file('/Pictures', 'Mountains at Dusk.png', PIC_MOUNTAIN),
    ...file('/Pictures', 'Neon Skyline.png', PIC_CITY),
  };
}

export function loadFs() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length) return parsed;
    }
  } catch (e) {
    /* start fresh */
  }
  return createInitialFs();
}

export function saveFs(nodes) {
  try {
    localStorage.setItem(KEY, JSON.stringify(nodes));
  } catch (e) {
    /* storage unavailable */
  }
}

export function childrenOf(nodes, path) {
  return Object.entries(nodes)
    .filter(([p, n]) => n.parent === path && p !== path)
    .map(([p, n]) => ({ ...n, path: p }))
    .sort((a, b) =>
      a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1
    );
}

export function uniqueName(nodes, parent, name) {
  if (!nodes[joinPath(parent, name)]) return name;
  const ext = extOf(name);
  const stem = ext ? name.slice(0, -(ext.length + 1)) : name;
  let i = 2;
  let candidate = `${stem} (${i})${ext ? `.${ext}` : ''}`;
  while (nodes[joinPath(parent, candidate)]) {
    i += 1;
    candidate = `${stem} (${i})${ext ? `.${ext}` : ''}`;
  }
  return candidate;
}

export function fsMkdir(nodes, parent, name) {
  const safe = uniqueName(nodes, parent, name || 'New folder');
  const path = joinPath(parent, safe);
  return { nodes: { ...nodes, [path]: { name: safe, parent, type: 'folder', updated: Date.now() } }, path };
}

export function fsCreateFile(nodes, parent, name, content = '') {
  const safe = uniqueName(nodes, parent, name || 'Untitled.txt');
  const path = joinPath(parent, safe);
  return {
    nodes: { ...nodes, [path]: { name: safe, parent, type: 'file', content, updated: Date.now() } },
    path,
  };
}

export function fsWrite(nodes, path, content) {
  const node = nodes[path];
  if (!node || node.type !== 'file') return nodes;
  return { ...nodes, [path]: { ...node, content, updated: Date.now() } };
}

export function fsRemove(nodes, path) {
  const next = { ...nodes };
  Object.keys(next).forEach((p) => {
    if (p === path || p.startsWith(`${path}/`)) delete next[p];
  });
  return next;
}

export function fsRename(nodes, path, newName) {
  const node = nodes[path];
  if (!node) return { nodes, path };
  const clean = newName.trim();
  if (!clean) return { nodes, path };
  const parent = node.parent;
  const safe = nodes[joinPath(parent, clean)] ? uniqueName(nodes, parent, clean) : clean;
  const nextPath = joinPath(parent, safe);
  const next = { ...nodes };
  delete next[path];
  next[nextPath] = { ...node, name: safe, updated: Date.now() };
  Object.keys(nodes).forEach((p) => {
    if (p.startsWith(`${path}/`)) {
      const moved = nextPath + p.slice(path.length);
      next[moved] = { ...nodes[p], parent: parentOf(moved), updated: Date.now() };
      delete next[p];
    }
  });
  return { nodes: next, path: nextPath };
}

export function allFiles(nodes) {
  return Object.entries(nodes)
    .filter(([, n]) => n.type === 'file')
    .map(([p, n]) => ({ ...n, path: p }))
    .sort((a, b) => (b.updated || 0) - (a.updated || 0));
}

export function storageSize(nodes) {
  try {
    return JSON.stringify(nodes).length;
  } catch (e) {
    return 0;
  }
}