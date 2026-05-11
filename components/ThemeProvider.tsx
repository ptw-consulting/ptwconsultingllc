"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ThemeChoice = "system" | "light" | "dark";
type Resolved = "light" | "dark";

type Ctx = {
  theme: ThemeChoice;
  resolvedTheme: Resolved;
  setTheme: (t: ThemeChoice) => void;
};

const STORAGE_KEY = "theme";
const ThemeContext = createContext<Ctx | null>(null);

function getSystemPref(): Resolved {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStored(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const v = window.localStorage.getItem(STORAGE_KEY);
  return v === "light" || v === "dark" || v === "system" ? v : "system";
}

function applyTheme(resolved: Resolved) {
  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // SSR-safe initial: assume what the no-flash script in <head> already applied.
  // Hydration mismatch is avoided because we don't render anything theme-aware
  // until after the first effect tick.
  const [theme, setThemeState] = useState<ThemeChoice>("system");
  const [resolved, setResolved] = useState<Resolved>("dark");

  useEffect(() => {
    const stored = readStored();
    const r: Resolved = stored === "system" ? getSystemPref() : stored;
    setThemeState(stored);
    setResolved(r);
    applyTheme(r);

    if (stored === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = () => {
        const next: Resolved = mq.matches ? "dark" : "light";
        setResolved(next);
        applyTheme(next);
      };
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
  }, []);

  const setTheme = useCallback((t: ThemeChoice) => {
    window.localStorage.setItem(STORAGE_KEY, t);
    const r: Resolved = t === "system" ? getSystemPref() : t;
    setThemeState(t);
    setResolved(r);
    applyTheme(r);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme: resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

// Inline script for <head> — runs synchronously before paint to set the
// initial data-theme so there's no flash of dark on a light-mode user (or
// vice versa). Stringified so it can be injected via dangerouslySetInnerHTML.
export const themeBootstrapScript = `
(function() {
  try {
    var stored = localStorage.getItem("${STORAGE_KEY}");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var resolved = (stored === "light" || stored === "dark")
      ? stored
      : (prefersDark ? "dark" : "light");
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  } catch (e) {
    document.documentElement.dataset.theme = "dark";
    document.documentElement.style.colorScheme = "dark";
  }
})();
`;
