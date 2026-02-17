"use client";

import { Section } from "@/components/ui";
import { useState } from "react";
import { cn } from "@/components/utils";

const FAQS = [
  {
    q: "How much capital do I need?",
    a: "For a 2 bedroom, this is around $6-7k Most beginners spend $2-4k per property on furnishing. So total is around $8-11k per property to start. However this can be drastically reduced with less bedrooms + properties that are already furnished.",
  },
  {
    q: "How much time does this require?",
    a: "We teach you systems to run each property as passive as possible. You shouldn't be living in your inbox. Once stabilised, you can run each property with around 1 hour per week. The hard part is the launch phase, which requires more time and attention to get right.",
  },
  {
    q: "Can this work in my city?",
    a: "Airbnb has shown to be profitable in all cities in Australia. So it doesn't matter where you are, as long as you have the capital and willingness to execute, we will give you a tailored course for your city.",
  },
  {
    q: "What if I’ve never run a business before?",
    a: "The model is execution-based, not theory-based. You don’t need experience, you need structure, speed, and willingness to operate properly.",
  },
  {
    q: "How long until results?",
    a: "Once listed, you will instantly get bookings as long as you set it up via our framework.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.26em] text-white/72">
          <span className="h-px w-14 bg-white/18" />
          FAQs
          <span className="h-px w-14 bg-white/18" />
        </div>
        <h2 className="mt-6 text-[clamp(34px,4.5vw,46px)] font-extrabold tracking-[-0.03em] text-white/95">
          Short answers. Clear expectations.
        </h2>
      </div>

      <div className="mt-10 mx-auto max-w-[980px] space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="surface rounded-[18px] px-5 py-4">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 text-left"
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="text-[15px] font-extrabold text-white/95">{f.q}</span>
                <span
                  className={cn(
                    "h-9 w-9 rounded-full border border-white/12 bg-white/6 flex items-center justify-center transition",
                    isOpen ? "rotate-45 border-accent/40 bg-accent/10" : ""
                  )}
                  aria-hidden
                >
                  <span className="block h-[2px] w-4 bg-white/80" />
                  <span className="absolute block h-4 w-[2px] bg-white/80" />
                </span>
              </button>

              <div className={cn("grid transition-[grid-template-rows] duration-200", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <div className="pt-3 text-[14.5px] leading-[1.75] text-white/72">{f.a}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
