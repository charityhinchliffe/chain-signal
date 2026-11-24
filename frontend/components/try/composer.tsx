"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowIcon } from "@/components/landing/icons";
import { SignalGlyph } from "@/components/signal-glyph";
import { useReducedMotion } from "@/components/use-reduced-motion";
import type { TtlChoice } from "@/lib/signals";

const MAX_LENGTH = 2000;

const options: { id: TtlChoice; label: string; detail: string }[] = [
  {
    id: "15s",
    label: "15 seconds",
    detail: "If nobody opens it within 15 seconds, the message is deleted.",
  },
  {
    id: "1h",
    label: "1 hour",
    detail: "If nobody opens it within an hour, the message is deleted.",
  },
  {
    id: "24h",
    label: "24 hours",
    detail: "If nobody opens it within 24 hours, the message is deleted.",
  },
  {
    id: "open",
    label: "Until opened",
    detail: "The message stays sealed until someone opens the link.",
  },
];

type Phase = "compose" | "sealing" | "ready" | "ending" | "expired" | "opened";

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function formatRemaining(ms: number) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  const minutes = Math.ceil(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
}

export function Composer() {
  const reduced = useReducedMotion();
  const [message, setMessage] = useState("");
  const [ttl, setTtl] = useState<TtlChoice>("1h");
  const [phase, setPhase] = useState<Phase>("compose");
  const [error, setError] = useState("");
  const [link, setLink] = useState("");
  const [signalId, setSignalId] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(0);
  const generation = useRef(0);

  const selected = options.find((option) => option.id === ttl) ?? options[1];
  const remaining = expiresAt === null ? null : expiresAt - now;

  useEffect(() => {
    if (phase !== "ready" || expiresAt === null) return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [phase, expiresAt]);

  useEffect(() => {
    if (phase !== "ready" || expiresAt === null) return;
    const token = generation.current;
    const timer = window.setTimeout(() => {
      void (async () => {
        setPhase("ending");
        let status = "pending";
        for (let attempt = 0; attempt < 6 && status === "pending"; attempt += 1) {
          try {
            const response = await fetch(`/api/signals/${signalId}/expire`, {
              method: "POST",
              cache: "no-store",
            });
            const data = (await response.json()) as { status?: string };
            status = data.status ?? "expired";
          } catch {
            status = "expired";
          }
          if (status === "pending") await wait(400);
        }
        if (token !== generation.current) return;
        if (!reduced) await wait(650);
        if (token !== generation.current) return;
        setPhase(status === "gone" ? "opened" : "expired");
      })();
    }, Math.max(0, expiresAt - Date.now()));

    return () => window.clearTimeout(timer);
  }, [phase, expiresAt, signalId, reduced]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (phase === "sealing") return;
    setError("");
    setCopied(false);
    setPhase("sealing");
    const started = performance.now();

    try {
      const response = await fetch("/api/signals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: message, ttl }),
      });
      const data = (await response.json()) as { id?: string; expiresAt?: number | null; error?: string };
      if (!response.ok || !data.id) {
        throw new Error(data.error || "The signal could not be created.");
      }

      const hold = (reduced ? 180 : 1100) - (performance.now() - started);
      if (hold > 0) await wait(hold);

      const url = `${window.location.origin}/s/${data.id}`;
      setSignalId(data.id);
      setLink(url);
      setExpiresAt(typeof data.expiresAt === "number" ? data.expiresAt : null);
      setNow(Date.now());
      setPhase("ready");
    } catch (cause) {
      setPhase("compose");
      setError(cause instanceof Error ? cause.message : "The signal could not be created.");
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Copy the link from the field.");
    }
  }

  function reset() {
    generation.current += 1;
    setPhase("compose");
    setMessage("");
    setLink("");
    setSignalId("");
    setExpiresAt(null);
    setError("");
    setCopied(false);
  }

  return (
    <div className="signal-frame hero-rise-late rounded-[28px] p-px shadow-[0_30px_80px_-40px_rgba(80,70,220,0.55)]">
      <div className="rounded-[27px] bg-white p-6 sm:p-7">
        {phase === "compose" || phase === "sealing" ? (
          <form onSubmit={onSubmit}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="live-dot" />
                <span className="text-xs font-medium text-muted">
                  {phase === "sealing" ? "Sealing" : "New signal"}
                </span>
              </div>
              <span className="text-xs text-muted">{message.trim().length}/{MAX_LENGTH}</span>
            </div>

            <label htmlFor="message" className="mt-5 block text-lg font-medium tracking-tight text-ink">
              Your message
            </label>

            <div className="relative mt-4">
              <textarea
                id="message"
                value={message}
                maxLength={MAX_LENGTH}
                disabled={phase === "sealing"}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Write something that should exist once."
                className={`h-40 w-full resize-none rounded-2xl bg-wash px-4 py-4 text-[17px] leading-7 tracking-tight text-ink outline-none placeholder:text-muted/70 focus-visible:ring-2 focus-visible:ring-accent/40 ${
                  phase === "sealing" ? "text-transparent" : ""
                }`}
              />
              {phase === "sealing" ? (
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl bg-wash px-4 py-4">
                  <p className="is-dissolving text-[17px] leading-7 tracking-tight text-ink">
                    {Array.from(message.trim() || " ").map((char, index) => (
                      <span key={`${char}-${index}`} style={{ animationDelay: `${Math.min(index, 36) * 14}ms` }}>
                        {char === " " ? "\u00A0" : char}
                      </span>
                    ))}
                  </p>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/55 backdrop-blur-[2px]">
                    <ExpireRing />
                    <p className="mt-3 text-sm font-medium text-ink">Sealing this signal</p>
                  </div>
                </div>
              ) : null}
            </div>

            <fieldset className="mt-5" disabled={phase === "sealing"}>
              <legend className="text-xs font-medium text-muted">Expiration</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {options.map((option) => {
                  const active = option.id === ttl;
                  return (
                    <label
                      key={option.id}
                      className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
                        active
                          ? "bg-gradient-to-r from-accent to-accent-2 text-white"
                          : "bg-wash text-muted hover:text-ink"
                      }`}
                    >
                      <input
                        type="radio"
                        name="ttl"
                        value={option.id}
                        checked={active}
                        onChange={() => setTtl(option.id)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  );
                })}
              </div>
              <p key={ttl} className="pop-in mt-3 text-sm leading-6 text-muted">
                {selected.detail} The first open deletes it either way.
              </p>
            </fieldset>

            {error ? (
              <p role="alert" className="mt-4 text-sm text-accent-ink">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3">
              <p className="text-xs text-muted">One link. One open.</p>
              <button
                type="submit"
                disabled={phase === "sealing" || message.trim().length === 0}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-medium text-white transition duration-300 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {phase === "sealing" ? "Sealing" : "Create link"}
                <ArrowIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-disabled:translate-x-0" />
              </button>
            </div>
          </form>
        ) : null}

        {phase === "ready" ? (
          <div className="pop-in">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="live-dot" />
                <span className="text-xs font-medium text-muted">Ready to send</span>
              </div>
              <span className="text-xs font-medium text-accent-ink">
                {remaining === null ? "Until opened" : `Expires in ${formatRemaining(remaining)}`}
              </span>
            </div>
            <h2 className="mt-5 text-lg font-medium tracking-tight text-ink">Your link</h2>
            <div className="mt-4 rounded-2xl border border-line bg-wash px-4 py-4">
              <p className="text-[11px] font-medium tracking-wide text-muted uppercase">Single-use link</p>
              <p className="mt-2 font-mono text-sm break-all text-ink">{link.replace(/^https?:\/\//, "")}</p>
              <div className="draw-once mt-4 h-px w-full bg-gradient-to-r from-accent to-accent-2" />
            </div>
            {expiresAt !== null && remaining !== null ? (
              <div className="mt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-wash">
                  <div
                    className="drain-custom h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                    style={{ animationDuration: `${Math.max(remaining, 0)}ms` }}
                  />
                </div>
              </div>
            ) : null}
            <p className="mt-4 text-sm leading-6 text-muted">
              Send this once. Opening it shows the message and then deletes it.
            </p>
            {error ? (
              <p role="alert" className="mt-3 text-sm text-accent-ink">
                {error}
              </p>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void copyLink()}
                className="inline-flex items-center rounded-full bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-medium text-white transition duration-300 hover:brightness-110"
              >
                {copied ? "Copied" : "Copy link"}
              </button>
              <a
                href={link}
                className="inline-flex items-center rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition duration-300 hover:border-accent/30"
              >
                Open it once
              </a>
              <button
                type="button"
                onClick={reset}
                className="px-2 py-2 text-sm font-medium text-muted transition hover:text-ink"
              >
                Write another
              </button>
            </div>
          </div>
        ) : null}

        {phase === "ending" ? (
          <div className="flex min-h-72 flex-col items-center justify-center text-center">
            <ExpireRing />
            <p className="mt-4 text-sm font-medium text-ink">The fuse is ending</p>
          </div>
        ) : null}

        {phase === "expired" || phase === "opened" ? (
          <div className="pop-in flex min-h-72 flex-col items-start justify-center">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white">
              <SignalGlyph />
            </span>
            <h2 className="mt-5 text-lg font-medium tracking-tight text-ink">
              {phase === "opened" ? "This signal was opened" : "This signal expired"}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-muted">
              {phase === "opened"
                ? "Someone opened the link. The message was shown once and then deleted."
                : "The clock ran out before anyone opened it. The message was deleted."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 inline-flex items-center rounded-full bg-gradient-to-r from-accent to-accent-2 px-4 py-2.5 text-sm font-medium text-white transition duration-300 hover:brightness-110"
            >
              Write another
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ExpireRing() {
  return (
    <svg viewBox="0 0 72 72" className="h-14 w-14" aria-hidden="true">
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
