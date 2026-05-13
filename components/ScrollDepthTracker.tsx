"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

const MILESTONES = [25, 50, 75, 100] as const;

export default function ScrollDepthTracker() {
  useEffect(() => {
    const fired = new Set<number>();
    let ticking = false;

    const compute = () => {
      ticking = false;
      const scrollTop = window.scrollY;
      const viewport = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const scrollable = docHeight - viewport;
      if (scrollable <= 0) return;
      const pct = Math.min(100, (scrollTop / scrollable) * 100);
      for (const m of MILESTONES) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          track("Scroll Depth", { depth: m });
        }
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(compute);
        ticking = true;
      }
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
