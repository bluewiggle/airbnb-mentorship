"use client";

import { Section } from "@/components/ui";
import { useState } from "react";
import { cn } from "@/components/utils";

const FAQS = [
  {
    q: "How much money do I need to start?",
    a: "Our students get their first property up and running for around $10k all in. This can be more or less depending on how resourceful you are.",
  },
  {
    q: "How much time does this require?",
    a: "Once your property is set up and automated, it runs with minimal daily input. Many of our students run this alongside a full-time job, while others do it full time. Either way, the system is built to work around your life.",
  },
  {
    q: "Do I need prior business experience?",
    a: "No. The program is built for everyday people who are ready to make a change and start a real business. If you can follow a system and take action, you have everything you need.",
  },
  {
    q: "Is this legal?",
    a: "Yes. Airbnb arbitrage is legal. The key is getting written permission to sublet from your landlord, which is all part of our process from day one.",
  },
  {
    q: "How much can I expect to earn from one property?",
    a: "Our students make between $2000-$5000 profit per month for each property once they are up and running. Some months can be bigger depending on the season and booking length. One property can replace a part-time income. Multiple can match a full-time salary. That’s the power of Airbnb arbitrage.",
  },
  {
    q: "How long until I see results?",
    a: "Most of our students secure their first property within their first 30 days. Once listed, you can expect to instantly get bookings and start receiving payouts to your bank account the same week.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.26em] text-white/72">
          <span className="h-px w-14 bg-white/18" />
          FAQ
          <span className="h-px w-14 bg-white/18" />
        </div>

        <h2 className="mt-6 text-[clamp(34px,4.5vw,46px)] font-extrabold tracking-[-0.03em] text-white/95">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="mx-auto mt-10 max-w-[980px] space-y-3">
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
                    "relative flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/6 transition",
                    isOpen ? "rotate-45 border-accent/40 bg-accent/10" : ""
                  )}
                  aria-hidden
                >
                  <span className="block h-[2px] w-4 bg-white/80" />
                  <span className="absolute block h-4 w-[2px] bg-white/80" />
                </span>
              </button>

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-200",
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="pt-3 text-[14.5px] leading-[1.75] text-white/72">
                    {f.a}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}