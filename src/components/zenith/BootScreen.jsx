import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import BrandLogo from './BrandLogo';
import { playChime } from '@/lib/zenith/sound';

const STEPS = [
  'Initialising kernel',
  'Mounting liquid glass shell',
  'Restoring your desktop',
  'Ready',
];

export default function BootScreen({ onDone }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i), i * 600));
    const done = setTimeout(() => {
      playChime();
      onDone();
    }, 2800);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
  }, [onDone]);

  return (
    <motion.div
      data-boot-screen="true"
      className="absolute inset-0 z-[90] flex flex-col items-center justify-center overflow-hidden bg-[#05030f]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(14px)' }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_18%,#1d0a42_0%,#080418_55%,#03020a_100%)]" />
      <div
        className="z-float absolute left-1/2 top-1/2 h-[540px] w-[540px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(160,32,240,0.5), transparent 70%)',
          filter: 'blur(72px)',
        }}
      />

      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 0.9, 0.24, 1] }}
        >
          <BrandLogo className="h-[104px] w-[104px]" glow />
        </motion.div>

        <motion.p
          className="mt-7 text-[24px] font-semibold tracking-[0.3em] text-white"
          style={{ fontFamily: 'var(--font-heading)' }}
          initial={{ opacity: 0, letterSpacing: '0.55em' }}
          animate={{ opacity: 1, letterSpacing: '0.3em' }}
          transition={{ duration: 1.05, delay: 0.15, ease: 'easeOut' }}
        >
          ZENITHOS
        </motion.p>

        <div className="relative mt-9 h-[3px] w-[244px] overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] }}
          />
          <div className="z-shimmer absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/60 to-transparent" />
        </div>

        <div className="mt-4 h-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={step}
              className="text-[11px] uppercase tracking-[0.28em] text-white/45"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
            >
              {STEPS[step]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <p className="absolute bottom-8 text-[10px] uppercase tracking-[0.35em] text-white/25">
        ZenithOS 1.1 · Aurora
      </p>
    </motion.div>
  );
}