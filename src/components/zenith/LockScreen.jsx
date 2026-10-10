import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Power } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import Wallpaper from './Wallpaper';
import ZenithMark from './ZenithMark';

export default function LockScreen() {
  const { settings, unlock, restart } = useOS();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const i = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') unlock();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [unlock]);

  const initials = (settings.username || 'Z')
    .split(' ')
    .map((s) => s[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      className="absolute inset-0 z-[88] flex flex-col items-center justify-center"
      data-lock-screen="true"
      initial={{ opacity: 0, filter: 'blur(18px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(18px)' }}
      transition={{ duration: 0.5 }}
    >
      <Wallpaper id={settings.wallpaper} custom={settings.customWallpaper} />
      <div className="absolute inset-0 bg-black/45 backdrop-blur-2xl" />

      <div className="absolute top-[8vh] flex flex-col items-center text-white">
        <p className="text-[13px] uppercase tracking-[0.4em] text-white/55">
          {now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
        <p
          className="mt-1 text-[84px] font-semibold leading-none sm:text-[104px]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      <motion.div
        className="relative mt-16 flex flex-col items-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.6, ease: [0.22, 0.9, 0.24, 1] }}
      >
        <div className="z-accent-bg flex h-16 w-16 items-center justify-center rounded-full text-[17px] font-semibold shadow-lg">
          {initials}
        </div>
        <p className="mt-3 text-[14px] font-medium text-white">{settings.username}</p>

        <button
          type="button"
          onClick={unlock}
          className="z-glass z-sheen z-hoverable z-pressable mt-5 flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium text-white"
        >
          Press Enter to unlock
          <ChevronRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={restart}
          className="z-hoverable z-pressable mt-6 flex items-center gap-2 rounded-full px-4 py-2 text-xs text-white/60 hover:text-white"
        >
          <Power className="h-3.5 w-3.5" />
          Restart
        </button>
      </motion.div>

      <ZenithMark className="absolute bottom-8 h-7 w-7 opacity-30" />
    </motion.div>
  );
}