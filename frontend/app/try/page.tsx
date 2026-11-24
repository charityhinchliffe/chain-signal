import type { Metadata } from "next";
import { Atmosphere } from "@/components/atmosphere";
import { Navbar } from "@/components/landing/navbar";
import { Composer } from "@/components/try/composer";

export const metadata: Metadata = {
  title: "Try it out",
  description: "Write a message, choose when it expires, and share a link that works a single time.",
};

export default function TryPage() {
  return (
    <>
      <Navbar />
      <main id="content">
        <Atmosphere>
          <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-16 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:py-24">
            <div className="hero-rise max-w-md">
              <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-accent-ink">
                <span className="live-dot" aria-hidden="true" />
                Try it out
              </p>
              <h1 className="mt-6 text-[clamp(2.4rem,4.6vw,3.8rem)] leading-[1.02] font-medium tracking-[-0.045em] text-ink">
                Write it.
                <span className="text-gradient mt-1 block">Then let it end.</span>
              </h1>
              <p className="mt-5 text-base leading-7 text-muted">
                Choose when the signal expires. Share one link. The first open reveals the message
                and deletes it.
              </p>
            </div>
            <Composer />
          </div>
        </Atmosphere>
      </main>
    </>
  );
}
