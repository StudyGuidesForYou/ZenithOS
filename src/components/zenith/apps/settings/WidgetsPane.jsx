import React from 'react';
import { Bell, Sparkles } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import { WIDGETS } from '@/components/zenith/widgets/catalog';
import { Pane, Section, Card, Row } from './parts';

export default function WidgetsPane() {
  const { settings, toggleWidget, updateSettings, togglePanel, closePanels } = useOS();

  return (
    <Pane title="Widgets" subtitle="Widgets live on the desktop and in Notification Center.">
      <Section
        title="Available widgets"
        hint="Pick as many as you like — they stack down the right side of the desktop."
        action={
          <button
            type="button"
            onClick={() => {
              closePanels();
              togglePanel('notifications');
            }}
            className="z-hoverable flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] text-[hsl(var(--z-text-dim))]"
          >
            <Bell className="h-3 w-3" />
            Open Notification Center
          </button>
        }
      >
        <Card>
          {WIDGETS.map((w) => (
            <Row
              key={w.id}
              icon={Sparkles}
              label={w.name}
              hint={w.hint}
              on={settings.widgets.includes(w.id)}
              onClick={() => toggleWidget(w.id)}
            />
          ))}
        </Card>
      </Section>

      <Section title="Placement">
        <Card>
          <Row
            icon={Sparkles}
            label="Show on desktop"
            hint="Widgets appear behind your windows, top right."
            on={settings.widgetsOnDesktop}
            onClick={() => updateSettings({ widgetsOnDesktop: !settings.widgetsOnDesktop })}
          />
        </Card>
      </Section>
    </Pane>
  );
}