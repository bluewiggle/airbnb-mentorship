"use client";

import { useEffect } from "react";

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function animateScrollTo(targetY: number, duration = 750) {
  const startY = window.scrollY || window.pageYOffset;
  const diff = targetY - startY;

  if (Math.abs(diff) < 2) return;

  const start = performance.now();

  const step = (now: number) => {
    const elapsed = now - start;
    const t = clamp(elapsed / duration, 0, 1);
    const eased = easeInOutCubic(t);

    window.scrollTo(0, startY + diff * eased);

    if (t < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function getTargetTop(el: HTMLElement) {
  // If you have a sticky header, add an offset here (e.g. -80)
  const offset = 0;
  const rect = el.getBoundingClientRect();
  return rect.top + (window.scrollY || window.pageYOffset) + offset;
}

export default function SmoothScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // Only left-clicks
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const target = e.target as HTMLElement | null;
      const a = target?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;

      const href = a.getAttribute("href") || "";
      if (href === "#" || !href.startsWith("#")) return;

      const id = decodeURIComponent(href.slice(1));
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();

      // Update URL hash without the browser jumping
      history.pushState(null, "", `#${encodeURIComponent(id)}`);

      if (prefersReducedMotion()) {
        el.scrollIntoView({ block: "start" });
        return;
      }

      // Duration scales a bit with distance (feels nicer)
      const targetY = getTargetTop(el);
      const distance = Math.abs(targetY - (window.scrollY || 0));
      const duration = clamp(450 + distance * 0.35, 500, 1100);

      animateScrollTo(targetY, duration);
    };

    document.addEventListener("click", onClick);

    // If page loads with a hash, ease-scroll to it (optional)
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      const id = decodeURIComponent(hash.slice(1));
      const el = document.getElementById(id);
      if (el && !prefersReducedMotion()) {
        // Let layout settle first
        requestAnimationFrame(() => {
          const targetY = getTargetTop(el);
          animateScrollTo(targetY, 700);
        });
      }
    }

    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
