import React from "react";
import Wallpaper from "@/components/zenith/Wallpaper";
import ZenithMark from "@/components/zenith/ZenithMark";

/* Shared shell for every auth screen. Renders the ZenithOS wallpaper behind a
   centered liquid-glass card so login / register / onboarding share one look.
   The `icon` prop is accepted for backward compatibility but ignored — the
   Zenith mark is used as the brand glyph instead. */
export default function AuthLayout({ icon: _Icon, title, subtitle, footer, children }) {
  return (
    <div className="zenith-root z-auth" data-theme="dark" data-glass="high" data-transparency="on">
      <Wallpaper id="aurora" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl z-glass-strong p-2.5">
              <ZenithMark className="h-full w-full" glow />
            </div>
            {title && (
              <h1 className="font-heading text-3xl font-semibold tracking-tight text-white drop-shadow">
                {title}
              </h1>
            )}
            {subtitle && <p className="mt-2 text-sm text-white/60">{subtitle}</p>}
          </div>

          <div className="z-glass-strong z-sheen rounded-3xl p-7">{children}</div>

          {footer && <p className="mt-6 text-center text-sm text-white/55">{footer}</p>}
        </div>
      </div>
    </div>
  );
}