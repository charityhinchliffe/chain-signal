import Link from "next/link";
import { ArrowIcon } from "@/components/landing/icons";

export function Closing() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        className="orb-a pointer-events-none absolute bottom-0 left-[10%] h-64 w-64 rounded-full bg-accent/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="orb-b pointer-events-none absolute top-0 right-[8%] h-72 w-72 rounded-full bg-accent-2/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-4xl px-6 py-28 text-center md:py-36">
        <h2 className="reveal text-[clamp(2.3rem,5.5vw,4.4rem)] leading-[1.02] font-medium tracking-[-0.045em] text-ink">
          Send a message that leaves
          <span className="text-gradient mt-1 block">when it is read.</span>
        </h2>
        <p className="reveal reveal-late mx-auto mt-6 max-w-md text-base leading-7 text-muted">
          Write it. Share the link. One open, and the signal is gone for good.
        </p>
        <div className="reveal reveal-late mt-8">
          <Link
            href="/try"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-5 py-3 text-sm font-medium text-white transition duration-300 hover:brightness-110"
          >
            Try it out
            <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
