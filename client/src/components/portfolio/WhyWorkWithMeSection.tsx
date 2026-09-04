import React from 'react';
import {
  Code2,
  Server,
  Brain,
  Database,
  Cloud,
  CheckCircle2,
  FileText,
  Mail,
  Zap,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { personalInfo } from '../../data/personal';
import { useResume } from '../../context/ResumeContext';
import { trackResumeDownload } from '../../services/analytics';
import { Button } from '../ui/Button';

export const WhyWorkWithMeSection: React.FC = () => {
  const { resumeUrl } = useResume();
  const pillars = [
    {
      icon: Code2,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      title: 'Full-Stack Architecture & Speed',
      description:
        'Building scalable web applications with React 19, TypeScript, Next.js, and Node.js. Strict type safety, clean code patterns, and responsive UI ergonomics.',
      highlights: ['React & Next.js Ecosystem', 'TypeScript Type-Safety', 'State Management & Caching'],
    },
    {
      icon: Brain,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      title: 'AI, LLMs & Production RAG Systems',
      description:
        'Integrating generative AI into software products. Specializing in semantic embeddings (pgvector), sub-second audio Whisper ASR, AI agent tool calling, and deterministic evaluation rubrics.',
      highlights: ['RAG Pipeline Architecture', 'pgvector & Hybrid Search', 'Zero-Hallucination Guardrails'],
    },
    {
      icon: Server,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      title: 'High-Throughput Backend & Microservices',
      description:
        'Engineering decoupled services capable of 10,000+ RPS. Designing event-driven architectures with RabbitMQ/Kafka, Redis caching, and Saga distributed transaction rollback patterns.',
      highlights: ['Event-Driven Microservices', 'Distributed Saga Transactions', 'Sub-45ms p99 Latency'],
    },
    {
      icon: Database,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: 'Database Design & Relational Mastery',
      description:
        'PostgreSQL with Prisma ORM and Supabase. Relational schema modeling, high-concurrency connection pooling, ACID guarantees, and sub-15ms HNSW vector indexing.',
      highlights: ['PostgreSQL & Prisma ORM', 'HNSW Vector Indexes', 'High-Concurrency Pooling'],
    },
    {
      icon: Cloud,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Cloud-Native & Production Reliability',
      description:
        'Docker containerization, automated CI/CD deployment pipelines, telemetry monitoring, and end-to-end token authentication with 99.8%+ uptime standards.',
      highlights: ['Docker & Containerization', 'Automated CI/CD Workflows', '99.8% Uptime Telemetry'],
    },
    {
      icon: Zap,
      color: 'text-brand-400 bg-brand-500/10 border-brand-500/20',
      title: 'Engineering Rigor & Problem Solving',
      description:
        'B.Tech in Computer Science (BEU) with 250+ LeetCode problems solved. Fast learner who ships business value independently or as part of a high-velocity product team.',
      highlights: ['250+ LeetCode Solved', 'B.Tech CSE Graduate', 'Fast Execution & Ownership'],
    },
  ];

  const handleResumeClick = () => {
    trackResumeDownload('why_work_with_me_section');
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  const handleContactClick = () => {
    const el = document.getElementById('contact');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="why-work-with-me" className="py-20 lg:py-28 relative bg-dark-950/80 border-t border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            For Recruiters & Engineering Leaders
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Work With Me
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            A battle-tested software engineer combining modern full-stack development, distributed microservices, and production AI engineering.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-dark-900/60 hover:bg-dark-900 border border-slate-800/80 hover:border-brand-500/40 transition-all duration-300 shadow-lg flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${pillar.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-slate-500">#0{idx + 1}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-white transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/60 space-y-2">
                  {pillar.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Recruiter Conversion CTA Banner */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-900/40 via-indigo-950/60 to-dark-900 border border-brand-500/30 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-mono font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Actively Interviewing • Ready to Join Immediately</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Looking for a high-impact developer for your team?
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Available for full-time Software Engineer, Full Stack, and AI Engineering positions worldwide (Remote or Onsite).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 flex-shrink-0">
            <Button
              variant="primary"
              size="lg"
              onClick={handleResumeClick}
              leftIcon={<FileText className="w-4 h-4" />}
            >
              Download Resume (PDF)
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleContactClick}
              leftIcon={<Mail className="w-4 h-4" />}
            >
              Contact Me Directly
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
