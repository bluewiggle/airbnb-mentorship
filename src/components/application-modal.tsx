"use client";

import { useEffect, useMemo, useState } from "react";
import { track, trackMeta, trackMetaCustom } from "@/lib/track";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
};

const capitalOptions = ["<$10k", "$10k–$25k", "$25k–$50k", "$50k+"] as const;
const startOptions = ["Immediately", "Within 2 weeks", "Within a month", "Not sure yet"] as const;

type FormState = {
  name: string;
  email: string;
  phone: string;
  instagram: string;
  capital: string;
  ready_to_start: string;
};

export default function ApplicationModal({ open, onClose, title = "Apply" }: Props) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [touchedSubmit, setTouchedSubmit] = useState(false);
  const [errors, setErrors] = useState<Record<keyof FormState, string>>({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    capital: "",
    ready_to_start: "",
  });

  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    capital: "",
    ready_to_start: "",
  });

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // lock scroll + track start + reset
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    track("form_started");
    trackMetaCustom("ApplicationModalOpened");

    setSuccess(false);
    setTouchedSubmit(false);
    setLoading(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      instagram: "",
      capital: "",
      ready_to_start: "",
    });
    setErrors({
      name: "",
      email: "",
      phone: "",
      instagram: "",
      capital: "",
      ready_to_start: "",
    });

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const isEmailValid = useMemo(() => {
    const v = form.email.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }, [form.email]);

  const isPhoneValid = useMemo(() => {
    const v = form.phone.trim();
    const digits = v.replace(/\D/g, "");
    return digits.length >= 8;
  }, [form.phone]);

  const isInstagramValid = useMemo(() => {
    const v = form.instagram.trim();
    if (!v) return false;
    return /^[a-zA-Z0-9._@]{2,}$/.test(v);
  }, [form.instagram]);

  const isValid = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      isEmailValid &&
      isPhoneValid &&
      isInstagramValid &&
      !!form.capital &&
      !!form.ready_to_start
    );
  }, [form.name, isEmailValid, isPhoneValid, isInstagramValid, form.capital, form.ready_to_start]);

  // ✅ Only after ALL hooks:
  if (!open) return null;

  const clearError = (key: keyof FormState) => {
    if (!errors[key]) return;
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const next: Record<keyof FormState, string> = {
      name: "",
      email: "",
      phone: "",
      instagram: "",
      capital: "",
      ready_to_start: "",
    };

    if (form.name.trim().length < 2) next.name = "Enter your full name.";
    if (!isEmailValid) next.email = "Enter a valid email address.";

    const digits = form.phone.replace(/\D/g, "");
    if (digits.length < 8) next.phone = "Enter a valid phone number.";

    if (!isInstagramValid) next.instagram = "Enter your Instagram handle.";
    if (!form.capital) next.capital = "Select your capital range.";
    if (!form.ready_to_start) next.ready_to_start = "Select when you're ready to start.";

    setErrors(next);

    const firstKey = (Object.keys(next) as (keyof FormState)[]).find((k) => next[k]);
    if (firstKey) {
      const el = document.querySelector(`[data-field="${firstKey}"]`) as HTMLElement | null;
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      el?.focus?.();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouchedSubmit(true);
    if (loading) return;

    if (!validate()) return;

    setLoading(true);

    const instagram =
      form.instagram.trim().length === 0
        ? ""
        : form.instagram.trim().startsWith("@")
        ? form.instagram.trim()
        : `@${form.instagram.trim()}`;

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        instagram,
        capital: form.capital,
        ready_to_start: form.ready_to_start,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      alert(`Submit failed: ${data?.error || "Unknown error"}`);
      setLoading(false);
      return;
    }

    track("form_submitted");
    trackMeta("Lead", { content_name: "BNB Lab Modal Application" });
    trackMetaCustom("ApplicationModalSubmitted", {
      capital: form.capital,
      ready_to_start: form.ready_to_start,
    });
    setSuccess(true);
    setLoading(false);
  };

  const RadioCard = ({
    checked,
    label,
    name,
    value,
    onChange,
  }: {
    checked: boolean;
    label: string;
    name: string;
    value: string;
    onChange: () => void;
  }) => (
    <label
      className={[
        "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-[13.5px] font-semibold transition",
        checked
          ? "border-white/25 bg-white/14 text-white/95"
          : "border-white/10 bg-white/4 text-white/45 hover:bg-white/7 hover:text-white/65",
      ].join(" ")}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-[var(--accent)]"
      />
      <span className="leading-tight">{label}</span>
    </label>
  );

  const fieldBase =
    "h-12 w-full rounded-xl border px-4 text-[14.5px] outline-none transition placeholder:text-white/35";
  const fieldOk = "border-white/10 bg-white/5 text-white/90 focus:border-white/20";
  const fieldBad = "border-red-500/60 bg-red-500/10 text-white focus:border-red-400";

  return (
    <div className="fixed inset-0 z-[999]">
      {/* Backdrop */}
      <button
        aria-label="Close application form"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/55 backdrop-blur-md"
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0d10] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="text-white/90 font-semibold">{title}</div>
            <button onClick={onClose} className="rounded-lg px-3 py-1 text-white/80 hover:bg-white/10 hover:text-white">
              Close
            </button>
          </div>

          <div className="p-6">
            {success ? (
              <div className="py-10 text-center">
                <div className="text-[18px] font-extrabold text-white/95">Application received.</div>
                <div className="mt-2 text-[14.5px] leading-[1.7] text-white/72">
                  We’ll review it and reach out if it’s a fit.
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-[14px] font-extrabold text-white/85 hover:bg-white/10"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4">
                {/* Row 1 */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[12px] font-extrabold uppercase tracking-[0.14em] text-white/60">
                      Full name
                    </label>
                    <input
                      data-field="name"
                      value={form.name}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, name: e.target.value }));
                        clearError("name");
                      }}
                      className={`${fieldBase} ${errors.name ? fieldBad : fieldOk}`}
                      placeholder="Full name"
                    />
                    {errors.name && <div className="mt-1 text-[12.5px] font-semibold text-red-400">{errors.name}</div>}
                  </div>

                  <div>
                    <label className="mb-1 block text-[12px] font-extrabold uppercase tracking-[0.14em] text-white/60">
                      Email
                    </label>
                    <input
                      data-field="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, email: e.target.value }));
                        clearError("email");
                      }}
                      className={`${fieldBase} ${errors.email ? fieldBad : fieldOk}`}
                      placeholder="example@gmail.com"
                    />
                    {errors.email && <div className="mt-1 text-[12.5px] font-semibold text-red-400">{errors.email}</div>}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[12px] font-extrabold uppercase tracking-[0.14em] text-white/60">
                      Phone
                    </label>
                    <input
                      data-field="phone"
                      value={form.phone}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, phone: e.target.value }));
                        clearError("phone");
                      }}
                      className={`${fieldBase} ${errors.phone ? fieldBad : fieldOk}`}
                      placeholder="04xxxxxxxx"
                    />
                    {errors.phone && <div className="mt-1 text-[12.5px] font-semibold text-red-400">{errors.phone}</div>}
                  </div>

                  <div>
                    <label className="mb-1 block text-[12px] font-extrabold uppercase tracking-[0.14em] text-white/60">
                      Instagram
                    </label>
                    <input
                      data-field="instagram"
                      value={form.instagram}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, instagram: e.target.value }));
                        clearError("instagram");
                      }}
                      className={`${fieldBase} ${errors.instagram ? fieldBad : fieldOk}`}
                      placeholder="@your_username"
                    />
                    {errors.instagram && (
                      <div className="mt-1 text-[12.5px] font-semibold text-red-400">{errors.instagram}</div>
                    )}
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[12px] font-extrabold uppercase tracking-[0.14em] text-white/60">
                      Capital ready
                    </label>

                    <div
                      data-field="capital"
                      className={[
                        "grid grid-cols-2 gap-2 rounded-xl p-2",
                        errors.capital ? "border border-red-500/40 bg-red-500/10" : "",
                      ].join(" ")}
                    >
                      {capitalOptions.map((opt) => (
                        <RadioCard
                          key={opt}
                          checked={form.capital === opt}
                          label={opt}
                          name="capital"
                          value={opt}
                          onChange={() => {
                            setForm((p) => ({ ...p, capital: opt }));
                            clearError("capital");
                          }}
                        />
                      ))}
                    </div>

                    {errors.capital && (
                      <div className="mt-1 text-[12.5px] font-semibold text-red-400">{errors.capital}</div>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-[12px] font-extrabold uppercase tracking-[0.14em] text-white/60">
                      Ready to start
                    </label>

                    <div
                      data-field="ready_to_start"
                      className={[
                        "grid grid-cols-2 gap-2 rounded-xl p-2",
                        errors.ready_to_start ? "border border-red-500/40 bg-red-500/10" : "",
                      ].join(" ")}
                    >
                      {startOptions.map((opt) => (
                        <RadioCard
                          key={opt}
                          checked={form.ready_to_start === opt}
                          label={opt}
                          name="ready_to_start"
                          value={opt}
                          onChange={() => {
                            setForm((p) => ({ ...p, ready_to_start: opt }));
                            clearError("ready_to_start");
                          }}
                        />
                      ))}
                    </div>

                    {errors.ready_to_start && (
                      <div className="mt-1 text-[12.5px] font-semibold text-red-400">{errors.ready_to_start}</div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <div className="mt-2 flex flex-col gap-3">
                  {touchedSubmit && !isValid && (
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-[13px] font-semibold text-white/65">
                      Please fix the highlighted fields to submit your application.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-accent px-4 py-3 text-[14px] font-extrabold text-black transition will-change-transform hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {loading ? "Submitting..." : "Submit application"}
                  </button>

                  <div className="text-center text-[12.5px] text-white/45">
                    If selected, you will be contacted about your application.
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}