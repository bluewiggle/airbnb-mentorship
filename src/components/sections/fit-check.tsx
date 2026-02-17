import { Section } from "@/components/ui";

export function FitCheck() {
  return (
    <Section id="fit">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.26em] text-white/72">
          <span className="h-px w-14 bg-white/18" />
          Fit
          <span className="h-px w-14 bg-white/18" />
        </div>
        <h2 className="mt-6 text-[clamp(34px,4.5vw,46px)] font-extrabold tracking-[-0.03em] text-white/95">
          Who this is for.
        </h2>
        <p className="mx-auto mt-3 max-w-[720px] text-[16px] leading-[1.7] text-white/70">
          This is built for people who want a real business and are ready to execute.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="surface rounded-[22px] p-7">
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.18em] text-white/75">
            This is for you if
          </div>
          <div className="mt-5 grid gap-3">
            {[
              "You want a real business",
              "You are ready to operate daily",
              "You have capital and urgency",
              "You want systems, not theory",
              "You will execute without excuses",
            ].map((x) => (
              <div key={x} className="rounded-[14px] border border-white/12 bg-white/6 px-4 py-4 text-[15px] font-semibold text-white/85">
                {x}
              </div>
            ))}
          </div>
        </div>

        <div className="surface rounded-[22px] p-7">
          <div className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.18em] text-white/75">
            Not a fit if
          </div>
          <div className="mt-5 grid gap-3">
            {[
              "You want a passive income myth",
              "You won’t be hands-on early",
              "You avoid numbers and standards",
              "You want shortcuts over reps",
              "You are not ready to move fast",
            ].map((x) => (
              <div key={x} className="rounded-[14px] border border-white/12 bg-white/6 px-4 py-4 text-[15px] font-semibold text-white/85">
                {x}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
