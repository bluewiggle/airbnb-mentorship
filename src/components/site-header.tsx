"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui";
import { cn } from "@/components/utils";

const links = [
  { href: "#how", label: "Process" },
  { href: "#mentorship", label: "What you get" },
  { href: "#faq", label: "FAQs" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn("sticky top-0 z-50 px-6 py-4", scrolled ? "backdrop-blur-xl bg-black/35 border-b border-white/10" : "bg-transparent")}>
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4">
        <a href="#top" className="font-extrabold tracking-[-0.02em] text-white/95">
          BNB Lab
          <span className="ml-2 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white/70">Mentorship</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[13px] font-semibold text-white/70 hover:text-white/92">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="#apply" variant="primary">
            Apply
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
