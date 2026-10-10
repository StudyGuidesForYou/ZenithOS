import React, { useState } from 'react';
import { Check, Save } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';

const PATH = '/Documents/Quick Note.txt';

export default function QuickNoteWidget() {
  const { fs, notify } = useOS();
  const [value, setValue] = useState(() => fs.read(PATH));
  const [saved, setSaved] = useState(false);

  const save = () => {
    const text = value;
    if (fs.exists(PATH)) fs.write(PATH, text);
    else fs.createFile('/Documents', 'Quick Note.txt', text);
    setSaved(true);
    notify({ title: 'Quick Note saved', body: 'Documents/Quick Note.txt' });
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="flex h-full flex-col">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
            e.preventDefault();
            save();
          }
        }}
        placeholder="Jot something down…"
        className="min-h-[76px] w-full flex-1 resize-none rounded-xl border border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))] p-2.5 text-[12px] leading-relaxed outline-none placeholder:text-[hsl(var(--z-text-dim))]"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10.5px] text-[hsl(var(--z-text-dim))]">{value.length} characters · no limit</span>
        <button
          type="button"
          onClick={save}
          className="z-accent-soft z-pressable flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-[11.5px]"
        >
          {saved ? <Check className="h-3 w-3" /> : <Save className="h-3 w-3" />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </div>
  );
}