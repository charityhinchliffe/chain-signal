export function SignalGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
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
  );
}
