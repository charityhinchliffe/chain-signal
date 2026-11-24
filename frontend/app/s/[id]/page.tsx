import type { Metadata } from "next";
import { Suspense } from "react";
import { Atmosphere } from "@/components/atmosphere";
import { Navbar } from "@/components/landing/navbar";
import { SignalGlyph } from "@/components/signal-glyph";
import { SignalView } from "@/components/try/signal-view";

export const metadata: Metadata = {
  title: "A signal",
  description: "A Chain Signal link opens once. After that, the message is deleted.",
};

export default function SignalPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <>
      <Navbar />
      <main id="content">
        <Atmosphere>
          <div className="mx-auto flex w-full max-w-xl flex-col justify-center px-6 py-16 md:py-24">
            <Suspense fallback={<OpeningFallback />}>
              <ResolvedSignal params={params} />
            </Suspense>
          </div>
        </Atmosphere>
      </main>
    </>
  );
}

async function ResolvedSignal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SignalView id={id} />;
}

function OpeningFallback() {
  return (
    <div className="signal-frame rounded-[28px] p-px">
      <div className="flex min-h-[440px] flex-col items-center justify-center rounded-[27px] bg-white p-7 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2 text-white">
          <SignalGlyph className="h-7 w-7" />
        </span>
        <p className="mt-4 text-sm font-medium text-ink">Opening this signal</p>
      </div>
    </div>
  );
}
