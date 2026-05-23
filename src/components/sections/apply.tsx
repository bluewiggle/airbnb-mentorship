"use client";

import { Section } from "@/components/ui";
import { useState, useEffect } from "react";
import {
  getAttribution,
  getAttributionReferrer,
  track,
  trackMeta,
  trackMetaCustom,
} from "@/lib/track";

const stateOptions = [
  "Victoria",
  "New South Wales",
  "Queensland",
  "South Australia",
  "Northern Territory",
  "Western Australia",
  "Tasmania",
  "Australian Capital Territory",
];

const blockedStates = [
  "Western Australia",
  "Tasmania",
  "Australian Capital Territory",
];

function CalendlyEmbed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    function handleCalendlyEvent(e: any) {
      if (e.origin !== "https://calendly.com") return;

      if (e.data.event === "calendly.event_scheduled") {
        const attribution = getAttribution();

        // Do NOT fire Meta's standard Schedule event here.
        // Real Schedule should come from the Calendly webhook/server.
        trackMetaCustom("CalendlyScheduledClient", {
          source: "calendly",
          ref: attribution?.ref || "unassigned",
          referrer: attribution?.referrer || "Unassigned",
        });

        track("calendly_scheduled_client", {
          source: "calendly",
          ref: attribution?.ref || "unassigned",
          referrer: attribution?.referrer || "Unassigned",
        });

        const stored = localStorage.getItem("lead_data");

        if (!stored) return;

        const data = JSON.parse(stored);

        const calendlyPayload = e.data.payload || {};

        const dataWithBookingTime = {
          ...data,
          calendly_event_uri: calendlyPayload.event?.uri || null,
          calendly_invitee_uri: calendlyPayload.invitee?.uri || null,
        };

        if (dataWithBookingTime.attribution_pixel_id && dataWithBookingTime.attribution_ref) {
          fetch("/api/meta/schedule", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...dataWithBookingTime,
              schedule_event_id: `schedule_${dataWithBookingTime.email}_${
                calendlyPayload.event?.uri || Date.now()
              }`,
            }),
          }).catch((error) => {
            console.error("Failed to send Schedule CAPI event:", error);
          });
        } else {
          console.log("Skipping Schedule CAPI because no paid attribution exists.");
        }

        fetch("/api/send-to-discord", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataWithBookingTime),
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
          data-url="https://calendly.com/bnblabaus/application"
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    state: "",
    capital: "",
    ready_to_start: "",
    referrer: ""
  });

useEffect(() => {
  setReferrer(getAttributionReferrer());
}, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) return;

    if (!formData.state || !capital || !timeline) {
      trackMetaCustom("ApplicationSubmitAttemptIncomplete");
      alert("Please complete all fields");
      return;
    }

    setIsSubmitting(true);

    trackMetaCustom("ApplicationSubmitted", {
      state: formData.state,
      capital,
      ready_to_start: timeline,
      referrer: referrer || "Unassigned"
    });
    track("application_submitted", {
      state: formData.state,
      capital,
      ready_to_start: timeline,
      referrer: referrer || "Unassigned"
    });

    if (blockedStates.includes(formData.state)) {
      trackMetaCustom("ApplicationRejected", {
        reason: "blocked_state",
        state: formData.state,
        capital,
        ready_to_start: timeline,
        referrer: referrer || "Unassigned"
      });

      setIsSubmitting(false);

      setStep("rejected");
      return;
    }

    if (capital === "<10k") {
      trackMetaCustom("ApplicationRejected", {
        reason: "capital_under_10k",
        state: formData.state,
        capital,
        ready_to_start: timeline,
        referrer: referrer || "Unassigned"
      });
      setIsSubmitting(false);
      setStep("rejected");
      return;
    }

    // ✅ attach all required data before saving
    const attribution = getAttribution();
    const leadEventId = `lead_${formData.email.trim().toLowerCase()}_${Date.now()}`;

    const finalData = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      state: formData.state,
      capital: capital || formData.capital,
      ready_to_start: timeline || formData.ready_to_start,
      referrer: attribution?.referrer || referrer || "Unassigned",
      attribution_ref: attribution?.ref || "",
      attribution_pixel_id: attribution?.pixel_id || "",
      fbclid: attribution?.fbclid || "",
      utm_source: attribution?.utm_source || "",
      utm_medium: attribution?.utm_medium || "",
      utm_campaign: attribution?.utm_campaign || "",
      utm_content: attribution?.utm_content || "",
      utm_term: attribution?.utm_term || "",
      landing_page: attribution?.landing_page || "",
      meta_event_id: leadEventId,
    };

    localStorage.setItem("lead_data", JSON.stringify(finalData));

    const saveRes = await fetch("/api/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(finalData),
    });

    if (!saveRes.ok) {
      const errorData = await saveRes.json().catch(() => null);
      console.error("Failed to save application:", errorData);

      setIsSubmitting(false);
      alert(errorData?.error || "Something went wrong. Please try again.");
      return;
    }

    trackMeta("Lead", {
      event_id: finalData.meta_event_id,
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
            Right now, we only work with people who have at least $10k ready to deploy and are not based in WA, Tasmania or ACT.
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

        <select
          required
          value={formData.state}
          onChange={(e) =>
            setFormData({ ...formData, state: e.target.value })
          }
          className="rounded-[12px] border border-white/10 bg-white/5 px-4 py-3 text-white"
        >
          <option value="" className="bg-[#0b0d10] text-white">
            Select your state
          </option>

          {stateOptions.map((state) => (
            <option key={state} value={state} className="bg-[#0b0d10] text-white">
              {state}
            </option>
          ))}
        </select>

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
          disabled={isSubmitting}
          onClick={() => {
            if (!isSubmitting) {
              trackMetaCustom("ContinueClicked", { location: "apply_form" });
            }
          }}
          className={`mt-6 rounded-full px-6 py-3 font-extrabold text-black transition-all ${
            isSubmitting
              ? "cursor-not-allowed bg-accent/70 opacity-80"
              : "bg-accent hover:scale-[1.01]"
          }`}
        >
          {isSubmitting ? "Loading..." : "Continue"}
        </button>
      </form>
    </Section>
  );
}