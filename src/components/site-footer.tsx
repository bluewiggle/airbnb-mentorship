import { Section } from "@/components/ui";

export function SiteFooter() {
  return (
    <Section className="pt-0">
      <div className="surface rounded-[26px] px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="text-white/90 font-extrabold">Elevated Apartments</div>
            <div className="text-white/60 text-[13px] mt-1">Operators only. Systems. Execution. Scale.</div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[13px] font-semibold text-white/70">
            <a href="#how" className="hover:text-white/92">Process</a>
            <a href="#mentorship" className="hover:text-white/92">What you get</a>
            <a href="#faq" className="hover:text-white/92">FAQs</a>
            <a href="#apply" className="hover:text-white/92">Apply</a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-[12px] text-white/55">
          © {new Date().getFullYear()} Elevated Apartments. All rights reserved.
        </div>
      </div>
    </Section>
  );
}
