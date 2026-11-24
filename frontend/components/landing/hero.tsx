import Link from "next/link";
import { ArrowIcon } from "@/components/landing/icons";
import { SignalTheater } from "@/components/landing/signal-theater";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="orb-a pointer-events-none absolute -top-10 left-[-4rem] h-72 w-72 rounded-full bg-accent/15 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="orb-b pointer-events-none absolute top-24 right-[-3rem] h-80 w-80 rounded-full bg-accent-2/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pt-16 pb-20 md:grid-cols-2 md:gap-16 md:pt-24 md:pb-28">
        <div className="hero-rise max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-accent-ink">
            <span className="live-dot" aria-hidden="true" />
            One open. Then it is gone.
          </p>
          <h1 className="mt-6 text-[clamp(2.6rem,5.4vw,4.35rem)] leading-[0.98] font-medium tracking-[-0.045em] text-ink">
            Say it once.
            <span className="text-gradient mt-1 block">Then let it disappear.</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-7 text-muted md:text-lg md:leading-8">
            Write a message, share one link, and the first open is the last. The message is
            deleted, and that link never opens again.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/try"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-3 text-sm font-medium text-white transition duration-300 hover:brightness-110"
            >
              Try it out
              <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#theater"
              className="inline-flex items-center rounded-full border border-line bg-white px-5 py-3 text-sm font-medium text-ink transition duration-300 hover:border-accent/30"
            >
              Watch it vanish
            </a>
          </div>
          <p className="mt-5 text-sm text-muted">The link is the whole product.</p>
        </div>

        <div className="hero-rise-late">
          <SignalTheater />
        </div>
      </div>
    </section>
  );
}
