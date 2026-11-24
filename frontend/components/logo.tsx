export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
          <path d="M4.5 12h2.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M8.4 8.1a5.4 5.4 0 0 1 0 7.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12 5a9.2 9.2 0 0 1 0 14"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.65"
          />
        </svg>
      </span>
      <span className="text-[15px] font-medium tracking-tight text-ink">Chain Signal</span>
    </span>
  );
}
