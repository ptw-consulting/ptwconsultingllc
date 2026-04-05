"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import ContactForm from "@/components/ContactForm";

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated mesh gradient ─────────────────────────────────────────── */
function MeshGradient() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full opacity-20 blur-[120px] bg-indigo-600 animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute -top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full opacity-15 blur-[120px] bg-cyan-500 animate-pulse" style={{ animationDuration: "12s" }} />
      <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] rounded-full opacity-10 blur-[100px] bg-violet-500 animate-pulse" style={{ animationDuration: "10s" }} />
    </div>
  );
}

/* ─── Subtle dot grid ────────────────────────────────────────────────── */
function DotGrid() {
  return (
    <div
      className="absolute inset-0 -z-10 opacity-[0.08]"
      aria-hidden
      style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    />
  );
}

/* ─── Nav ─────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#050505]/70 backdrop-blur-xl border-b border-white/[0.06]" : ""
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="text-sm font-medium tracking-tight text-white/90">
          PTW Consulting
        </span>
        <button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className="text-xs font-medium px-4 py-1.5 rounded-full bg-white/[0.08] text-white/80 hover:bg-white/[0.14] border border-white/[0.06] transition-all duration-200 hover:text-white"
        >
          Get in touch
        </button>
      </div>
    </header>
  );
}

/* ─── Hero ─────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6">
      <MeshGradient />
      <DotGrid />
      <div className="max-w-5xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-xs text-white/50 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI Transformation
          </div>
          <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.08] text-white">
            You built something great.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Now let AI take it further.
            </span>
          </h1>
          <p className="text-lg text-white/40 max-w-lg leading-relaxed">
            We help small businesses adopt AI successfully — faster
            operations, less busywork, real results.
          </p>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-2 px-6 py-2.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Start the conversation
          </button>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── HALO ─────────────────────────────────────────────────────────────── */
function Halo() {
  return (
    <section className="py-24 px-6 relative">
      <DotGrid />
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-8 font-mono">
            Who we work with
          </p>
        </FadeIn>
        <FadeIn delay={0.06}>
          <div className="rounded-2xl p-10 sm:p-14 bg-white/[0.02] border border-white/[0.06] relative overflow-hidden">
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-[80px]" />
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4 relative">
              HALO Businesses
            </h2>
            <p className="text-base text-white/40 max-w-2xl mb-6 leading-relaxed relative">
              <span className="text-white/70 font-medium">High Asset, Low Obsolescence.</span>{" "}
              Established companies with real revenue, real customers, and decades of domain
              expertise — but whose operations haven&apos;t kept up with the technology.
            </p>
            <p className="text-base text-white/40 max-w-2xl leading-relaxed relative">
              These businesses aren&apos;t broken. They&apos;re underleveraged. AI doesn&apos;t
              replace what makes them great — it amplifies it.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Services ─────────────────────────────────────────────────────────── */
function Services() {
  const items = [
    {
      icon: "01",
      title: "AI Readiness",
      body: "Find where AI creates the most leverage in your business.",
    },
    {
      icon: "02",
      title: "Workflow Automation",
      body: "Automate the repetitive work that slows your team down.",
    },
    {
      icon: "03",
      title: "Custom Tooling",
      body: "Purpose-built AI tools designed for how you actually operate.",
    },
    {
      icon: "04",
      title: "Team Enablement",
      body: "Train your people until AI is just part of how things run.",
    },
  ];

  return (
    <section className="py-24 px-6 relative">
      <DotGrid />
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-8 font-mono">
            What we do
          </p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.06}>
              <div className="group rounded-2xl p-7 bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300">
                <span className="text-sm font-mono text-white/20 group-hover:text-indigo-400 transition-colors">
                  {s.icon}
                </span>
                <h3 className="text-lg font-medium text-white/90 mt-4 mb-2">
                  {s.title}
                </h3>
                <p className="text-sm text-white/40 leading-relaxed">{s.body}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Case Study ───────────────────────────────────────────────────────── */
function CaseStudy() {
  return (
    <section id="work" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-10 sm:p-14 relative overflow-hidden">
            {/* subtle accent glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-[80px]" />

            <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-4 font-mono relative">
              Case Study
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4 relative">
              Boston Tree Preservation
            </h2>
            <p className="text-base text-white/40 max-w-lg mb-10 leading-relaxed relative">
              Modernized a 45-year-old company from paper to digital — and
              unlocked it for a successful acquisition.
            </p>
            <div className="flex flex-wrap gap-2 relative">
              {["Paper → Digital", "Salesforce CRM", "40+ person team", "Acquisition-ready"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-sm px-4 py-1.5 rounded-full bg-white/[0.06] text-white/50 border border-white/[0.06]"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Team ──────────────────────────────────────────────────────────────── */
function Team() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-8 font-mono">
            The team
          </p>
        </FadeIn>
        <div className="grid sm:grid-cols-2 gap-6">
          {[
            {
              name: "Pete Wild",
              role: "Managing Partner",
              bio: "Quant fund co-founder. FAANG AI product exec. Led the digital transformation that unlocked Boston Tree Preservation for acquisition.",
            },
            {
              name: "Dejan Cabrilo",
              role: "Technical Partner",
              bio: "Former CTO of Theme Analytics. 7 years as Director of Engineering at Bonfire.com. Extensive crypto experience. AI-native.",
            },
          ].map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.08}>
              <div className="rounded-2xl p-7 bg-white/[0.02] border border-white/[0.06]">
                <h3 className="text-lg font-medium text-white">{p.name}</h3>
                <p className="text-sm text-indigo-400/70 mb-3">{p.role}</p>
                <p className="text-base text-white/40 leading-relaxed">{p.bio}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ──────────────────────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <FadeIn>
            <h2 className="text-4xl font-semibold tracking-tight text-white mb-3">
              Let&apos;s talk.
            </h2>
            <p className="text-base text-white/40">
              We take on a small number of clients at a time.
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ───────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-6 py-5">
      <div className="max-w-5xl mx-auto flex justify-between items-center text-xs text-white/25">
        <span>© {new Date().getFullYear()} PTW Consulting LLC</span>
        <span>Miami, FL</span>
      </div>
    </footer>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Halo />
        <Services />
        <CaseStudy />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
