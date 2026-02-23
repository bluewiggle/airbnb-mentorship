"use client";

import Image from "next/image";
import { H2, P, Section } from "@/components/ui";

type Props = {
  onApplyClick?: () => void;
};

export function MentorshipSnapshot({ onApplyClick }: Props) {
  return (
    <Section id="mentorship" className="pt-0">
      <div className="text-center">
        <H2>What you get inside 1:1 Airbnb mentorship</H2>
        <P className="mx-auto mt-3 max-w-[860px]">
          Nothing generic. Just direct operator support to get your first (and next) property live — fast.
        </P>
      </div>

      <div className="mt-10 surface rounded-[26px] p-7 md:p-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          {/* LEFT */}
          <div className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
            <div className="inline-flex rounded-full border border-white/16 bg-white/8 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-white/86">
              1:1 Airbnb mentorship
            </div>

            <h3 className="mt-4 text-[clamp(22px,2.5vw,32px)] font-extrabold tracking-[-0.02em] leading-[1.12] text-white/95">
              Learn 1:1 from real operators
              <br />
              who run Airbnb portfolios — daily.
            </h3>

            <P className="mt-3 max-w-[560px]">
              Calls, message support, and a clear weekly plan so you always know what to do next. No fluff. No guessing.
              Just execution.
            </P>

            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <button
                onClick={onApplyClick}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-accent px-5 py-3 text-[14px] font-extrabold text-black transition will-change-transform hover:-translate-y-0.5 hover:shadow-glow"
              >
                Apply now
              </button>

              <a
                href="#mentors"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[14px] font-extrabold text-white/80 hover:bg-white/10 hover:text-white"
              >
                View mentors
              </a>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-[560px]">
              <div className="overflow-hidden rounded-[18px] border border-white/14 bg-black/20 shadow-[0_28px_90px_rgba(0,0,0,0.45)]">
                <Image
                  src="/Mentorship_call.jpg"
                  alt="Mentorship Snapshot"
                  width={900}
                  height={520}
                  className="h-auto w-full opacity-95"
                />
              </div>

              <div className="absolute left-2 bottom-2 w-[130px] sm:w-[170px] md:w-[200px]
                              lg:-left-3 lg:bottom-3 lg:w-[220px]
                              overflow-hidden rounded-[14px] border border-white/14 bg-black/20
                              shadow-[0_22px_70px_rgba(0,0,0,0.42)]">
                <Image
                  src="/Mentorship_call_1.png"
                  alt="Mentor call screen share preview"
                  width={220}
                  height={140}
                  className="h-auto w-full opacity-95"
                />
              </div>

              <div className="absolute right-2 top-2 w-[130px] sm:w-[170px] md:w-[200px]
                              lg:-right-3 lg:top-4 lg:w-[220px]
                              overflow-hidden rounded-[14px] border border-white/14 bg-black/20
                              shadow-[0_22px_70px_rgba(0,0,0,0.42)]">
                <Image
                  src="/Mentorship_call_2.png"
                  alt="Another mentor call screen share previe"
                  width={220}
                  height={140}
                  className="h-auto w-full opacity-95"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {[
          {
            name: "Jordan",
            meta: "First property live in 24 days",
            text: "The weekly plan was everything. No more guessing, just execution.",
          },
          {
            name: "Sasha",
            meta: "Lease approved after 3 rejections",
            text: "Their agent scripts and building filters saved me from signing a bad deal.",
          },
          {
            name: "Aaron",
            meta: "Stabilised to consistent bookings",
            text: "We fixed the setup and pricing fast. Nights booked jumped immediately.",
          },
        ].map((r) => (
          <div key={r.name} className="surface rounded-[22px] p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[14px] font-extrabold text-white/95">{r.name}</div>
              <div className="text-[12px] font-extrabold tracking-[0.1em] text-white/80">
                ★★★★★
              </div>
            </div>

            <div className="mt-1 text-[12px] font-semibold text-white/55">
              {r.meta}
            </div>

            <p className="mt-3 text-[14.5px] leading-[1.75] text-white/72">
              “{r.text}”
            </p>
          </div>
        ))}
      </div>

      {/* Cloud */}
      <div className="mt-4 surface rounded-[22px] p-7">
        <div className="text-center">
          <div className="text-[20px] font-extrabold text-white/95">
            Support across the whole Airbnb process
          </div>
          <div className="mt-2 text-[14.5px] leading-[1.7] text-white/70">
            Everything you need to go from “no property” → “stable performer” → “repeat”.
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            "Building Selection Map",
            "Estimated Revenue Tool",
            "Profit Forecast Calculator",
            "Agent Pitch Scripts",
            "Lease Negotiation Tactics",
            "Furnishing Plan",
            "Supplier List",
            "Listing Setup",
            "World Class Pricing Strategy",
            "Photos Checklist",
            "Guest Messaging Templates",
            "Optimised Systems",
            "Turnover Operation Guide",
            "5-Star Review Framework",
            "Scaling Plan",
            "And more",
          ].map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[13px] font-extrabold text-white/80"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}