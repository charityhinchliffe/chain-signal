type IconProps = { className?: string };

function base(className?: string) {
  return className ?? "h-5 w-5";
}

export function ArrowIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={base(className)} fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" aria-hidden="true">
      <path
        d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" aria-hidden="true">
      <path
        d="M10 13.5a4.2 4.2 0 0 0 6.3.4l2.2-2.2a4.2 4.2 0 0 0-6-6L11.2 7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M14 10.5a4.2 4.2 0 0 0-6.3-.4L5.5 12.3a4.2 4.2 0 0 0 6 6L12.8 17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" aria-hidden="true">
      <rect x="5" y="10.5" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M8 10.5V8a4 4 0 0 1 8 0v2.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DevicesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="12" height="9" rx="1.6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M6 17.5h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="15" y="8.5" width="5.5" height="9" rx="1.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function EraseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={base(className)} fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="7.25" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9.2 9.2 14.8 14.8M14.8 9.2 9.2 14.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
