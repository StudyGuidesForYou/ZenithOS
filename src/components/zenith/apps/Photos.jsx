import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Download, Image as ImageIcon, Trash2, Wallpaper as WallpaperIcon, X } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import { Image } from '@/components/ui/image';

export default function Photos({ payload }) {
  const { fs, updateSettings, notify } = useOS();
  const images = fs.list('/Pictures').filter((i) => i.type === 'file');
  const [active, setActive] = useState(() => {
    if (!payload?.path) return -1;
    return images.findIndex((i) => i.path === payload.path);
  });

  useEffect(() => {
    if (payload?.path) {
      const idx = fs.list('/Pictures').findIndex((i) => i.path === payload.path);
      if (idx >= 0) setActive(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload?.path]);

  const current = active >= 0 ? images[active] : null;
  const step = (dir) => {
    if (!images.length) return;
    setActive((i) => (i + dir + images.length) % images.length);
  };

  const setWallpaper = (item) => {
    updateSettings({ customWallpaper: item.content });
    notify({ title: 'Wallpaper updated', body: item.name });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-3 py-2 text-[12px]">
        <ImageIcon className="h-3.5 w-3.5 text-white/60" />
        <span className="text-white/70">Pictures</span>
        <span className="ml-auto text-white/45">{images.length} photos</span>
      </div>

      <div className="z-scroll min-h-0 flex-1 overflow-y-auto p-3">
        {images.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <ImageIcon className="h-8 w-8 text-white/25" />
            <p className="text-[12.5px] text-white/50">No photos in Pictures yet</p>
            <p className="text-[11.5px] text-white/35">Save a drawing from Canvas to see it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {images.map((item, i) => (
              <button
                key={item.path}
                onClick={() => setActive(i)}
                className="group relative overflow-hidden rounded-2xl border border-white/10 transition-transform duration-300 hover:scale-[1.02]"
              >
                <Image src={item.content} alt={item.name} className="aspect-[4/3] w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/75 to-transparent px-2.5 pb-1.5 pt-6 text-left text-[11px] text-white">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            className="absolute inset-0 z-[55] flex flex-col bg-black/75 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-center gap-2 px-3 py-2.5">
              <span className="truncate text-[12.5px] text-white/85">{current.name}</span>
              <span className="ml-auto flex items-center gap-1.5">
                <button
                  onClick={() => setWallpaper(current)}
                  className="z-hoverable z-pressable flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[11.5px]"
                >
                  <WallpaperIcon className="h-3.5 w-3.5" /> Set as wallpaper
                </button>
                <a
                  href={current.content}
                  download={current.name}
                  className="z-hoverable z-pressable flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[11.5px]"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
                <button
                  onClick={() => {
                    fs.remove(current.path);
                    notify({ title: 'Deleted', body: current.name });
                    setActive(-1);
                  }}
                  className="z-hoverable z-pressable flex items-center gap-1.5 rounded-xl border border-white/12 bg-white/[0.06] px-3 py-1.5 text-[11.5px] hover:bg-rose-500/70"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
                <button
                  onClick={() => setActive(-1)}
                  className="z-hoverable flex h-8 w-8 items-center justify-center rounded-xl"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4">
              <button
                onClick={() => step(-1)}
                className="z-glass-soft absolute left-3 flex h-10 w-10 items-center justify-center rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <motion.img
                key={current.path}
                src={current.content}
                alt={current.name}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: [0.22, 0.9, 0.24, 1] }}
                className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
              />
              <button
                onClick={() => step(1)}
                className="z-glass-soft absolute right-3 flex h-10 w-10 items-center justify-center rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}