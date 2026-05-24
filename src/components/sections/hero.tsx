"use client";

import { H1, P, Section } from "@/components/ui";
import { trackMetaCustom } from "@/lib/track";

type Props = {
  onApplyClick: () => void;
};


// Melbourne time
const melbourneNow = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Australia/Melbourne" })
);

const day = melbourneNow.getDate();
const year = melbourneNow.getFullYear();
const monthIndex = melbourneNow.getMonth();
const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

const startSpots = 7;
const endSpots = 2;

const progress = (day - 1) / (daysInMonth - 1);
const spotsLeft = Math.round(
  startSpots - progress * (startSpots - endSpots)
);

export function Hero({ onApplyClick }: Props) {
  return (
    <Section id="top" className="pt-[95px] md:pt-[115px] pb-[50px] md:pb-[70px]">
      <div className="text-center">
        <H1>
          Build a real business,
          <br />
          not a <span className="italic">side hustle.</span>
        </H1>

        <P className="mx-auto mt-6 max-w-[860px] text-[16.5px]">
          Start generating $10k+/m with Airbnb Arbitrage. We show you exactly how to secure, set up and scale profitable properties without wasting time or money.
        </P>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href="#guarantee"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-accent px-5 py-3 text-[14px] font-extrabold text-black transition will-change-transform hover:-translate-y-0.5 hover:shadow-glow"
          >
            SEE THE GUARANTEE
          </a>

          <a
            href="#success"
            className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[14px] font-extrabold text-white/80 hover:bg-white/10 hover:text-white"
          >
            See student results
          </a>
        </div>

        <div className="mt-5 text-[13px] font-semibold text-white/60">
          The application is directly below. Only{" "}
          <span className="text-white/85">{spotsLeft} spots</span> left this month.
        </div>
      </div>
    </Section>
  );
}