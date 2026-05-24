"use client";

import { Section } from "@/components/ui";

const FEATURED_IMAGES = [
  "/Success 1.jpg",
  "/Success 2.jpg",
  "/Success 3.jpg",
  "/Success 4.jpg",
  "/Success 5.jpg",
  "/Success 6.jpg",
  "/Success 7.jpg",
  
];

const MORE_IMAGES = [
  "/Success 8.jpg",
  "/Success 9.jpg",
  "/Success 10.jpg",
  "/Success 11.jpg",
  "/Success 12.jpg",
  "/Success 13.jpg",
  "/Success 14.jpg",
  "/Success 15.jpg",
  "/Success 16.jpg",
  "/Success 17.jpg",
  "/Success 18.jpg",
  "/Success 19.jpg",
  "/Success 20.jpg",
  "/Success 21.jpg",
  "/Success 22.jpg",
  "/Success 23.jpg",
  "/Success 24.jpg",
  "/Success 25.jpg",
  "/Success 26.jpg",
  "/Success 27.jpg",
  "/Success 28.jpg",
  "/Success 29.jpg",
  "/Success 30.jpg",
  "/Success 31.jpg",
  "/Success 32.jpg",
  "/Success 33.jpg",
  "/Success 34.jpg",
  "/Success 35.jpg",
  "/Success 36.jpg",
  "/Success 37.jpg",
  "/Success 38.jpg",
  "/Success 39.jpg",
  "/Success 40.jpg",
  "/Success 41.jpg",
];

function SuccessGrid({ images }: { images: string[] }) {
  return (
    <div className="columns-2 md:columns-3 gap-4 space-y-4">
      {images.map((src, i) => (
        <div
          key={src}
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
  );
}

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

      <div className="mt-7">
        <SuccessGrid images={FEATURED_IMAGES} />
      </div>

      <div className="mt-8 flex justify-center">
        <a
          href="#more-success"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[14px] font-extrabold text-white/85 transition hover:bg-white/10 hover:text-white"
        >
          See more student wins
        </a>
      </div>
    </Section>
  );
}

export function MoreSuccess() {
  return (
    <Section id="more-success">
      <div className="text-center">
        <h2 className="text-[clamp(34px,4.5vw,48px)] font-extrabold tracking-[-0.03em] text-white/95">
          More student wins
        </h2>

        <p className="mt-4 text-white/70 text-[15px]">
          More proof from students taking action inside the mentorship.
        </p>
      </div>

      <div className="mt-7">
        <SuccessGrid images={MORE_IMAGES} />
      </div>
    </Section>
  );
}