import fs from "node:fs/promises";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import ProposalUnlock from "@/components/ProposalUnlock";
import type { CipherBundle } from "@/lib/crypto-client";

const PROPOSALS_DIR = path.join(process.cwd(), "content", "proposals");

type ProposalFile = {
  frontmatter: {
    client: string;
    prepared_for?: string;
    prepared_by?: string;
    date: string;
    title?: string;
  };
} & CipherBundle;

async function loadProposal(slug: string): Promise<ProposalFile | null> {
  try {
    const raw = await fs.readFile(
      path.join(PROPOSALS_DIR, `${slug}.json`),
      "utf8",
    );
    return JSON.parse(raw) as ProposalFile;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const entries = await fs.readdir(PROPOSALS_DIR);
    return entries
      .filter((f) => f.endsWith(".json"))
      .map((f) => ({ slug: f.replace(/\.json$/, "") }));
  } catch {
    return [];
  }
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proposal = await loadProposal(slug);
  if (!proposal) return { title: "Proposal — PTW Consulting" };
  const { client, title } = proposal.frontmatter;
  return {
    title: `${title ?? "Proposal"} — ${client} — PTW Consulting`,
    robots: { index: false, follow: false },
  };
}

export default async function ProposalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proposal = await loadProposal(slug);
  if (!proposal) notFound();

  const { frontmatter, ciphertext, salt, iv, iterations } = proposal;
  const bundle: CipherBundle = { ciphertext, salt, iv, iterations };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden">
      {/* Subtle mesh accent — same primitives the homepage uses (capped blur,
          low opacity, static, no animate-pulse). Stays mobile-safe. */}
      <div className="absolute inset-x-0 top-0 -z-10 h-[480px] overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full opacity-20 blur-[60px] bg-indigo-500 light:opacity-40 light:bg-indigo-400" />
        <div className="absolute -top-20 right-[-6rem] w-[22rem] h-[22rem] rounded-full opacity-15 blur-[60px] bg-cyan-400 light:opacity-35 light:bg-cyan-300" />
      </div>

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

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 pt-8 pb-16 sm:pt-14">
        <div className="mb-14">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-foreground/45 mb-5">
            Proposal · {frontmatter.date}
          </p>
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight leading-[1.05] mb-5">
            {frontmatter.title ?? "Engagement proposal"}
          </h1>
          <p className="text-sm text-foreground/60">
            Prepared for{" "}
            <span className="text-foreground/85">
              {frontmatter.prepared_for ?? frontmatter.client}
            </span>
          </p>
        </div>

        <ProposalUnlock slug={slug} bundle={bundle} />
      </main>

      <footer className="border-t border-foreground/[0.06] mt-8">
        <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-foreground/45">
          <span>© PTW Consulting LLC · Miami, FL</span>
          <span className="font-mono tracking-wide">
            Encrypted · decrypts in your browser
          </span>
        </div>
      </footer>
    </div>
  );
}
