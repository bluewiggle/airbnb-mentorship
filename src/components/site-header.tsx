"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/utils";
import Image from "next/image";

const links = [
  { href: "#how", label: "Process" },
  { href: "#mentorship", label: "What you get" },
  { href: "#faq", label: "FAQs" },
];

type Props = {
  onApplyClick: () => void;
};

export function SiteHeader({ onApplyClick }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 px-6 py-4",
        scrolled ? "backdrop-blur-xl bg-black/35 border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4">
        <a href="#top" className="flex items-center">
          <Image
            src="/Logo_Trimmed.png"
            alt="BNB Lab"
            width={100}
            height={20.28}
            className="h-10 w-auto"
            priority
          />
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[13px] font-semibold text-white/70 hover:text-white/92">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onApplyClick}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-transparent bg-accent px-4 py-2.5 text-[14px] font-extrabold text-black transition will-change-transform hover:-translate-y-0.5 hover:shadow-glow"
          >
            Apply
          </button>
        </div>
      </div>
    </header>
  );
}