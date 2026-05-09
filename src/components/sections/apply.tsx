"use client";

import { Section } from "@/components/ui";
import { useState, useEffect } from "react";
import { track, trackMeta, trackMetaCustom } from "@/lib/track";

function CalendlyEmbed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    function handleCalendlyEvent(e: any) {
      if (e.data.event === "calendly.event_scheduled") {
        trackMeta("Schedule", { source: "calendly" });
        trackMetaCustom("CalendlyScheduled", { source: "calendly" });
        track("calendly_scheduled", { source: "calendly" });

        const stored = localStorage.getItem("lead_data");

        if (!stored) return;

        const data = JSON.parse(stored);

        fetch("/api/send-to-discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }).catch((error) => {
          console.error("Failed to send Discord notification:", error);
        });

        localStorage.removeItem("lead_data");
      }
    }

    window.addEventListener("message", handleCalendlyEvent);

    return () => {
      window.removeEventListener("message", handleCalendlyEvent);
    };
  }, []);

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
          style={{ minWidth: "320px", height: "1000px" }}
        />
      </div>
    </>
  );
}

export function Apply() {
  const [referrer, setReferrer] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "rejected" | "booking">("form");
  const [capital, setCapital] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    capital: "",
    ready_to_start: "",
    referrer: ""
  });

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");

  if (ref === "l") setReferrer("Liam");
  else if (ref === "n") setReferrer("Noah");
  else setReferrer(null);
}, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!capital || !timeline) {
      trackMetaCustom("ApplicationSubmitAttemptIncomplete");
      alert("Please complete all fields");
      return;
    }

    trackMetaCustom("ApplicationSubmitted", {
      capital,
      ready_to_start: timeline,
      referrer: referrer || "Unassigned"
    });
    track("application_submitted", {
      capital,
      ready_to_start: timeline,
      referrer: referrer || "Unassigned"
    });

    if (capital === "<10k") {
      trackMetaCustom("ApplicationRejected", {
        capital,
        ready_to_start: timeline,
        referrer: referrer || "Unassigned"
      });
      setStep("rejected");
      return;
    }

    // ✅ attach referrer before saving
    const finalData = {
      ...formData,
      referrer: referrer || "Unassigned"
    };

    localStorage.setItem("lead_data", JSON.stringify(finalData));

    trackMeta("Lead", {
      content_name: "BNB Lab Application",
      capital,
      ready_to_start: timeline,
      referrer: referrer || "Unassigned"
    });
    trackMetaCustom("CalendlyOpened", {
      capital,
      ready_to_start: timeline,
      referrer: referrer || "Unassigned"
    });
    track("lead", {
      capital,
      ready_to_start: timeline,
      referrer: referrer || "Unassigned"
    });

    setStep("booking");
  }

  if (step === "rejected") {
    return (
      <Section id="apply">
        <div className="text-center max-w-[600px] mx-auto">
          <h2 className="text-[32px] font-extrabold text-white">
            You don’t qualify (yet)
          </h2>

          <p className="mt-4 text-white/70 leading-[1.7]">
            Right now, we only work with people who have at least $10k ready to deploy.
          </p>
        </div>
      </Section>
    );
  }

  if (step === "booking") {
    return (
      <Section id="apply">
        <CalendlyEmbed />
      </Section>
    );
  }

  return (
    <Section id="apply">
      <div className="text-center">
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
          placeholder="Full name"
          required
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-white"
        />

        <input
          type="email"
          placeholder="Email address"
          required
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-white"
        />

        <input
          placeholder="Phone number"
          required
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          className="rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-white"
        />

        <div className="mt-2">
          <div className="text-white/60 text-sm mb-2">Capital ready</div>
          <div className="grid grid-cols-2 gap-2">
            {["<10k", "10-25k", "25-50k", "50k+"].map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  setCapital(option);
                  setFormData({ ...formData, capital: option });
                  trackMetaCustom("CapitalSelected", { capital: option });
                }}
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
                onClick={() => {
                  setTimeline(option);
                  setFormData({ ...formData, ready_to_start: option });
                  trackMetaCustom("TimelineSelected", { ready_to_start: option });
                }}
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

        <button
          type="submit"
          onClick={() => {
            trackMetaCustom("ContinueClicked", { location: "apply_form" });
          }}
          className="mt-6 rounded-full bg-accent px-6 py-3 font-extrabold text-black"
        >
          Continue
        </button>
      </form>
    </Section>
  );
}