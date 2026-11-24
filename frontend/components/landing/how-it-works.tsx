const steps = [
  {
    index: "01",
    title: "Write",
    body: "Type the message on the page. It waits with you until you turn it into a link.",
  },
  {
    index: "02",
    title: "Share",
    body: "Copy one URL and send it in the chat you already use. That link is the only way in.",
  },
  {
    index: "03",
    title: "Vanish",
    body: "The first visit shows the message and deletes it. After that, the link is finished.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-28 bg-wash">
      <div className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
        <div className="reveal max-w-2xl">
          <p className="text-sm font-medium text-accent-ink">How it works</p>
          <h2 className="mt-3 text-[clamp(2rem,4vw,3.25rem)] leading-[1.05] font-medium tracking-[-0.04em] text-ink">
            Three steps, then silence.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-muted">
            A signal exists only in the space between writing it and opening it.
          </p>
        </div>

        <div className="relative mt-14 grid gap-4 md:grid-cols-3">
          <div className="pointer-events-none absolute top-9 right-[16%] left-[16%] hidden md:block" aria-hidden="true">
            <div className="draw-line w-full" />
          </div>
          {steps.map((step, index) => (
            <article
              key={step.index}
              className={`reveal ${index > 0 ? "reveal-late" : ""} relative rounded-3xl border border-line bg-white p-7`}
            >
              <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white">
                <span className="text-gradient text-xs font-medium">{step.index}</span>
              </div>
              <h3 className="mt-8 text-xl font-medium tracking-tight text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
