"use client";

import { useEffect, useState } from "react";
import { SignalGlyph } from "@/components/signal-glyph";
import { openSignalOnce, releaseSignal } from "@/components/try/open-once";
import { useReducedMotion } from "@/components/use-reduced-motion";

const READ_FOR_MS = 12_000;
const BURN_MS = 1400;

type Stage = "opening" | "reading" | "burning" | "destroyed" | "expired" | "missing" | "error";

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function seenKey(id: string) {
  return `chain-signal-seen:${id}`;
}

export function SignalView({ id }: { id: string }) {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState<Stage>("opening");
  const [body, setBody] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const started = performance.now();
    void Promise.resolve().then(async () => {
      if (cancelled) return;
      if (window.sessionStorage.getItem(seenKey(id))) {
        setStage("destroyed");
        return;
      }

      const result = await openSignalOnce(id);
      const hold = Math.max(0, (reduced ? 160 : 720) - (performance.now() - started));
      if (hold > 0) await wait(hold);
      if (cancelled) return;

      if (result.status === "opened") {
        window.sessionStorage.setItem(seenKey(id), "1");
        setBody(result.body);
        setStage("reading");
        return;
      }
      if (result.status === "expired") {
        setStage("expired");
        return;
      }
      if (result.status === "gone") {
        setStage("destroyed");
        return;
      }
      if (result.status === "missing") {
        setStage("missing");
        return;
      }
      setStage("error");
    });

    return () => {
      cancelled = true;
    };
  }, [id, reduced]);

  useEffect(() => {
    if (stage !== "reading" || reduced) return;
    const timer = window.setTimeout(() => setStage("burning"), READ_FOR_MS);
    return () => window.clearTimeout(timer);
  }, [stage, reduced]);

  useEffect(() => {
    if (stage !== "burning") return;
    const timer = window.setTimeout(() => {
      setBody(null);
      releaseSignal(id);
      setStage("destroyed");
    }, reduced ? 0 : BURN_MS);
    return () => window.clearTimeout(timer);
  }, [stage, id, reduced]);

  const live =
    stage === "opening"
      ? "Opening this signal."
      : stage === "reading"
        ? "The message is visible once."
        : stage === "burning"
          ? "The message is being deleted."
          : stage === "destroyed"
            ? "This signal has been destroyed."
            : stage === "expired"
              ? "This signal expired before it was opened."
              : stage === "missing"
                ? "This link does not lead to a signal."
                : "The signal could not be opened.";

  return (
    <div className="signal-frame hero-rise rounded-[28px] p-px shadow-[0_30px_80px_-40px_rgba(80,70,220,0.55)]">
      <div className="flex min-h-[440px] flex-col rounded-[27px] bg-white p-6 sm:min-h-[460px] sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="live-dot" />
            <span className="text-xs font-medium text-muted">Incoming signal</span>
          </div>
          <span className="text-xs font-medium text-accent-ink">{statusLabel(stage)}</span>
        </div>
        <p className="sr-only" aria-live="polite">
          {live}
        </p>

        {stage === "opening" ? <Opening /> : null}
        {stage === "reading" || stage === "burning" ? (
          <Reading
            body={body ?? ""}
            burning={stage === "burning"}
            reduced={reduced}
            onBurn={() => {
              if (reduced) {
                setBody(null);
                releaseSignal(id);
                setStage("destroyed");
                return;
              }
              setStage("burning");
            }}
          />
        ) : null}
        {stage === "destroyed" ? (
          <EndState
            title="This signal has been destroyed"
            body="It was read once and deleted. This link will not open it again."
          />
        ) : null}
        {stage === "expired" ? (
          <EndState
            title="This signal expired"
            body="The clock ran out before anyone opened it. The message was deleted."
            ring
          />
        ) : null}
        {stage === "missing" ? (
          <EndState
            title="Nothing is sealed here"
            body="This link does not lead to a signal."
          />
        ) : null}
        {stage === "error" ? (
          <EndState
            title="The signal could not be opened"
            body="Try the link again in a moment."
          />
        ) : null}
      </div>
    </div>
  );
}

function statusLabel(stage: Stage) {
  if (stage === "opening") return "Opening";
  if (stage === "reading") return "Opened once";
  if (stage === "burning") return "Deleting";
  if (stage === "expired") return "Expired";
  if (stage === "missing" || stage === "error") return "Closed";
  return "Destroyed";
}

function Opening() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white">
        <SignalGlyph className="h-7 w-7" />
      </span>
      <p className="mt-4 text-sm font-medium text-ink">Opening this signal</p>
    </div>
  );
}

function Reading({
  body,
  burning,
  reduced,
  onBurn,
}: {
  body: string;
  burning: boolean;
  reduced: boolean;
  onBurn: () => void;
}) {
  return (
    <div className="pop-in flex flex-1 flex-col">
      <div className="relative flex flex-1 items-center overflow-hidden">
        {burning ? (
          <p className="is-dissolving text-[1.35rem] leading-snug font-medium tracking-tight text-ink">
            {Array.from(body).map((char, index) => (
              <span key={`${index}-${char}`} style={{ animationDelay: `${Math.min(index, 48) * 12}ms` }}>
                {char === " " ? "\u00A0" : char === "\n" ? " " : char}
              </span>
            ))}
          </p>
        ) : (
          <p className="text-[1.35rem] leading-snug font-medium tracking-tight whitespace-pre-wrap break-words text-ink">
            {body}
          </p>
        )}
      </div>
      {burning ? null : (
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-muted">
            <span>{reduced ? "This view will not exist again" : "This view is ending"}</span>
            <button type="button" onClick={onBurn} className="font-medium text-accent-ink transition hover:text-ink">
              End it now
            </button>
          </div>
          {reduced ? null : (
            <div className="h-1.5 overflow-hidden rounded-full bg-wash">
              <div className="drain-read h-full rounded-full bg-gradient-to-r from-accent to-accent-2" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EndState({ title, body, ring = false }: { title: string; body: string; ring?: boolean }) {
  return (
    <div className="destroyed-in flex flex-1 flex-col justify-center">
      {ring ? <ExpireRing /> : (
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white">
          <SignalGlyph />
        </span>
      )}
      <h1 className="mt-5 text-xl font-medium tracking-tight text-ink">{title}</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{body}</p>
      <a
        href="/try"
        className="mt-6 inline-flex w-fit items-center rounded-full bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-medium text-white transition duration-300 hover:brightness-110"
      >
        Write a signal
      </a>
    </div>
  );
}

function ExpireRing() {
  return (
    <svg viewBox="0 0 72 72" className="h-16 w-16" aria-hidden="true">
      <circle cx="36" cy="36" r="28" stroke="#e6e8f0" strokeWidth="3" fill="none" />
      <circle
        className="expire-ring"
        cx="36"
        cy="36"
        r="28"
        stroke="#6d4aff"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
      />
    </svg>
  );
}
