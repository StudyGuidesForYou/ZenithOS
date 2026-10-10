import { useEffect, useRef, useState } from 'react';

/* Real weather for the weather widget.
 *
 *  1. Ask the browser for the user's geolocation.
 *  2. Reverse-geocode the coords into a city name (BigDataCloud, free, no key).
 *  3. Pull the current conditions + a 3-day forecast from Open-Meteo (free, no
 *     key, CORS-enabled).
 *
 * Both endpoints are keyless and CORS-friendly, so this runs entirely in the
 * browser with no backend function or secret. The result is cached in
 * localStorage so we don't re-prompt for location on every boot.
 */

const CACHE_KEY = 'zenith.weather.cache';
const CACHE_MS = 10 * 60 * 1000; // 10 minutes

export const WEATHER_CODES = {
  0: { label: 'Clear', icon: 'sun', accent: 'text-amber-300' },
  1: { label: 'Mainly clear', icon: 'sun', accent: 'text-amber-300' },
  2: { label: 'Partly cloudy', icon: 'cloud-sun', accent: 'text-amber-200' },
  3: { label: 'Overcast', icon: 'cloud', accent: 'text-slate-300' },
  45: { label: 'Fog', icon: 'cloud-fog', accent: 'text-slate-300' },
  48: { label: 'Rime fog', icon: 'cloud-fog', accent: 'text-slate-300' },
  51: { label: 'Light drizzle', icon: 'cloud-drizzle', accent: 'text-sky-300' },
  53: { label: 'Drizzle', icon: 'cloud-drizzle', accent: 'text-sky-300' },
  55: { label: 'Heavy drizzle', icon: 'cloud-drizzle', accent: 'text-sky-300' },
  56: { label: 'Freezing drizzle', icon: 'cloud-drizzle', accent: 'text-sky-200' },
  57: { label: 'Freezing drizzle', icon: 'cloud-drizzle', accent: 'text-sky-200' },
  61: { label: 'Light rain', icon: 'cloud-rain', accent: 'text-sky-300' },
  63: { label: 'Rain', icon: 'cloud-rain', accent: 'text-sky-300' },
  65: { label: 'Heavy rain', icon: 'cloud-rain', accent: 'text-sky-300' },
  66: { label: 'Freezing rain', icon: 'cloud-rain', accent: 'text-sky-200' },
  67: { label: 'Freezing rain', icon: 'cloud-rain', accent: 'text-sky-200' },
  71: { label: 'Light snow', icon: 'cloud-snow', accent: 'text-sky-200' },
  73: { label: 'Snow', icon: 'cloud-snow', accent: 'text-sky-200' },
  75: { label: 'Heavy snow', icon: 'cloud-snow', accent: 'text-sky-200' },
  77: { label: 'Snow grains', icon: 'cloud-snow', accent: 'text-sky-200' },
  80: { label: 'Rain showers', icon: 'cloud-rain', accent: 'text-sky-300' },
  81: { label: 'Rain showers', icon: 'cloud-rain', accent: 'text-sky-300' },
  82: { label: 'Violent showers', icon: 'cloud-rain', accent: 'text-sky-300' },
  85: { label: 'Snow showers', icon: 'cloud-snow', accent: 'text-sky-200' },
  86: { label: 'Snow showers', icon: 'cloud-snow', accent: 'text-sky-200' },
  95: { label: 'Thunderstorm', icon: 'cloud-lightning', accent: 'text-violet-300' },
  96: { label: 'Storm + hail', icon: 'cloud-lightning', accent: 'text-violet-300' },
  99: { label: 'Storm + hail', icon: 'cloud-lightning', accent: 'text-violet-300' },
};

export const codeInfo = (code) => WEATHER_CODES[code] || { label: '—', icon: 'cloud', accent: 'text-slate-300' };

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.t > CACHE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), ...data }));
  } catch {
    /* ignore */
  }
};

const getPosition = (opts) =>
  new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('no-geolocation'));
    navigator.geolocation.getCurrentPosition(resolve, reject, opts);
  });

const reverseGeocode = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );
    if (!res.ok) return null;
    const d = await res.json();
    return d.city || d.locality || d.principalSubdivision || d.countryName || null;
  } catch {
    return null;
  }
};

const fetchForecast = async (lat, lon) => {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('forecast-failed');
  return res.json();
};

export function useWeather() {
  const [state, setState] = useState(() => {
    const cached = readCache();
    return cached?.data
      ? { status: 'ready', data: cached.data, error: null }
      : { status: 'loading', data: null, error: null };
  });
  const reqId = useRef(0);

  const load = async () => {
    const id = (reqId.current += 1);
    setState((s) => ({ ...s, status: s.data ? 'refreshing' : 'loading' }));

    // Serve a fresh-enough cache instantly while we refresh in the background.
    const cached = readCache();
    if (cached?.data) setState({ status: 'ready', data: cached.data, error: null });

    try {
      const pos = await getPosition({ enableHighAccuracy: false, timeout: 10000, maximumAge: CACHE_MS });
      if (id !== reqId.current) return;
      const { latitude, longitude } = pos.coords;

      const [city, forecast] = await Promise.all([
        reverseGeocode(latitude, longitude),
        fetchForecast(latitude, longitude),
      ]);
      if (id !== reqId.current) return;

      const cur = forecast.current;
      const days = (forecast.daily?.time || []).map((t, i) => ({
        date: t,
        code: forecast.daily.weather_code[i],
        max: Math.round(forecast.daily.temperature_2m_max[i]),
        min: Math.round(forecast.daily.temperature_2m_min[i]),
      }));

      const data = {
        city: city || 'Your location',
        temp: Math.round(cur.temperature_2m),
        feels: Math.round(cur.apparent_temperature),
        code: cur.weather_code,
        humidity: cur.relative_humidity_2m,
        wind: Math.round(cur.wind_speed_10m),
        days,
      };
      writeCache({ data });
      setState({ status: 'ready', data, error: null });
    } catch (err) {
      if (id !== reqId.current) return;
      const denied = err?.code === 1 || err?.message === 'no-geolocation';
      setState({ status: 'error', data: null, error: denied ? 'denied' : 'failed' });
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { ...state, refresh: load };
}