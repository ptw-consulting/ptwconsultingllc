import Link from "next/link";
import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Privacy Policy — PTW Consulting",
  description:
    "How PTW Consulting handles analytics and contact form data. No cookies, no cross-site tracking.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight hover:opacity-80 transition-opacity"
          >
            PTW Consulting
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 pt-8 pb-16 sm:pt-12">
        <div className="mb-10">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-foreground/45 mb-4">
            Effective May 15, 2026
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-foreground/70">
            PTW Consulting LLC, Miami, FL
          </p>
        </div>

        <div className="space-y-8 text-foreground/85 leading-relaxed">
          <section>
            <h2 className="text-lg font-medium text-foreground mb-2">
              What we collect
            </h2>
            <p className="mb-3">
              <strong className="text-foreground">Analytics.</strong> We use{" "}
              <a
                href="https://plausible.io"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-foreground/30 hover:decoration-foreground/60"
              >
                Plausible Analytics
              </a>{" "}
              to understand how visitors use the site. Plausible sets no
              cookies, stores no personal data, and does not track visitors
              across other sites. The metrics we see are aggregated and
              anonymous: page views, scroll depth, and a small number of custom
              events (e.g., contact form submitted, proposal viewed).
            </p>
            <p className="mb-3">
              <strong className="text-foreground">Contact form.</strong> If you
              fill out the contact form, your name, email, company, and message
              are transmitted to us via{" "}
              <a
                href="https://formspree.io"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-foreground/30 hover:decoration-foreground/60"
              >
                Formspree
              </a>{" "}
              and delivered to our inbox. We use that information only to
              respond to your inquiry.
            </p>
            <p>
              <strong className="text-foreground">Client proposals.</strong>{" "}
              Proposal pages at <code>/proposals/&lt;slug&gt;/</code> are
              encrypted at rest in the static site bundle and decrypted
              client-side in your browser using a password we share with you
              separately. The plaintext of any proposal is never transmitted
              to our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-2">
              What we don&apos;t do
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>We do not sell or rent your data.</li>
              <li>We do not share your data with advertisers.</li>
              <li>We do not set cookies for analytics or marketing.</li>
              <li>We do not track you across other websites.</li>
              <li>We do not maintain individual user profiles.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-2">
              Your rights
            </h2>
            <p>
              If you have contacted us via the form and would like your
              information deleted from our records, email{" "}
              <a
                href="mailto:pwild@ptwconsultingllc.com"
                className="underline decoration-foreground/30 hover:decoration-foreground/60"
              >
                pwild@ptwconsultingllc.com
              </a>{" "}
              and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-2">
              Updates
            </h2>
            <p>
              If we materially change how we handle data, we will update this
              page and revise the effective date above.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-medium text-foreground mb-2">
              Contact
            </h2>
            <p>
              Peter Wild, PTW Consulting LLC. Miami, FL.{" "}
              <a
                href="mailto:pwild@ptwconsultingllc.com"
                className="underline decoration-foreground/30 hover:decoration-foreground/60"
              >
                pwild@ptwconsultingllc.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-foreground/[0.06] mt-8">
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-foreground/45">
          © PTW Consulting LLC · Miami, FL
        </div>
      </footer>
    </div>
  );
}
