import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, SlidersHorizontal, X } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import WidgetBoard from '@/components/zenith/widgets/WidgetBoard';

export default function NotificationCenter() {
  const { panel, closePanels, notifications, dismissNotification, clearNotifications, settings, openApp } = useOS();
  const open = panel === 'notifications';

  return (
    <AnimatePresence>
      {open && (
        <>
          <div className="fixed inset-0 z-[66]" onClick={closePanels} />
          <motion.aside
            className="z-glass-strong z-scroll fixed right-2 z-[67] w-[378px] max-w-[calc(100vw-16px)] overflow-y-auto rounded-3xl p-3"
            style={{ top: 'calc(var(--z-menubar) + 6px)', bottom: 'calc(var(--z-dock) + 6px)' }}
            data-notification-center="true"
            initial={{ opacity: 0, x: 34 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 26 }}
            transition={{ duration: settings.reduceMotion ? 0 : 0.2, ease: [0.22, 0.9, 0.24, 1] }}
          >
            <div className="mb-2 flex items-center justify-between px-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[hsl(var(--z-text-dim))]">
                Notifications
              </p>
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearNotifications}
                  className="z-hoverable rounded-lg px-2 py-1 text-[11px] text-[hsl(var(--z-text-dim))]"
                >
                  Clear all
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="flex items-center gap-3 rounded-2xl border border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))] px-3 py-4">
                <Bell className="h-4 w-4 text-[hsl(var(--z-text-dim))]" />
                <p className="text-[12.5px] text-[hsl(var(--z-text-dim))]">No new notifications</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {notifications.slice(0, 8).map((n) => (
                  <div
                    key={n.id}
                    className="group flex items-start gap-3 rounded-2xl border border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))] px-3 py-2.5"
                  >
                    <span className="z-accent-soft flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border">
                      <Bell className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-medium">{n.title}</span>
                      {n.body && (
                        <span className="mt-0.5 block text-[11.5px] leading-snug text-[hsl(var(--z-text-dim))]">
                          {n.body}
                        </span>
                      )}
                      <span className="mt-1 block text-[10px] text-[hsl(var(--z-text-dim))]">
                        {new Date(n.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => dismissNotification(n.id)}
                      className="z-hoverable -mr-1 -mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100"
                      title="Dismiss"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3">
              <WidgetBoard variant="panel" />
            </div>

            <button
              type="button"
              onClick={() => {
                closePanels();
                openApp('settings', { pane: 'widgets' });
              }}
              className="z-hoverable z-pressable mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))] px-3 py-2.5 text-[12.5px]"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Edit widgets
            </button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}