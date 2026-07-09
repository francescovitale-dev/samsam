"use client";

import { usePathname } from "next/navigation";

/**
 * Fades content in on route change. Keyed by pathname so it replays on
 * navigation but NOT on same-page re-renders (e.g. after a save), which keeps
 * client state (like the builder form) intact.
 */
export function PageFade({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-fade-up mx-auto max-w-6xl p-6">
      {children}
    </div>
  );
}
