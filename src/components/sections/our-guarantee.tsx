"use client";

import { Section } from "@/components/ui";

export function OurGuarantee() {
  return (
    <Section id="guarantee">
      <div className="text-center">
        {/* Label */}
        <div className="inline-flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.26em] text-white/70">
          <span className="h-px w-14 bg-white/18" />
          Our Guarantee
          <span className="h-px w-14 bg-white/18" />
        </div>

        {/* Heading (smaller) */}
        <h2 className="mt-6 text-[clamp(32px,4.5vw,56px)] font-extrabold tracking-[-0.04em] leading-[1.08] text-white/95">
          Get 2 properties live in 60 days
          <br />
          or we work with you for free until you do
        </h2>

        {/* IMAGE (bigger, centered) */}
        <div className="mt-10 flex justify-center">
          <img
            src="/60 Day Guarantee.png"
            alt="60 Day Guarantee"
            className="w-[220px] md:w-[300px] lg:w-[360px] h-auto object-contain"
          />
        </div>

        {/* Subtext */}
        <p className="mx-auto mt-10 max-w-[780px] text-[16px] leading-[1.8] text-white/72">
          We’ve never had to honour this. There’s a reason.
          Our systems remove guesswork and give you a clear path from day one.
          If you follow the process and take action, results aren’t optional.
        </p>
      </div>
    </Section>
  );
}