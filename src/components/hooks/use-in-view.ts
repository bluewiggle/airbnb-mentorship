"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setInView(true);
      });
    }, opts);

    obs.observe(el);
    return () => obs.disconnect();
  }, [opts?.root, opts?.rootMargin, opts?.threshold]);

  return { ref, inView };
}
