import Image from "next/image";
import { Section } from "@/components/ui";

function Founder({
  name,
  role,
  heading,
  paras,
  pills,
  reverse,
  img,
}: {
  name: string;
  role: string;
  heading: string;
  paras: string[];
  pills: string[];
  reverse?: boolean;
  img: string;
}) {
  return (
    <div className={"grid gap-8 lg:grid-cols-2 lg:gap-12 " + (reverse ? "lg:[&>*:first-child]:order-2" : "")}>
      <div className="relative overflow-hidden rounded-[28px] border border-white/12 shadow-[0_40px_110px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/75" />
        <div className="absolute inset-0 opacity-60" style={{ background: "radial-gradient(circle at 18% 20%, rgb(var(--accent)/0.22), transparent 48%)" }} />
        <Image src={img} alt={name} width={920} height={1100} className="h-full w-full object-cover" />
        <div className="absolute bottom-5 left-5 right-5">
          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-white/85 backdrop-blur">
            Co-Founder
          </div>
          <div className="mt-3 text-[34px] font-extrabold tracking-[-0.02em] text-white/95">{name}</div>
          <div className="mt-1 text-[12px] font-extrabold uppercase tracking-[0.18em] text-white/75">{role}</div>
        </div>
      </div>

      <div className="flex flex-col justify-center text-center lg:text-left">
        <h3 className="text-[clamp(30px,3.3vw,46px)] font-extrabold tracking-[-0.03em] leading-[1.08] text-white/95">
          {heading}
        </h3>
        <div className="mt-4 space-y-3 text-[15.5px] leading-[1.85] text-white/72">
          {paras.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start">
          {pills.map((x) => (
            <span key={x} className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[13px] font-extrabold text-white/85">
              {x}
            </span>
          ))}
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
          Operators
          <span className="h-px w-14 bg-white/18" />
        </div>

        <h2 className="mt-6 text-[clamp(44px,6vw,76px)] font-extrabold tracking-[-0.05em] leading-[1.00] text-white/95">
          We’re not influencers.
          <br />
          We’re <span className="italic">professionals</span>.
        </h2>

        <p className="mx-auto mt-5 max-w-[880px] text-[16.5px] leading-[1.8] text-white/72">
          We didn’t start by teaching Airbnb. We started by operating it. Every system and trick we share was built through real properties,
          real leases, and real financial pressure.
        </p>
      </div>

      <div className="mt-14 flex flex-col gap-14">
        <Founder
          name="Noah"
          role="Operations · Infrastructure · Scale"
          heading="Operations. Infrastructure. Scale."
          paras={[
            "Handles operations, logistics, and backend infrastructure. From supplier coordination and furnishing rollout to cleaner systems and workflow automation — the focus is building structure that keeps the portfolio stable and scalable.",
            "Responsible for cost control, operational efficiency, and removing daily friction so properties run smoothly without chaos as the portfolio grows.",
          ]}

          pills={["Systems first", "Numbers-driven", "Repeatable scale"]}
          img="/Noah_Mentor.png"
        />
        <Founder
          reverse
          name="Liam"
          role="Leases · Revenue · Execution"
          heading="Leases. Revenue. Performance."
          paras={[
            "Handles building selection, lease approvals, guest experience, and pricing strategy. From securing the right properties to positioning listings for maximum performance — the focus is revenue and approval.",
            "Responsible for negotiating with agents, getting leases approved, optimising nightly rates, and ensuring each property performs consistently from launch onward.",
          ]}
          pills={["Agent strategy", "Building filters", "Rollout standards"]}
          img="https://placehold.co/920x1100/png?text=Liam+Photo"
        />
      </div>
    </Section>
  );
}
