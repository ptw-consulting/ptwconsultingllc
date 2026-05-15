import Link from "next/link";

export default function ProposalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-xs uppercase tracking-widest text-foreground/50 mb-3">
          404
        </p>
        <h1 className="text-2xl font-medium tracking-tight mb-3">
          Proposal not found
        </h1>
        <p className="text-sm text-foreground/70 mb-6">
          The link may have been mistyped or the proposal has been retired.
          Reply to Pete&apos;s email if you need a fresh one.
        </p>
        <Link
          href="/"
          className="text-sm underline decoration-foreground/30 hover:decoration-foreground/60 transition-colors"
        >
          Back to ptwconsultingllc.com
        </Link>
      </div>
    </div>
  );
}
