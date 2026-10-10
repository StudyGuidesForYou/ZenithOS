import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOS } from '@/lib/zenith/osContext';
import { APPS } from '@/lib/zenith/apps';
import AppIcon from '@/components/zenith/AppIcon';

export default function AppSwitcher() {
  const { panel, switcherApps, switcherIndex, focusApp } = useOS();
  const open = panel === 'switcher' && switcherApps.length > 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[86] flex items-center justify-center bg-black/30 backdrop-blur-xl"
          data-app-switcher="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.13 }}
        >
          <div className="z-glass-strong flex items-end gap-3 rounded-3xl p-4">
            {switcherApps.map((appId, i) => {
              const app = APPS[appId];
              if (!app) return null;
              const selected = i === switcherIndex;
              return (
                <button
                  key={appId}
                  type="button"
                  onClick={() => focusApp(appId)}
                  className="flex w-[88px] flex-col items-center gap-2"
                >
                  <span className={`transition-transform duration-150 ${selected ? 'scale-105' : 'scale-95 opacity-65'}`}>
                    <AppIcon appId={appId} className="h-16 w-16" />
                  </span>
                  <span
                    className={`max-w-full truncate text-[11.5px] ${
                      selected ? 'text-[hsl(var(--z-text))]' : 'text-[hsl(var(--z-text-dim))]'
                    }`}
                  >
                    {app.name}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}