import { Section } from "@/components/ui";

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
          We built a 15-property Airbnb portfolio across Melbourne in under 12 months. We made the mistakes and figured out what actually works. We started BNB Lab to give others the system we wish we had from day one.
        </p>

        <p className="mx-auto mt-4 max-w-[880px] text-[16.5px] leading-[1.7] text-white/72">
          That hands-on experience — cleaning coordination, guest communications, furnishing rollout, property selection, agent outreach, lease approvals, pricing strategy, and the automation that ties it all together — is what BNB Lab is built on.
        </p>
      </div>
    </Section>
  );
}
