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
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-foreground/[0.06]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium tracking-tight hover:opacity-80 transition-opacity"
          >
            PTW Consulting
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-foreground/50 mb-2">
            Proposal
          </p>
          <h1 className="text-3xl sm:text-4xl font-medium tracking-tight mb-3">
            {frontmatter.title ?? "Engagement proposal"}
          </h1>
          <p className="text-sm text-foreground/70">
            Prepared for {frontmatter.prepared_for ?? frontmatter.client} ·{" "}
            {frontmatter.date}
          </p>
        </div>

        <ProposalUnlock slug={slug} bundle={bundle} />
      </main>

      <footer className="border-t border-foreground/[0.06]">
        <div className="max-w-3xl mx-auto px-6 py-6 text-xs text-foreground/50">
          © PTW Consulting LLC · Boston, MA
        </div>
      </footer>
    </div>
  );
}
