import { useEffect, useState } from 'react';

/* Battery Status API — removed from most desktop browsers, so when it is
   unavailable we report a synthetic "on AC power" state instead of null.
   That keeps the battery tray item visible and meaningful everywhere. */
export default function useBattery() {
  const [state, setState] = useState(() => ({ level: 100, charging: true, ac: true }));

  useEffect(() => {
    let alive = true;
    let battery;
    const update = () => {
      if (!alive || !battery) return;
      setState({ level: Math.round(battery.level * 100), charging: Boolean(battery.charging), ac: false });
    };
    if (typeof navigator !== 'undefined' && typeof navigator.getBattery === 'function') {
      navigator
        .getBattery()
        .then((b) => {
          if (!alive) return;
          battery = b;
          update();
          b.addEventListener('levelchange', update);
          b.addEventListener('chargingchange', update);
        })
        .catch(() => undefined);
    }
    return () => {
      alive = false;
      if (battery) {
        battery.removeEventListener('levelchange', update);
        battery.removeEventListener('chargingchange', update);
      }
    };
  }, []);

  return state;
}