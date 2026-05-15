"use client";

import { useEffect, useRef, useState } from "react";
import { decryptProposal, type CipherBundle } from "@/lib/crypto-client";
import { track } from "@/lib/analytics";

type Props = {
  slug: string;
  bundle: CipherBundle;
};

export default function ProposalUnlock({ slug, bundle }: Props) {
  const [password, setPassword] = useState("");
  const [html, setHtml] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [shake, setShake] = useState(false);
  const attemptsRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    track("Proposal Viewed", { slug });
  }, [slug]);

  useEffect(() => {
    if (!html) inputRef.current?.focus();
  }, [html]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError(false);
    try {
      const decrypted = await decryptProposal(bundle, password);
      attemptsRef.current += 1;
      track("Proposal Unlocked", { slug });
      setHtml(decrypted);
    } catch {
      attemptsRef.current += 1;
      track("Proposal Unlock Failed", { slug, attempt: attemptsRef.current });
      setError(true);
      setShake(true);
      setBusy(false);
      setTimeout(() => setShake(false), 400);
    }
  }

  if (html) {
    return (
      <article
        className="proposal-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm flex flex-col gap-4"
        aria-label="Unlock proposal"
      >
        <label
          htmlFor="proposal-password"
          className="text-sm text-foreground/70"
        >
          This proposal is password-protected. Enter the password Pete shared
          with you.
        </label>
        <input
          ref={inputRef}
          id="proposal-password"
          type="password"
          autoComplete="off"
          spellCheck={false}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError(false);
          }}
          disabled={busy}
          className={
            "w-full px-4 py-3 rounded-md bg-foreground/[0.04] border " +
            (error ? "border-destructive" : "border-foreground/[0.12]") +
            " focus:outline-none focus:border-foreground/40 transition-colors " +
            (shake ? "animate-[shake_0.4s_ease-in-out]" : "")
          }
          aria-invalid={error}
        />
        <button
          type="submit"
          disabled={busy || !password}
          className={
            "w-full px-4 py-3 rounded-md bg-foreground text-background " +
            "font-medium text-sm tracking-wide " +
            "disabled:opacity-50 disabled:cursor-not-allowed " +
            "hover:opacity-90 transition-opacity"
          }
        >
          {busy ? "Unlocking…" : "Unlock proposal"}
        </button>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            That password didn&apos;t work. Try again, or reply to Pete&apos;s
            email if you need it resent.
          </p>
        )}
      </form>
    </div>
  );
}
