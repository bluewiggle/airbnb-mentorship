"use client";

import { useEffect, useRef } from "react";
import { createWidget } from "@typeform/embed";
import "@typeform/embed/build/css/widget.css";
import { track } from "@/lib/track";

type Props = {
  open: boolean;
  onClose: () => void;
  typeformUrl: string; // full URL like https://xxxx.typeform.com/to/ABCDE
  title?: string;
};

export default function TypeformModal({ open, onClose, typeformUrl, title = "Apply" }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // lock scroll + mount typeform widget
  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // mount widget + callbacks
    if (containerRef.current) {
      containerRef.current.innerHTML = "";

      createWidget(typeformUrl, {
        container: containerRef.current,
        onStarted: () => track("form_started"),
        onSubmit: () => track("form_submitted"),
      });
    }

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open, typeformUrl]);

  if (!open) return null;

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

          <div className="h-[70vh] bg-black">
            {/* Typeform mounts here */}
            <div ref={containerRef} className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
