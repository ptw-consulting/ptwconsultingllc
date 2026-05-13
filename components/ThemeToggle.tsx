"use client";

import { useRef } from "react";
import { flushSync } from "react-dom";
import { useTheme } from "./ThemeProvider";
import { track } from "@/lib/analytics";

/**
 * Theme toggle with a View Transitions API circular reveal.
 *
 * On click:
 *   - If the browser supports document.startViewTransition AND the user has
 *     not requested reduced motion, the new theme expands as a circular wipe
 *     from the button's center.
 *   - Otherwise, the theme just switches (CSS transitions on bg/text colors
 *     give a clean cross-fade fallback).
 *
 * The button itself shows a sun/moon glyph via stacked SVGs that morph on
 * theme change.
 */
export default function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);
  const isDark = resolvedTheme === "dark";

  function handleClick() {
    const next = isDark ? "light" : "dark";
    track("Theme Toggled", { theme: next });
    const btn = btnRef.current;

    // Feature-detect: View Transitions API
    const docAny = document as Document & {
      startViewTransition?: (cb: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!docAny.startViewTransition || reduceMotion || !btn) {
      setTheme(next);
      return;
    }

    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = docAny.startViewTransition(() => {
      flushSync(() => setTheme(next));
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 520,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={
        "relative inline-flex items-center justify-center w-8 h-8 rounded-full " +
        "bg-foreground/[0.06] border border-foreground/[0.06] " +
        "hover:bg-foreground/[0.12] transition-colors duration-200 " +
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 " +
        (className ?? "")
      }
    >
      {/* Sun: shown in light mode (current state). Click switches to dark. */}
      <svg
        viewBox="0 0 24 24"
        className={
          "absolute w-4 h-4 text-foreground/80 transition-all duration-300 " +
          (isDark
            ? "opacity-0 -rotate-90 scale-50"
            : "opacity-100 rotate-0 scale-100")
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 17.66l1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M4.93 19.07l1.41-1.41" />
        <path d="M17.66 6.34l1.41-1.41" />
      </svg>

      {/* Moon: shown in dark mode (current state). Click switches to light. */}
      <svg
        viewBox="0 0 24 24"
        className={
          "absolute w-4 h-4 text-foreground/80 transition-all duration-300 " +
          (isDark
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-90 scale-50")
        }
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
