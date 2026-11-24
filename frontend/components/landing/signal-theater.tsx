"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

const MESSAGE = "The gate code is 4419. Read it once.";
const LINK = "chain.signal/k7m2q9";

const START = {
  compose: 0,
  share: 4800,
  open: 8000,
  gone: 11600,
} as const;

const TOTAL = 15200;

type Phase = keyof typeof START;

const PHASES: Phase[] = ["compose", "share", "open", "gone"];

const PHASE_LABEL: Record<Phase, string> = {
  compose: "Write",
  share: "Share",
  open: "Open",
  gone: "Gone",
};

const CARD_TITLE: Record<Phase, string> = {
  compose: "Your message",
  share: "Your link",
  open: "Their screen",
  gone: "Their screen",
};

const STATUS: Record<Phase, string> = {
  compose: "Composing",
  share: "Ready to send",
  open: "Opened once",
  gone: "Destroyed",
};

const STEP_COPY: Record<Phase, string> = {
  compose: "Write step. A message is typed.",
  share: "Share step. The message becomes one link.",
  open: "Open step. The message is visible a single time.",
  gone: "Gone step. The message is deleted and the link is closed.",
};

function subscribeReduced(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function phaseAt(elapsed: number): Phase {
  if (elapsed < START.share) return "compose";
  if (elapsed < START.open) return "share";
  if (elapsed < START.gone) return "open";
  return "gone";
}

function charsAt(elapsed: number) {
  const delay = 450;
  const duration = 2900;
  if (elapsed < delay) return 0;
  const progress = Math.min(1, (elapsed - delay) / duration);
  return Math.round(progress * MESSAGE.length);
}

function Panel({ visible, children }: { visible: boolean; children: ReactNode }) {
  return (
    <div
      className={`absolute inset-0 transition duration-500 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

function MessageText({ dissolving }: { dissolving: boolean }) {
  return (
    <p
      className={`text-[1.35rem] leading-snug font-medium tracking-tight text-ink ${
        dissolving ? "is-dissolving" : ""
      }`}
    >
      {MESSAGE.split("").map((char, index) => (
        <span key={`${char}-${index}`} style={{ animationDelay: `${index * 16}ms` }}>
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </p>
  );
}

export function SignalTheater() {
  const reduced = useSyncExternalStore(
    subscribeReduced,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const [phase, setPhase] = useState<Phase>("compose");
  const [count, setCount] = useState(0);
  const [pinned, setPinned] = useState<Phase | null>(null);
  const displayPhase = reduced ? (pinned ?? "open") : phase;

  const phaseRef = useRef<Phase>("compose");
  const countRef = useRef(0);
  const elapsedRef = useRef(0);
  const offsetRef = useRef(0);
  const clockReady = useRef(false);

  useEffect(() => {
    if (reduced || pinned !== null) return;

    if (!clockReady.current) {
      offsetRef.current = performance.now();
      clockReady.current = true;
    }

    let frame = 0;
    const tick = (now: number) => {
      const elapsed = ((now - offsetRef.current) % TOTAL + TOTAL) % TOTAL;
      elapsedRef.current = elapsed;
      const nextPhase = phaseAt(elapsed);
      const nextCount = nextPhase === "compose" ? charsAt(elapsed) : MESSAGE.length;

      if (nextPhase !== phaseRef.current || nextCount !== countRef.current) {
        phaseRef.current = nextPhase;
        countRef.current = nextCount;
        setPhase(nextPhase);
        setCount(nextCount);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, pinned]);

  function pin(next: Phase) {
    elapsedRef.current = START[next];
    phaseRef.current = next;
    countRef.current = MESSAGE.length;
    setPhase(next);
    setCount(MESSAGE.length);
    setPinned(next);
  }

  function pause() {
    setPinned(phase);
  }

  function resume() {
    offsetRef.current = performance.now() - elapsedRef.current;
    clockReady.current = true;
    setPinned(null);
  }

  const reading = displayPhase === "open" || displayPhase === "gone";

  return (
    <div id="theater" className="scroll-mt-28">
      <p className="sr-only">
        Animated preview of a message being written, shared as a link, opened once, and then deleted.
      </p>
      <p className="sr-only" aria-live="polite">
        {pinned ? STEP_COPY[displayPhase] : ""}
      </p>

      <div
        className="signal-frame rounded-[28px] p-px shadow-[0_30px_80px_-40px_rgba(80,70,220,0.55)]"
        aria-hidden="true"
      >
        <div className="flex h-[440px] flex-col rounded-[27px] bg-white p-6 select-none sm:h-[460px] sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <span className="text-xs font-medium text-muted">Live preview</span>
            </div>
            <span className="text-xs font-medium text-accent-ink">{STATUS[displayPhase]}</span>
          </div>
          <p className="mt-5 text-lg font-medium tracking-tight text-ink">{CARD_TITLE[displayPhase]}</p>

          <div className="relative mt-4 flex-1">
            <Panel visible={displayPhase === "compose"}>
              <div className="flex h-full flex-col">
                <div className="flex-1 rounded-2xl bg-wash px-4 py-4 text-[17px] leading-7 tracking-tight text-ink">
                  {MESSAGE.slice(0, count)}
                  <span className="caret" />
                </div>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted">Deletes after one open</p>
                  <div className="rounded-full bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-xs font-medium text-white">
                    Create link
                  </div>
                </div>
              </div>
            </Panel>

            <Panel visible={displayPhase === "share"}>
              <div className="flex h-full flex-col">
                <div className="rounded-2xl border border-line bg-wash px-4 py-4">
                  <p className="text-[11px] font-medium tracking-wide text-muted uppercase">Single-use link</p>
                  <p className="mt-2 truncate font-mono text-sm text-ink sm:text-base">{LINK}</p>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted">
                  Send this once. The first person to open it is the only person who can.
                </p>
                <div className="mt-auto">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted">
                    <span>One view available</span>
                    <span>Sealed</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-wash">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-accent to-accent-2" />
                  </div>
                </div>
              </div>
            </Panel>

            {reading ? (
              <div className="pop-in absolute inset-0 flex flex-col">
                <div className="relative flex flex-1 items-center">
                  <MessageText dissolving={displayPhase === "gone"} />
                  {displayPhase === "gone" ? (
                    <div className="destroyed-in absolute inset-0 flex flex-col justify-center">
                      <SignalMark />
                      <p className="mt-4 text-lg font-medium tracking-tight text-ink">
                        This signal has been destroyed
                      </p>
                      <p className="mt-2 max-w-xs text-sm leading-6 text-muted">
                        It was read once and deleted. This link will not open it again.
                      </p>
                    </div>
                  ) : null}
                </div>
                {displayPhase === "open" && !reduced ? (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-xs text-muted">
                      <span>This view is ending</span>
                      <span>Deleting</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-wash">
                      <div className="drain-bar h-full rounded-full bg-gradient-to-r from-accent to-accent-2" />
                    </div>
                  </div>
                ) : null}
                {displayPhase === "open" && reduced ? (
                  <p className="mt-4 text-sm leading-6 text-muted">
                    The first open shows this, then the message is deleted.
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Preview steps">
          {PHASES.map((item) => {
            const active = displayPhase === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={active}
                onClick={() => pin(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-gradient-to-r from-accent to-accent-2 text-white"
                    : "bg-wash text-muted hover:text-ink"
                }`}
              >
                {PHASE_LABEL[item]}
              </button>
            );
          })}
        </div>
        {reduced ? null : (
          <button
            type="button"
            onClick={pinned ? resume : pause}
            className="rounded-full px-3 py-1.5 text-xs font-medium text-muted transition hover:text-ink"
          >
            {pinned ? "Play" : "Pause"}
          </button>
        )}
      </div>
    </div>
  );
}

function SignalMark() {
  return (
    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path className="arc arc-1" d="M4.5 12h2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path
          className="arc arc-2"
          d="M8.4 8.1a5.4 5.4 0 0 1 0 7.8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          className="arc arc-3"
          d="M12 5a9.2 9.2 0 0 1 0 14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    </span>
  );
}
