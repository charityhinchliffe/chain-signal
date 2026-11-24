import type { ReactNode } from "react";
import { DevicesIcon, EraseIcon, EyeIcon, LinkIcon, LockIcon } from "@/components/landing/icons";

function IconTile({ children }: { children: ReactNode }) {
  return (
    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white transition duration-300 group-hover:-translate-y-0.5">
      {children}
    </div>
  );
}

export function Capabilities() {
  return (
    <section id="capabilities" className="scroll-mt-28 bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
        <div className="reveal max-w-2xl">
          <p className="text-sm font-medium text-accent-ink">Capabilities</p>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.04em] text-ink">
            Built to disappear.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-muted">
            Every part of a signal points at the same ending: one reading, then deletion.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-12">
          <article className="reveal group relative overflow-hidden rounded-3xl border border-line bg-white p-7 md:col-span-7">
            <IconTile>
              <EyeIcon />
            </IconTile>
            <h3 className="mt-8 text-xl font-medium tracking-tight text-ink">One reading</h3>
            <p className="mt-3 max-w-md text-sm leading-6 text-muted">
              The link shows the message a single time. Opening it is what deletes it, so a second
              visit finds nothing there.
            </p>
            <div className="relative mt-8 h-28 overflow-hidden rounded-2xl border border-line bg-wash">
              <div className="life-message absolute inset-0 px-5">
                <div>
                  <p className="font-mono text-xs text-muted">chain.signal/k7m2q9</p>
                  <p className="mt-1 text-base font-medium tracking-tight text-ink">
                    The gate code is 4419.
                  </p>
                </div>
              </div>
              <div className="life-gone absolute inset-0 px-5">
                <p className="text-gradient text-base font-medium">This signal has been destroyed</p>
              </div>
            </div>
          </article>

          <article className="reveal reveal-late group rounded-3xl border border-line bg-white p-7 md:col-span-5">
            <IconTile>
              <LinkIcon />
            </IconTile>
            <h3 className="mt-8 text-xl font-medium tracking-tight text-ink">A link, and nothing else</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              A signal starts from the page. You write, you receive one URL, and that URL is the
              only key.
            </p>
          </article>

          <article className="reveal group rounded-3xl border border-line bg-white p-7 md:col-span-4">
            <IconTile>
              <LockIcon />
            </IconTile>
            <h3 className="mt-8 text-lg font-medium tracking-tight text-ink">Sealed until the click</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              The words stay hidden until someone follows the link. Until then, the signal is
              unopened.
            </p>
          </article>

          <article className="reveal group rounded-3xl border border-line bg-white p-7 md:col-span-4">
            <IconTile>
              <DevicesIcon />
            </IconTile>
            <h3 className="mt-8 text-lg font-medium tracking-tight text-ink">Any screen</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              The same link opens on a phone or a laptop. Either way, it ends after that visit.
            </p>
          </article>

          <article className="reveal reveal-late group rounded-3xl border border-line bg-white p-7 md:col-span-4">
            <IconTile>
              <EraseIcon />
            </IconTile>
            <h3 className="mt-8 text-lg font-medium tracking-tight text-ink">Deleted after</h3>
            <p className="mt-3 text-sm leading-6 text-muted">
              After the open, the message is removed. Nothing is left to reopen, and the link goes
              quiet.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
