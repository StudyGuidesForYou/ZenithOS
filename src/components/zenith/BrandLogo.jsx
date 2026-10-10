const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from 'react';
import { Image } from '@/components/ui/image';

export const BRAND_LOGO_URL =
  'https://media.db.com/images/public/6ac5b14a8c2be67ed4e18411/0006cf6b1_logo.png';

/* The uploaded ZenithOS logo, presented as a rounded app-icon tile so the
   artwork's own white plate reads as intentional on any surface. */
export default function BrandLogo({ className = 'h-20 w-20', glow = false, padding = 'p-[9%]' }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[23%] bg-white ${padding} ${className}`}
      style={
        glow
          ? { boxShadow: '0 0 0 1px rgb(255 255 255 / 0.16), 0 18px 46px -12px rgb(124 58 237 / 0.55)' }
          : { boxShadow: '0 10px 30px -12px rgb(2 1 12 / 0.7), 0 0 0 1px rgb(255 255 255 / 0.1)' }
      }
    >
      <Image src={BRAND_LOGO_URL} alt="ZenithOS" fittingType="fit" className="h-full w-full object-contain" />
    </span>
  );
}