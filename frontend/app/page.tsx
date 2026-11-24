import { Capabilities } from "@/components/landing/capabilities";
import { Closing } from "@/components/landing/closing";
import { Footer } from "@/components/landing/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Marquee } from "@/components/landing/marquee";
import { Navbar } from "@/components/landing/navbar";
import { PromiseBand } from "@/components/landing/promise";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="content">
        <Hero />
        <Marquee />
        <HowItWorks />
        <Capabilities />
        <PromiseBand />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
