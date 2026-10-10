import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Bold,
  Check,
  Code,
  Download,
  Eye,
  FilePlus,
  Heading,
  Italic,
  Link as LinkIcon,
  List,
  Minus,
  Plus,
  Quote,
  Save,
  Pencil,
  Search,
  Trash2,
  X,
  Files as FilesIcon,
} from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import { baseName, extOf } from '@/lib/zenith/fs';

/* Notepad — a real notes editor: a sidebar of every note in /Documents,
   a markdown formatting toolbar, autosave, find-in-note, live preview,
   reading time, and tab indent. */
export default function Notepad({ payload }) {
  const { fs, notify } = useOS();
  const [path, setPath] = useState(payload?.path || null);
  const [name, setName] = useState(payload?.path ? baseName(payload.path) : 'Untitled note.md');
  const [content, setContent] = useState(payload?.path ? fs.read(payload.path) : '');
  const [dirty, setDirty] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [size, setSize] = useState(14);
  const [preview, setPreview] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [sidebar, setSidebar] = useState(true);
  const taRef = useRef(null);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (payload?.path && payload.path !== path) {
      setPath(payload.path);
      setName(baseName(payload.path));
      setContent(fs.read(payload.path));
      setDirty(false);
      setSavedAt(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload?.path]);

  // autosave a named note 800ms after the last keystroke
  useEffect(() => {
    if (!path || !dirty) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fs.write(path, content);
      setDirty(false);
      setSavedAt(Date.now());
    }, 800);
    return () => clearTimeout(saveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, dirty, path]);

  // global Ctrl+F to toggle the find bar
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setFindOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const notes = useMemo(() => {
    const items = fs.list('/Documents').filter((f) => ['.txt', '.md'].includes(extOf(f.name)));
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fs, path, dirty, savedAt]);

  const isMd = extOf(name) === 'md';
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lines = content ? content.split('\n').length : 0;
  const readMins = Math.max(1, Math.round(words / 200));

  const save = () => {
    const clean = name.trim() || 'Untitled note.md';
    if (!path) {
      const created = fs.createFile('/Documents', clean, content);
      setPath(created);
      setName(baseName(created));
    } else {
      const target = clean !== baseName(path) ? fs.rename(path, clean) : path;
      fs.write(target, content);
      setPath(target);
      setName(baseName(target));
    }
    setDirty(false);
    setSavedAt(Date.now());
    notify({ title: 'Note saved', body: clean });
  };

  const newNote = () => {
    setPath(null);
    setName('Untitled note.md');
    setContent('');
    setDirty(false);
    setSavedAt(null);
  };

  const openNote = (p) => {
    setPath(p);
    setName(baseName(p));
    setContent(fs.read(p));
    setDirty(false);
    setSavedAt(null);
  };

  const deleteNote = (p) => {
    fs.remove(p);
    if (p === path) newNote();
    notify({ title: 'Note deleted', body: baseName(p) });
  };

  const download = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ---- markdown formatting ---- */
  const wrap = (before, after = before, placeholder = '') => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const sel = content.slice(s, e) || placeholder;
    const next = content.slice(0, s) + before + sel + after + content.slice(e);
    setContent(next);
    setDirty(true);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = s + before.length;
      ta.selectionEnd = s + before.length + sel.length;
    });
  };
  const insertLine = (prefix) => {
    const ta = taRef.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const lineStart = content.lastIndexOf('\n', s - 1) + 1;
    const next = content.slice(0, lineStart) + prefix + content.slice(lineStart);
    setContent(next);
    setDirty(true);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = s + prefix.length;
    });
  };

  const onTaKey = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      save();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = e.target;
      const s = ta.selectionStart;
      const next = content.slice(0, s) + '  ' + content.slice(ta.selectionEnd);
      setContent(next);
      setDirty(true);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = s + 2;
      });
    }
  };

  /* ---- find ---- */
  const matches = useMemo(() => {
    if (!query) return [];
    const idxs = [];
    let i = content.toLowerCase().indexOf(query.toLowerCase());
    while (i !== -1) {
      idxs.push(i);
      i = content.toLowerCase().indexOf(query.toLowerCase(), i + 1);
    }
    return idxs;
  }, [content, query]);
  const [matchPos, setMatchPos] = useState(0);
  const gotoMatch = (dir) => {
    if (!matches.length || !taRef.current) return;
    const next = (matchPos + dir + matches.length) % matches.length;
    setMatchPos(next);
    const i = matches[next];
    taRef.current.focus();
    taRef.current.selectionStart = i;
    taRef.current.selectionEnd = i + query.length;
    // rough scroll into view
    const lineHeight = size * 1.7;
    const line = content.slice(0, i).split('\n').length;
    taRef.current.scrollTop = Math.max(0, (line - 3) * lineHeight);
  };

  return (
    <div className="flex h-full">
      {sidebar && (
        <div className="z-glass-soft flex w-52 shrink-0 flex-col border-r border-[hsl(var(--z-border))]">
          <div className="flex items-center justify-between px-3 py-2.5">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-white/45">Notes</span>
            <button onClick={newNote} title="New note" className="z-hoverable rounded-md p-1 text-white/60 hover:text-white">
              <FilePlus className="h-4 w-4" />
            </button>
          </div>
          <div className="z-scroll min-h-0 flex-1 overflow-y-auto px-1.5 pb-2">
            {notes.length === 0 && (
              <p className="px-2 py-4 text-center text-[12px] text-white/35">No notes yet — press + to create one.</p>
            )}
            {notes.map((n) => (
              <div
                key={n.path}
                className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] ${
                  path === n.path ? 'bg-[hsl(var(--z-accent)/0.22)] text-white' : 'text-white/65 hover:bg-white/[0.05]'
                }`}
              >
                <button onClick={() => openNote(n.path)} className="flex min-w-0 flex-1 items-center gap-2 text-left">
                  <FilesIcon className="h-3.5 w-3.5 shrink-0 text-white/40" />
                  <span className="truncate">{n.name}</span>
                </button>
                <button
                  onClick={() => deleteNote(n.path)}
                  className="z-hoverable shrink-0 rounded p-0.5 text-white/30 opacity-0 hover:text-rose-300 group-hover:opacity-100"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-white/[0.07] px-2.5 py-2">
          <ToolButton onClick={() => setSidebar((v) => !v)} label="Notes">
            <FilesIcon className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton onClick={newNote} label="New">
            <FilePlus className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton onClick={save} label="Save" accent>
            <Save className="h-3.5 w-3.5" />
          </ToolButton>

          {isMd && (
            <>
              <span className="mx-0.5 hidden h-6 w-px bg-white/10 sm:block" />
              <FmtButton onClick={() => insertLine('# ')} title="Heading">
                <Heading className="h-3.5 w-3.5" />
              </FmtButton>
              <FmtButton onClick={() => wrap('**')} title="Bold">
                <Bold className="h-3.5 w-3.5" />
              </FmtButton>
              <FmtButton onClick={() => wrap('*')} title="Italic">
                <Italic className="h-3.5 w-3.5" />
              </FmtButton>
              <FmtButton onClick={() => insertLine('- ')} title="List">
                <List className="h-3.5 w-3.5" />
              </FmtButton>
              <FmtButton onClick={() => insertLine('> ')} title="Quote">
                <Quote className="h-3.5 w-3.5" />
              </FmtButton>
              <FmtButton onClick={() => wrap('`')} title="Code">
                <Code className="h-3.5 w-3.5" />
              </FmtButton>
              <FmtButton onClick={() => wrap('[', '](url)', 'label')} title="Link">
                <LinkIcon className="h-3.5 w-3.5" />
              </FmtButton>
            </>
          )}

          <div className="relative mx-1 min-w-[120px] flex-1">
            <Pencil className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-white/40" />
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setDirty(true);
              }}
              className="z-input h-8 w-full pl-7 pr-2 text-[12px]"
            />
          </div>

          {isMd && (
            <ToolButton onClick={() => setPreview((v) => !v)} label={preview ? 'Edit' : 'Preview'}>
              <Eye className="h-3.5 w-3.5" />
            </ToolButton>
          )}
          <ToolButton onClick={() => setFindOpen((v) => !v)} label="Find">
            <Search className="h-3.5 w-3.5" />
          </ToolButton>
          <ToolButton onClick={download} label="Download">
            <Download className="h-3.5 w-3.5" />
          </ToolButton>
          <div className="flex items-center gap-1 pl-1">
            <button onClick={() => setSize((s) => Math.max(10, s - 1))} className="z-hoverable flex h-7 w-7 items-center justify-center rounded-lg">
              <Minus className="h-3 w-3" />
            </button>
            <button onClick={() => setSize((s) => Math.min(28, s + 1))} className="z-hoverable flex h-7 w-7 items-center justify-center rounded-lg">
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>

        {findOpen && (
          <div className="z-glass-soft flex items-center gap-2 border-b border-[hsl(var(--z-border))] px-3 py-1.5 text-[12px]">
            <Search className="h-3.5 w-3.5 text-white/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setMatchPos(0);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') gotoMatch(e.shiftKey ? -1 : 1);
                if (e.key === 'Escape') setFindOpen(false);
              }}
              placeholder="Find…"
              className="z-input h-7 w-56 px-2 text-[12px]"
            />
            <span className="text-white/40">
              {matches.length ? `${matchPos + 1}/${matches.length}` : '0'}
            </span>
            <button onClick={() => gotoMatch(-1)} className="z-hoverable rounded-md p-1 text-white/60 hover:text-white" title="Previous">
              <Minus className="h-3.5 w-3.5 rotate-90" />
            </button>
            <button onClick={() => gotoMatch(1)} className="z-hoverable rounded-md p-1 text-white/60 hover:text-white" title="Next">
              <Plus className="h-3.5 w-3.5 rotate-90" />
            </button>
            <button onClick={() => setFindOpen(false)} className="z-hoverable ml-auto rounded-md p-1 text-white/50 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="z-scroll relative min-h-0 flex-1 overflow-auto bg-black/[0.12]">
          {preview ? (
            <div className="z-md mx-auto max-w-[720px] px-7 py-6 text-white/85" style={{ fontSize: size, lineHeight: 1.65 }}>
              <ReactMarkdown>{content || '_Nothing to preview yet._'}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              ref={taRef}
              data-notes-input="true"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setDirty(true);
              }}
              onKeyDown={onTaKey}
              spellCheck={false}
              placeholder="Start typing… (Tab indents, ⌘F finds, ⌘S saves)"
              className="h-full w-full resize-none bg-transparent px-7 py-6 font-normal text-white/90 outline-none placeholder:text-white/30"
              style={{ fontSize: size, lineHeight: 1.7, fontFamily: 'var(--font-body)' }}
            />
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-white/[0.07] px-3.5 py-1.5 text-[11px] text-white/50">
          <span>{words} words</span>
          <span>{content.length} chars</span>
          <span>{lines} lines</span>
          <span>~{readMins} min read</span>
          <span className="ml-auto flex items-center gap-1.5">
            {savedAt && !dirty ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                Saved {path ? '' : '(new)'}
              </>
            ) : dirty ? (
              'Unsaved changes'
            ) : (
              'New note'
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

function ToolButton({ children, label, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      className={`z-hoverable z-pressable flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-[12px] ${
        accent ? 'z-accent-soft border-transparent' : 'border-white/[0.09] bg-white/[0.04]'
      }`}
    >
      {children}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function FmtButton({ children, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="z-hoverable z-pressable flex h-8 w-8 items-center justify-center rounded-lg text-white/65 hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}