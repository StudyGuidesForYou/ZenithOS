import React from 'react';
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  MapPin,
  RefreshCw,
  Sun,
  Wind,
} from 'lucide-react';
import { useWeather, codeInfo } from '@/lib/zenith/useWeather';

const ICONS = {
  sun: Sun,
  'cloud-sun': CloudSun,
  cloud: Cloud,
  'cloud-fog': CloudFog,
  'cloud-drizzle': CloudDrizzle,
  'cloud-rain': CloudRain,
  'cloud-snow': CloudSnow,
  'cloud-lightning': CloudLightning,
};

const dayLabel = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 3);
};

export default function WeatherWidget() {
  const { status, data, error, refresh } = useWeather();

  if (!data) {
    return (
      <div className="flex items-center gap-3">
        <RefreshCw className="h-8 w-8 animate-spin text-white/40" />
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-none">Finding you…</p>
          <p className="mt-1 truncate text-[11px] text-[hsl(var(--z-text-dim))]">Reading your location</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center gap-3">
        <MapPin className="h-8 w-8 text-white/40" />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold leading-tight">
            {error === 'denied' ? 'Location off' : 'Unavailable'}
          </p>
          <p className="mt-1 truncate text-[11px] text-[hsl(var(--z-text-dim))]">
            {error === 'denied' ? 'Allow location to see weather' : 'Tap to retry'}
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="z-hoverable z-pressable flex h-7 w-7 items-center justify-center rounded-lg"
          aria-label="Retry"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  const info = codeInfo(data.code);
  const Icon = ICONS[info.icon] || Cloud;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-3">
        <Icon className={`h-10 w-10 ${info.accent}`} />
        <div className="min-w-0 flex-1">
          <p
            className="text-[22px] font-semibold leading-none tabular-nums"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {data.temp}°
          </p>
          <p className="mt-1 truncate text-[11px] text-[hsl(var(--z-text-dim))]">
            {info.label} · {data.city}
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="z-hoverable z-pressable flex h-7 w-7 items-center justify-center rounded-lg text-[hsl(var(--z-text-dim))]"
          aria-label="Refresh weather"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${status === 'refreshing' ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex items-center gap-3 text-[10.5px] text-[hsl(var(--z-text-dim))]">
        <span className="flex items-center gap-1">
          <Wind className="h-3 w-3" /> {data.wind} km/h
        </span>
        <span>{data.humidity}% humidity</span>
        <span className="ml-auto">Feels {data.feels}°</span>
      </div>

      {data.days?.length > 1 && (
        <div className="flex items-stretch justify-between gap-1 border-t border-white/[0.07] pt-2">
          {data.days.slice(1, 4).map((d) => {
            const di = codeInfo(d.code);
            const DIcon = ICONS[di.icon] || Cloud;
            return (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-[10px] text-[hsl(var(--z-text-dim))]">{dayLabel(d.date)}</span>
                <DIcon className={`h-4 w-4 ${di.accent}`} />
                <span className="text-[11px] font-medium tabular-nums">{d.max}°</span>
                <span className="text-[10px] tabular-nums text-[hsl(var(--z-text-dim))]">{d.min}°</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}