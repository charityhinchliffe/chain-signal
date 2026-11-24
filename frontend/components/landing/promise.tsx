export function PromiseBand() {
  return (
    <section className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-6 pb-8 md:pb-12">
        <div className="reveal hairline-flow rounded-[28px] p-px">
          <div className="rounded-[27px] bg-white px-7 py-12 md:px-14 md:py-16">
            <p className="text-sm font-medium text-accent-ink">The promise</p>
            <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4.4vw,3.6rem)] leading-[1.05] font-medium tracking-[-0.04em] text-ink">
              The first open is the last one.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-muted md:text-lg">
              Chain Signal deletes the message when the link is opened. It cannot be viewed,
              recovered, or opened a second time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
