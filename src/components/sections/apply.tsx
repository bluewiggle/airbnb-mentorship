"use client";

import { ButtonLink, Section } from "@/components/ui";

type Props = {
  onApplyClick: () => void;
};

export function Apply({ onApplyClick }: Props) {
  return (
    <Section id="apply">
      <div className="surface rounded-[28px] px-7 py-10 md:px-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-[1fr_360px] md:items-center">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.22em] text-white/75">
              Applications
            </div>

            <h2 className="mt-5 text-[clamp(30px,3.8vw,48px)] font-extrabold tracking-[-0.03em] leading-[1.08] text-white/95">
              Apply to see if you qualify.
            </h2>

            <p className="mt-3 max-w-[720px] text-[15.5px] leading-[1.8] text-white/72">
              We’ll review your situation, capital, and urgency. If it’s a fit, we’ll map a clean path to your first
              property and a repeatable operating rhythm.
            </p>

            <ul className="mt-6 space-y-2 text-[14.5px] text-white/75">
              {[
                "Selection rules + approval scripts",
                "Weekly execution calls (or biweekly depending on stage)",
                "Direct support between calls",
                "Systems, dashboards, and standards",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="surface rounded-[22px] p-6">
            <div className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-white/70">
              Next step
            </div>
            <div className="mt-2 text-[18px] font-extrabold text-white/95">
              Submit your application
            </div>
            <p className="mt-2 text-[14.5px] leading-[1.7] text-white/72">
              Click below — the application opens without leaving the page.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={onApplyClick}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-accent px-4 py-3 text-[14px] font-extrabold text-black transition will-change-transform hover:-translate-y-0.5 hover:shadow-glow"
              >
                Open application
              </button>

              <ButtonLink href="#mentorship" variant="ghost">
                Review what’s included
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}