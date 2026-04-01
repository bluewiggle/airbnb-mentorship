"use client";

import { Section } from "@/components/ui";

const IMAGES = [
  "/Success 1.jpg",
  "/Success 2.jpg",
  "/Success 3.jpg",
  "/Success 4.jpg",
  "/Success 5.jpg",
  "/Success 6.jpg",
];

export function Success() {
  return (
    <Section id="success">
      <div className="text-center">
        <h2 className="text-[clamp(34px,4.5vw,48px)] font-extrabold tracking-[-0.03em] text-white/95">
          Check out our members’ success
        </h2>

        <p className="mt-4 text-white/70 text-[15px]">
          Real results from people following OUR system.
        </p>
      </div>

      {/* MASONRY */}
      <div className="mt-10 columns-2 md:columns-3 gap-4 space-y-4">
        {IMAGES.map((src, i) => (
          <div
            key={i}
            className="break-inside-avoid rounded-[12px] overflow-hidden border border-white/10 bg-white/5"
          >
            <img
              src={src}
              alt={`Success ${i + 1}`}
              className="w-full h-auto object-contain"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}