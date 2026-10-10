import React from 'react';
import { motion } from 'framer-motion';
import { Power } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import ZenithMark from './ZenithMark';

export default function ShutdownScreen() {
  const { restart } = useOS();

  return (
    <motion.div
      className="absolute inset-0 z-[92] flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      transition={{ duration: 0.45 }}
    >
      <button
        type="button"
        onClick={restart}
        className="group flex flex-col items-center gap-5 text-white/45 transition-colors hover:text-white"
      >
        <span className="z-pressable flex h-16 w-16 items-center justify-center rounded-full border border-white/20 transition-colors group-hover:border-white/45">
          <Power className="h-6 w-6" />
        </span>
        <span className="text-[11px] uppercase tracking-[0.32em]">Press to power on</span>
      </button>
      <ZenithMark className="absolute bottom-10 h-9 w-9 opacity-25" />
    </motion.div>
  );
}