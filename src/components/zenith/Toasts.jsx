import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';

export default function Toasts() {
  const { toasts, dismissToast, panel, settings } = useOS();

  return (
    <div
      className="pointer-events-none fixed right-2 z-[76] flex w-[336px] max-w-[calc(100vw-16px)] flex-col gap-2"
      style={{ top: 'calc(var(--z-menubar) + 8px)' }}
    >
      <AnimatePresence>
        {panel !== 'notifications' &&
          toasts.slice(-3).map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.97 }}
              transition={settings.reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32 }}
              className="z-glass-strong pointer-events-auto flex items-start gap-3 rounded-2xl p-3"
            >
              <span className="z-accent-soft flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border">
                <Bell className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium">{t.title}</p>
                {t.body && (
                  <p className="mt-0.5 text-[11.5px] leading-snug text-[hsl(var(--z-text-dim))]">{t.body}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                className="z-hoverable -mr-1 -mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg"
                title="Dismiss"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}