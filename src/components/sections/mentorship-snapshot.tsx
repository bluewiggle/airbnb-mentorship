"use client";

import { Section } from "@/components/ui";

const ITEMS = [
  {
    title: "Our complete A-Z Airbnb Arbitrage Blueprint",
    body: "Everything from zero to your first live, profitable property. No gaps, no guesswork.",
    icon: "/Blueprint.png",
  },
  {
    title: "Weekly Group Sessions",
    body: "Join weekly calls where we break down strategy, answer questions, and help you move forward faster alongside others on the same path.",
    icon: "/Group Sessions.png",
  },
  {
    title: "1:1 Progress Calls",
    body: "Work directly with us to stay on track, solve bottlenecks, and get clear guidance based on your exact situation.",
    icon: "/Progress Calls.png",
  },
  {
    title: "24/7 Direct Mentor Access",
    body: "Message us any time. Deal reviews, feedback and any questions. No need for guesswork. Just real answers fast.",
    icon: "/24 7 Access.png",
  },
  {
    title: "Private Discord Community",
    body: "Access to our community of active hosts all on the same path as you. Surround yourself with like-minded individuals.",
    icon: "/Discord.jpg",
  },
];

export function MentorshipSnapshot() {
  return (
    <Section id="mentorship">
      <div className="text-center">
        <h2 className="text-[clamp(34px,4.5vw,48px)] font-extrabold tracking-[-0.03em] text-white/95">
          What’s Included
        </h2>
      </div>

      <div className="mx-auto mt-12 max-w-[900px] flex flex-col gap-5">
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-5 rounded-[20px] border border-white/10 bg-white/5 p-6 transition hover:bg-white/7"
          >
            {/* ICON */}
            <div className="flex-shrink-0 rounded-[14px] border border-white/10 bg-white/5 p-2">
              <img
                src={item.icon}
                alt={item.title}
                className="h-12 w-12 rounded-[10px] object-cover"
              />
            </div>

            {/* TEXT */}
            <div>
              <div className="text-[18px] font-extrabold text-white/95">
                {item.title}
              </div>

              <div className="mt-2 text-[15px] leading-[1.75] text-white/70">
                {item.body}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}