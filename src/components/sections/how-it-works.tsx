"use client";

import { Section } from "@/components/ui";
import { cn } from "@/components/utils";
import { useMemo, useState } from "react";

const STEPS = [
  {
    n: "01",
    title: "Picking The Right Building",
    body: "Pick the wrong building and you can bleed thousands before you realise it. We secure long-term leases, so precision matters. You’ll learn our exact framework to assess demand, model real profit, and eliminate red flags before signing anything.",
    chips: ["Demand analysis", "Profit modelling", "Red flag framework"],
  },
  {
    n: "02",
    title: "Lease Approval Playbook",
    body: "The hardest part isn’t finding properties, it’s convincing someone to approve you. Without knowing exactly what to say, you’ll never secure a lease. We give you the exact pitch structure, objection handling framework, and approval flow that turns conversations into signed agreements.",
    chips: ["Pitch structure", "Objection handling", "Approval framework"],
  },
  {
    n: "03",
    title: "Furnish To Convert",
    body: "You need to know exactly what to buy and what not to waste money on. We show you precisely what guests expect for strong reviews, higher nightly rates, and repeat bookings. Plus, through our niche sourcing strategy, we help you save $4k+ compared to most new Airbnb hosts.",
    chips: ["Guest expectations", "Niche sourcing", "Conversion setup"],
  },
  {
    n: "04",
    title: "Launch + Optimisation System",
    body: "Once it’s set up properly, this shouldn’t consume your life. We show you the exact launch sequence and weekly operating rhythm that stabilises performance, so you can run each property in roughly 1 hour per week. This is what turns one property into a repeatable, scalable portfolio.",
    chips: ["Launch sequence", "Weekly system", "Performance control"],
  },
  {
    n: "05",
    title: "Run It Like Operators",
    body: "This isn’t guesswork. We run on clear profits, performance tracking, and clear decision rules, and we show you exactly how it's done so you’re not living in your inbox reacting to noise. You’ll know exactly what to monitor, when to intervene, and how to scale with control.",
    chips: ["Performance dashboards", "Scorecards", "Decision rules"],
  },
];

export function HowItWorks() {
  const [active, setActive] = useState(0);
  const pct = useMemo(() => (STEPS.length === 1 ? 0 : (active / (STEPS.length - 1)) * 100), [active]);

  return (
    <Section id="how" className="pt-[120px] md:pt-[160px]">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.26em] text-white/72">
          <span className="h-px w-14 bg-white/18" />
          The operating system
          <span className="h-px w-14 bg-white/18" />
        </div>

        <h2 className="mt-6 text-[clamp(44px,6vw,84px)] font-extrabold tracking-[-0.04em] leading-[1.02] text-white/95">
          The exact sequence we used to scale to $1M+ in 1 year.
        </h2>

        <p className="mx-auto mt-4 max-w-[820px] text-[17px] leading-[1.75] text-white/72">
          No guessing. No fluff. You run <span className="font-extrabold text-white/92 underline decoration-accent decoration-2 underline-offset-4">our system</span> step by step.
        </p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-[420px_1fr]">
        {/* Index */}
        <aside className="surface rounded-[28px] p-6 lg:sticky lg:top-[92px]">
          <div className="flex items-center justify-between gap-4">
            <div className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-white/70">Our Process</div>
            <div className="h-2 w-[160px] overflow-hidden rounded-full border border-white/10 bg-white/10">
              <span className="block h-full rounded-full bg-accent shadow-[0_0_0_6px_rgb(var(--accent)/0.12)]" style={{ width: `${pct}%`, transition: "width .28s ease" }} />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s.n}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "w-full rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-0.5",
                  i === active
                    ? "border-accent/50 bg-accent/10 shadow-[0_18px_60px_rgba(0,0,0,0.35)]"
                    : "border-white/10 bg-white/4 hover:bg-white/6 hover:border-white/16"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="min-w-[34px] text-[12px] font-extrabold tracking-[0.22em] text-white/70">{s.n}</div>
                  <div className="text-[15px] font-extrabold text-white/92">{s.title}</div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Panel */}
        <div className="lg:sticky lg:top-[92px]">
          <div className="p-8 md:p-10">
            <div className="flex items-baseline gap-4">
              <div className="text-[12px] font-extrabold tracking-[0.22em] text-white/70">{STEPS[active].n}</div>
              <div className="text-[20px] font-extrabold text-white/95">{STEPS[active].title}</div>
            </div>
            <p className="mt-4 max-w-[820px] text-[16px] leading-[1.75] text-white/74">{STEPS[active].body}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {STEPS[active].chips.map((c) => (
                <span key={c} className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[12px] font-extrabold text-white/78">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
