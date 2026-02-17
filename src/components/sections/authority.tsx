"use client";

import { Section } from "@/components/ui";
import { useInView } from "@/components/hooks/use-in-view";
import { useEffect, useMemo, useState } from "react";

function formatAU(n: number) {
  return Math.round(n).toLocaleString("en-AU");
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function useCountUp(target: number, enabled: boolean, durationMs = 2000) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!enabled) return;

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = easeInOutCubic(t);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled, target, durationMs]);

  return val;
}

export function Authority() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.2, rootMargin: "0px 0px -20% 0px" });

  const rev = useCountUp(999999, inView);
  const props = useCountUp(11, inView);
  const stays = useCountUp(1000, inView);

  const items = useMemo(() => ([
    { label: "Revenue generated", display: `$${formatAU(rev)}`, final: "$1M+" },
    { label: "Active properties", display: formatAU(props) },
    { label: "Guest stays hosted", display: `${formatAU(stays)}+` },
  ]), [rev, props, stays]);

  return (
    <Section className="pt-0">
      <div ref={ref} className="surface rounded-[28px] px-6 py-12 md:px-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.22em] text-white/75">
            Real operators • Real portfolios • Real systems
          </div>

          <h2 className="mt-6 text-[clamp(32px,4.2vw,52px)] font-extrabold tracking-[-0.03em] text-white/95 leading-[1.08]">
            The fastest way to start
            <br />
            is learning from operators who’ve done it.
          </h2>

          <p className="mx-auto mt-4 max-w-[760px] text-[15.5px] leading-[1.75] text-white/72">
            Get direct access to mentors who’ve built and operate real Airbnb portfolios, not people who only teach it.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="rounded-[22px] border border-white/12 bg-white/5 px-6 py-7 shadow-[0_26px_70px_rgba(0,0,0,0.28)]"
            >
              <div className="h-[58px] text-center text-[42px] font-extrabold tracking-[-0.02em] text-white/95 tabular-nums">
                {idx === 0 ? (inView ? it.final : it.display) : it.display}
              </div>
              <div className="mt-2 text-center text-[12px] font-extrabold uppercase tracking-[0.18em] text-white/55">
                {it.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center text-[14px] font-semibold text-white/80">
          We walked the path so that you can skip the mistakes, cut years off your learning curve, and get to profit faster.
        </div>
      </div>
    </Section>
  );
}
