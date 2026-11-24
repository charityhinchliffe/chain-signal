"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  { href: "/#how", label: "How it works" },
  { href: "/#capabilities", label: "Capabilities" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-white/80 backdrop-blur-xl">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="Chain Signal, home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm text-muted transition-colors hover:text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-gradient-to-r after:from-accent after:to-accent-2 after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/try"
            className="inline-flex items-center rounded-full bg-gradient-to-r from-accent to-accent-2 px-4 py-2 text-sm font-medium text-white transition duration-300 hover:brightness-110"
          >
            Try it out
          </Link>
        </nav>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full border border-line md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          <span className="flex w-4 flex-col gap-1.5" aria-hidden="true">
            <span
              className={`h-px w-full bg-ink transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`h-px w-full bg-ink transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>
      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-2 py-3 text-sm text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/try"
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-accent to-accent-2 px-4 py-3 text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              Try it out
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
