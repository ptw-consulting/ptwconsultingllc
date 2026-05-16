"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "ptw-cookie-banner-v1";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(STORAGE_KEY)) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage can throw in private mode on some browsers; the banner
      // will just reappear next visit. Acceptable.
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Privacy notice"
      className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-md z-50"
    >
      <div className="bg-popover border border-foreground/10 rounded-lg shadow-lg px-4 py-3.5 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="text-xs text-foreground/80 flex-1">
          We use{" "}
          <a
            href="https://plausible.io"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-foreground/30 hover:decoration-foreground/60"
          >
            Plausible
          </a>{" "}
          for analytics.{" "}
          <Link
            href="/privacy"
            className="underline decoration-foreground/30 hover:decoration-foreground/60"
          >
            Privacy policy
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 text-xs font-medium px-3 py-1.5 rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
