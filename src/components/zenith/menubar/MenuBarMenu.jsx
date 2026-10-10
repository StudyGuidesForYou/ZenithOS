import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';

export default function MenuBarMenu({ open, items }) {
  const { settings } = useOS();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="z-glass-strong absolute top-[calc(100%+3px)] z-[82] max-h-[70vh] min-w-[232px] overflow-y-auto rounded-xl p-1.5 z-scroll"
          initial={{ opacity: 0, y: -6, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.99 }}
          transition={settings.reduceMotion ? { duration: 0 } : { duration: 0.14, ease: 'easeOut' }}
        >
          {items.map((item, i) => {
            if (item.type === 'separator') {
              return <div key={`sep-${i}`} className="my-1 h-px bg-[hsl(var(--z-border))]" />;
            }
            if (item.type === 'label') {
              return (
                <p
                  key={`label-${i}`}
                  className="px-2 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[hsl(var(--z-text-dim))]"
                >
                  {item.label}
                </p>
              );
            }
            const Icon = item.icon;
            return (
              <button
                key={item.key || item.label}
                type="button"
                disabled={item.disabled}
                onClick={item.run}
                className="z-menu-item"
              >
                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">
                  {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                </span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {item.checked && <Check className="h-3.5 w-3.5 shrink-0 text-[hsl(var(--z-accent))]" />}
                {item.hint && (
                  <span className="shrink-0 pl-3 text-[11px] text-[hsl(var(--z-text-dim))]">{item.hint}</span>
                )}
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}