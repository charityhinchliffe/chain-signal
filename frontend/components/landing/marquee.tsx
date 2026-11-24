const items = [
  "Door codes",
  "Temporary addresses",
  "Recovery keys",
  "One-time passwords",
  "Private notes",
  "Meeting points",
  "Quiet messages",
  "Handover details",
];

export function Marquee() {
  return (
    <section
      className="border-y border-line"
      aria-label="Messages people send for a single reading"
    >
      <div className="overflow-hidden py-4 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex items-center gap-3 pr-3" aria-hidden={copy === 1}>
              <li className="rounded-full px-4 py-2 text-sm font-medium">
                <span className="text-gradient">For a single reading</span>
              </li>
              {items.map((item) => (
                <li
                  key={`${copy}-${item}`}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm whitespace-nowrap text-ink"
                >
                  {item}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
