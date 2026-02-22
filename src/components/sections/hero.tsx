"use client";

import { ButtonLink, H1, P, Section } from "@/components/ui";

// Melbourne time
const melbourneNow = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Australia/Melbourne" })
);

const day = melbourneNow.getDate();

const melbourneMonth = new Intl.DateTimeFormat("en-AU", {
  month: "long",
  timeZone: "Australia/Melbourne",
}).format(melbourneNow);

const year = melbourneNow.getFullYear();
const monthIndex = melbourneNow.getMonth();
const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
const firstThird = Math.ceil(daysInMonth / 3);

const isFirstThird = day <= firstThird;

export function Hero() {
  return (
    <Section id="top" className="pt-[110px] md:pt-[140px]">
      <div className="text-center">
        <H1>
          Build a real business,
          <br />
          not a <span className="italic">side hustle.</span>
        </H1>

        <P className="mx-auto mt-6 max-w-[860px] text-[16.5px]">
          Surround yourself with driven beginners and experienced operators alike, all securing properties, scaling portfolios, and building real businesses side by side.
        </P>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="#apply" variant="primary">
            Apply to see if you qualify
          </ButtonLink>
          <ButtonLink href="#how" variant="ghost">
            See the process
          </ButtonLink>
        </div>

        <div className="mt-6 text-[13px] font-semibold text-white/60">
          {isFirstThird ? (
            <>
              <span className="text-white/85">{melbourneMonth}</span>{" "}
              enrollment is now open.
            </>
          ) : (
            <>
              Applications for{" "}
              <span className="text-white/85">{melbourneMonth}</span>{" "}
              are almost closed.
            </>
          )}
        </div>
      </div>
    </Section>
  );
}