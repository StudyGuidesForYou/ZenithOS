import React from 'react';
import { useOS } from '@/lib/zenith/osContext';
import { widgetById } from './catalog';

/* Renders the widgets the user enabled. Used on the desktop (Sonoma style)
   and inside Notification Center. */
export default function WidgetBoard({ variant = 'desktop' }) {
  const { settings } = useOS();
  const items = settings.widgets.map(widgetById).filter(Boolean);
  if (!items.length) return null;

  return (
    <div className="flex w-full flex-col gap-2.5">
      {items.map(({ id, Component }) => (
        <section key={id} className="z-widget p-3">
          <Component />
        </section>
      ))}
    </div>
  );
}