import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Image as ImageIcon, Search } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import { allFiles, isImageName } from '@/lib/zenith/fs';
import { matchApps, matchFiles, targetForFile, fileKind } from '@/lib/zenith/search';
import AppIcon from '@/components/zenith/AppIcon';

export default function Launchpad() {
  const { panel, closePanels, openApp, fs, settings } = useOS();
  const open = panel === 'launchpad';
  const [q, setQ] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setQ('');
    const t = setTimeout(() => inputRef.current?.focus(), 130);
    return () => clearTimeout(t);
  }, [open]);

  const files = useMemo(() => allFiles(fs.nodes), [fs.nodes]);
  const apps = matchApps(q);
  const found = q.trim() ? matchFiles(files, q, 5) : [];

  const launch = (appId) => {
    closePanels();
    openApp(appId);
  };

  const openFile = (file) => {
    const target = targetForFile(file);
    closePanels();
    openApp(target.appId, target.payload);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex flex-col items-center"
          data-launchpad="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: settings.reduceMotion ? 0 : 0.22 }}
        >
          <div className="absolute inset-0 bg-black/45 backdrop-blur-2xl" onClick={closePanels} />

          <div className="relative mt-[7vh] flex w-[420px] max-w-[88vw] items-center">
            <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-[hsl(var(--z-text-dim))]" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search apps, files and folders"
              className="z-input h-11 w-full pl-10 pr-4 text-sm"
            />
          </div>

          <div className="z-scroll relative mt-9 w-full flex-1 overflow-y-auto px-[6vw] pb-16">
            <div className="mx-auto grid max-w-[900px] grid-cols-3 gap-x-4 gap-y-7 sm:grid-cols-4 lg:grid-cols-5">
              {apps.map((app, i) => (
                <motion.button
                  key={app.id}
                  type="button"
                  onClick={() => launch(app.id)}
                  data-launchpad-app={app.id}
                  className="z-pressable group flex flex-col items-center gap-3 rounded-2xl px-2 py-3 hover:bg-white/[0.07]"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.02, 0.16), duration: 0.22 }}
                >
                  <AppIcon
                    appId={app.id}
                    className="h-[68px] w-[68px] transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20"
                  />
                  <span className="z-on-wallpaper w-full truncate text-center text-[12px] font-medium">
                    {app.name}
                  </span>
                </motion.button>
              ))}
            </div>

            {apps.length === 0 && found.length === 0 && (
              <p className="mt-16 text-center text-sm text-white/60">Nothing matches “{q}”</p>
            )}

            {found.length > 0 && (
              <div className="mx-auto mt-10 max-w-[620px]">
                <p className="pb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">Files</p>
                <div className="z-glass overflow-hidden rounded-2xl p-1.5">
                  {found.map((file) => (
                    <button
                      key={file.path}
                      type="button"
                      onClick={() => openFile(file)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-white/[0.08]"
                    >
                      {isImageName(file.name) ? (
                        <ImageIcon className="h-4 w-4 shrink-0 text-fuchsia-300" />
                      ) : (
                        <FileText className="h-4 w-4 shrink-0 text-amber-300" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px]">{file.name}</span>
                        <span className="block truncate text-[11px] text-white/50">
                          {file.parent} · {fileKind(file.name)}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}