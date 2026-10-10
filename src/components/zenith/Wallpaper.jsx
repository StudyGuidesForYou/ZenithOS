import React from 'react';
import { wallpaperOf } from '@/lib/zenith/wallpapers';

export default function Wallpaper({ id, custom, className = '' }) {
  const preset = wallpaperOf(id);
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ background: preset.base }}>
      {custom ? (
        <img src={custom} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0">
          {preset.orbs.map((o, i) => (
            <div
              key={i}
              className={`absolute rounded-full ${i % 2 ? 'z-float-alt' : 'z-float'}`}
              style={{
                width: o.w,
                height: o.h,
                left: o.x,
                top: o.y,
                background: `radial-gradient(circle at 50% 50%, ${o.color}, transparent 72%)`,
              }}
            />
          ))}
        </div>
      )}
      <div className="z-grain absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
    </div>
  );
}