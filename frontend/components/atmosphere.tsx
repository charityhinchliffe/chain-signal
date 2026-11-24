import type { ReactNode } from "react";

export function Atmosphere({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="orb-a pointer-events-none absolute -top-16 left-[-4rem] h-72 w-72 rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="orb-b pointer-events-none absolute top-40 right-[-3rem] h-80 w-80 rounded-full bg-accent-2/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
