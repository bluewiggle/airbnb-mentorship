"use client";

import { Section } from "@/components/ui";
import { useState } from "react";

import { useEffect } from "react";

function CalendlyEmbed({ formData }: { formData: Record<string, string> }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    function handleMessage(e: MessageEvent) {
      if (e.data?.event === "calendly.event_scheduled") {
        fetch("/api/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [formData]);

  return (
    <>
      <div className="text-center">
        <h2 className="text-[clamp(34px,4.5vw,48px)] font-extrabold text-white">
          Book your call
        </h2>

        <p className="mt-3 text-white/70">
          Select a time below to speak with us.
        </p>
      </div>

      <div className="mt-10 max-w-[900px] mx-auto">
        <div
          className="calendly-inline-widget w-full"
          data-url="https://calendly.com/elevatedapartments/30min"
          style={{ minWidth: "320px", height: "1000px" }} // 🔥 FIXED HEIGHT
        />
      </div>
    </>
  );
}

export function Apply() {
  const [step, setStep] = useState<"form" | "rejected" | "booking">("form");
  const [capital, setCapital] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!capital || !timeline) {
      alert("Please complete all fields");
      return;
    }

    if (capital === "<10k") {
      setStep("rejected");
      return;
    }

    const form = e.currentTarget;
    setFormData({
      name: (form.elements.namedItem("name") as HTMLInputElement)?.value || "",
      email: (form.elements.namedItem("email") as HTMLInputElement)?.value || "",
      phone: (form.elements.namedItem("phone") as HTMLInputElement)?.value || "",
      capital,
      ready_to_start: timeline,
    });

    setStep("booking");
  }

  // ❌ REJECTED
  if (step === "rejected") {
    return (
      <Section id="apply">
        <div className="text-center max-w-[600px] mx-auto">
          <h2 className="text-[32px] font-extrabold text-white">
            You don’t qualify (yet)
          </h2>

          <p className="mt-4 text-white/70 leading-[1.7]">
            Right now, we only work with people who have at least $10k ready to deploy.
            This ensures you can actually execute and get results.
          </p>
        </div>
      </Section>
    );
  }

// ✅ BOOKING (Calendly inline)
if (step === "booking") {
  return (
    <Section id="apply">
      <CalendlyEmbed formData={formData} />
    </Section>
  );
}

  // ✅ FORM
  return (
    <Section id="apply">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 text-[12px] font-extrabold uppercase tracking-[0.26em] text-white/70">
          <span className="h-px w-14 bg-white/18" />
          Apply
          <span className="h-px w-14 bg-white/18" />
        </div>

        <h2 className="mt-6 text-[clamp(34px,4.5vw,48px)] font-extrabold text-white">
          See if you qualify
        </h2>

        <p className="mx-auto mt-4 max-w-[640px] text-[15px] text-white/70">
          Takes 60 seconds. If you’re a fit, you’ll book a call instantly.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-10 max-w-[600px] flex flex-col gap-4"
      >
        <input
          name="name"
          placeholder="Full name"
          required
          className="rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-white"
        />

        <input
          name="email"
          type="email"
          placeholder="Email address"
          required
          className="rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-white"
        />

        <input
          name="phone"
          placeholder="Phone number"
          required
          className="rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-white"
        />

        {/* CAPITAL */}
        <div className="mt-2">
          <div className="text-white/60 text-sm mb-2">Capital ready</div>
          <div className="grid grid-cols-2 gap-2">
            {["<10k", "10-25k", "25-50k", "50k+"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCapital(option)}
                className={`rounded-[10px] px-4 py-3 border ${
                  capital === option
                    ? "bg-accent text-black"
                    : "bg-white/5 text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* TIMELINE */}
        <div className="mt-2">
          <div className="text-white/60 text-sm mb-2">
            When are you ready to start?
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              "Immediately",
              "Within 2 weeks",
              "Within a month",
              "Just exploring",
            ].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setTimeline(option)}
                className={`rounded-[10px] px-4 py-3 border ${
                  timeline === option
                    ? "bg-accent text-black"
                    : "bg-white/5 text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button className="mt-6 rounded-full bg-accent px-6 py-3 font-extrabold text-black">
          Continue
        </button>

        <p className="text-center text-[13px] text-white/50 mt-2">
          Limited spots each month
        </p>
      </form>
    </Section>
  );
}