"use client";

import { Section } from "@/components/ui";
import { useInView } from "@/components/hooks/use-in-view";
import { cn } from "@/components/utils";

export function Problem() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4, rootMargin: "0px 0px -20% 0px" });

  return (
    <Section>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr]">
        <div>
          <h2 className="text-[clamp(34px,5vw,64px)] font-extrabold tracking-[-0.04em] leading-[1.05] text-white/95">
            Why most people stay stuck.
          </h2>
          <div className="mt-4 text-[18px] font-semibold text-white/70 leading-[1.4]">
            Everyone is willing to put in the effort.
            <br />
            But many people don't know where to start.
          </div>

          <div className="mt-10 flex flex-col gap-4">
            {[
              {
                n: "01",
                title: "Information overload",
                desc:
                  "You consume content all day and still don’t know what to do first. Without a sequence, you stay stuck at the starting line.",
              },
              {
                n: "02",
                title: "Costly early mistakes",
                desc:
                  "We lost $10,000+ early from avoidable errors. Wrong buildings. Setup decisions. Missed details. Most beginners don’t recover from that hit.",
                highlight: true,
              },
              {
                n: "03",
                title: "No repeatable model",
                desc:
                  "Without structure, people bounce between ideas. They chase random “side hustles” instead of a model that scales.",
              },
            ].map((c) => (
              <div
                key={c.n}
                className={cn(
                  "rounded-[22px] border px-7 py-7 shadow-[0_26px_70px_rgba(0,0,0,0.28)] transition hover:-translate-y-1",
                  c.highlight
                    ? "border-accent/40 bg-white/7"
                    : "border-white/12 bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="text-[12px] font-extrabold tracking-[0.22em] text-white/60">{c.n}</div>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
                <div className="mt-4 text-[18px] font-extrabold text-white/95">{c.title}</div>
                <div className="mt-2 text-[15px] leading-[1.7] text-white/72">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="text-[18px] font-extrabold text-white/90">Airbnb works because the path is clear</div>
          <div className="mt-1 text-[13px] font-semibold text-white/55">Scaling isn’t guessing. It’s repetition.</div>

          <div ref={ref} className="mt-6 rounded-[26px] border border-white/12 bg-white/5 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.38)]">
            <div className="relative h-[320px] md:h-[380px]">
              <div className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                  backgroundSize: "90px 90px",
                }}
              />
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 108 46"
                preserveAspectRatio="xMidYMid meet"
                aria-hidden="true"
              >
                <polyline
                  points="14,41 32,32 54,26 76,15 94,6"
                  fill="none"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={cn("transition-[stroke-dashoffset] duration-[1600ms] ease-[cubic-bezier(.2,.9,.2,1)]",
                    inView ? "stroke-dashoffset-0" : "")}
                  style={{
                    strokeDasharray: 220,
                    strokeDashoffset: inView ? 0 : 220,
                  }}
                />
                <g
                  className={cn(
                    "transition duration-500",
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-0.5"
                  )}
                  style={{ transitionDelay: "600ms" }}
                >
                  {[
                    { x: 14, y: 41, t: "Secure" },
                    { x: 32, y: 32, t: "Furnish" },
                    { x: 54, y: 26, t: "List" },
                    { x: 76, y: 15, t: "Optimise" },
                    { x: 94, y: 6, t: "Repeat" },
                  ].map((d, i) => (
                    <g key={i}>
                      <circle cx={d.x} cy={d.y} r="2.8" fill="rgb(var(--accent) / 1)" />
                      <circle cx={d.x} cy={d.y} r="6.8" fill="rgb(var(--accent) / 0.16)" />
                      <text x={d.x} y={d.y - 3} textAnchor="middle" fontSize="4" fontWeight="700" fill="rgba(255,255,255,0.9)">
                        {d.t}
                      </text>
                    </g>
                  ))}
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
