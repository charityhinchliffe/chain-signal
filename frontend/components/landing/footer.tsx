import { Logo } from "@/components/logo";

const links = [
  { href: "/try", label: "Try it out" },
  { href: "#how", label: "How it works" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#theater", label: "Preview" },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
            A message with one life. After it is opened, it is deleted.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto w-full max-w-6xl px-6 py-4 text-xs text-muted">© 2026 Chain Signal</p>
      </div>
    </footer>
  );
}
