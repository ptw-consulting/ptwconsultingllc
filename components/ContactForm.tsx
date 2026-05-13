"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = e.currentTarget;
    try {
      const res = await fetch("https://formspree.io/f/maqlldvz", {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
        track("Contact Form Submitted");
      } else {
        setStatus("error");
      }
    } catch { setStatus("error"); }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-border card-surface p-8 text-center">
        <p className="text-foreground font-medium mb-1">Message received.</p>
        <p className="text-sm text-foreground/40">We&apos;ll be in touch shortly.</p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-foreground/[0.04] border border-foreground/[0.08] rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:border-foreground/20 focus:bg-foreground/[0.06] transition-all";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <input name="name" type="text" required placeholder="Name" className={inputClass} />
        <input name="email" type="email" required placeholder="Email" className={inputClass} />
      </div>
      <textarea
        name="message"
        rows={3}
        required
        placeholder="Tell us about your business..."
        className={`${inputClass} resize-none`}
      />
      {status === "error" && (
        <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-2.5 rounded-lg bg-foreground text-background text-sm font-medium hover:bg-foreground/90 disabled:opacity-50 transition-colors"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
