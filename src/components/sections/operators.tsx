import Image from "next/image";
import { Section } from "@/components/ui";

function Founder({
  name,
  body,
  reverse,
  img,
}: {
  name: string;
  body: string;
  reverse?: boolean;
  img: string;
}) {
  return (
    <div className={"grid gap-6 lg:grid-cols-2 lg:gap-9 " + (reverse ? "lg:[&>*:first-child]:order-2" : "")}>
      <div className="relative overflow-hidden rounded-[28px] border border-white/12 shadow-[0_40px_110px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/75" />
        <div
          className="absolute inset-0 opacity-60"
          style={{ background: "radial-gradient(circle at 18% 20%, rgb(var(--accent)/0.22), transparent 48%)" }}
        />
        <Image src={img} alt={name} width={920} height={1100} className="h-full w-full object-cover" />
        <div className="absolute bottom-5 left-5 right-5">
          <div className="mt-3 text-[34px] font-extrabold tracking-[-0.02em] text-white/95">{name}</div>
          <div className="mt-1 text-[12px] font-extrabold uppercase tracking-[0.18em] text-white/75">Co-Founder</div>
        </div>
      </div>

      <div className="flex flex-col justify-center text-center lg:text-left">
        <h3 className="text-[clamp(30px,3.3vw,46px)] font-extrabold tracking-[-0.03em] leading-[1.08] text-white/95">
          {name} <span className="text-white/55">|</span> Co-Founder
        </h3>

        <div className="mt-4 text-[15.5px] leading-[1.85] text-white/72">
          <p>{body}</p>
        </div>
      </div>
    </div>
  );
}

export function Operators() {
  return (
    <Section id="operators">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.26em] text-white/70">
          <span className="h-px w-14 bg-white/18" />
          Our story
          <span className="h-px w-14 bg-white/18" />
        </div>

        <h2 className="mt-4 text-[clamp(44px,6vw,76px)] font-extrabold tracking-[-0.05em] leading-[1.00] text-white/95">
          Built by people actually doing it
        </h2>

        <p className="mx-auto mt-4 max-w-[880px] text-[16.5px] leading-[1.7] text-white/72">
          At 21 years old, we built a 15-property Airbnb portfolio across Melbourne in under 12 months. We made the mistakes and figured out what actually works. We started BNBLAB to give others the system we wish we had from day one.
        </p>
      </div>

      <div className="mt-9 flex flex-col gap-10">
        <Founder
          name="Noah"
          body="Hi, my name is Noah. I specialise in handling the day to day operations. This includes cleaning coordination, guest communications, furnishing rollout and automating the workflows that keep everything running systematically."
          img="/Noah_Mentor.png"
        />
        <Founder
          reverse
          name="Liam"
          body="Hi, my name is Liam. I specialise in handling property selection, agent outreach, lease approvals and pricing strategy. Everything it takes to get the right property secured and maximise its performance."
          img="/Liam_Mentor.png"
        />
      </div>
    </Section>
  );
}