import React from 'react';
import { Brain, Cpu, Server, Cloud, Code2, Sparkles, CheckCircle2 } from 'lucide-react';
import { personalInfo } from '../../data/personal';

export const AboutSection: React.FC = () => {
  const highlights = [
    {
      icon: Brain,
      title: 'AI & GenAI Systems',
      description: 'Building production RAG pipelines, LLM fine-tuning, autonomous agents, and structured prompt engineering.',
    },
    {
      icon: Server,
      title: 'Scalable Backend Architecture',
      description: 'Designing high-throughput REST & WebSocket APIs, event-driven microservices, and database optimization.',
    },
    {
      icon: Cpu,
      title: 'Full Stack Engineering',
      description: 'End-to-end development with React, TypeScript, Next.js, and Node.js with strict type-safety.',
    },
    {
      icon: Cloud,
      title: 'Cloud & DevOps',
      description: 'Docker containerization, Kubernetes orchestration, Redis caching, and automated CI/CD workflows.',
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineering High-Impact Applications & AI Solutions
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            A software engineer dedicated to building performant web applications and intelligent AI-assisted workflows.
          </p>
        </div>

        {/* Bio & Focus Area Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Bio text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-dark-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <span>Professional Background</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {personalInfo.bio}
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                My focus centers on high-concurrency microservices, robust relational databases (PostgreSQL + Prisma), and integrating LLM-driven generative intelligence into software products that solve real-world problems.
              </p>

              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>250+ LeetCode problems solved with algorithmic rigor</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Clean architecture, SOLID principles & robust error handling</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>TCS National Qualifier Test (NQT) Qualified</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Pillars Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-dark-900/40 hover:bg-dark-900/80 border border-slate-800 hover:border-brand-500/40 rounded-3xl p-6 transition-all duration-300 group shadow-sm hover:shadow-xl hover:shadow-brand-500/5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 flex items-center justify-center transition-colors mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-100 group-hover:text-white transition-colors mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Highlighted Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {personalInfo.stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-dark-900/60 border border-slate-800/80 rounded-2xl p-5 text-center transition-all hover:border-slate-700"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-300 font-mono">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-200 mt-1">{stat.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.sublabel}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
