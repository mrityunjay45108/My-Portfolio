import React from 'react';
import { ArrowDown, FileText, Send, Mail, Terminal } from 'lucide-react';
import { personalInfo } from '../../data/personal';
import { Button } from '../ui/Button';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';

export const HeroSection: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for Full-Time Roles & AI Engineering</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Hi, I'm{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
                  {personalInfo.name}
                </span>
              </h1>
              <p className="text-xl sm:text-2xl font-semibold text-slate-300 tracking-tight">
                {personalInfo.title}
              </p>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed font-normal">
              {personalInfo.tagline} Specializing in high-concurrency microservices, TypeScript/React architectures, and production-grade RAG and autonomous AI agents.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => scrollTo('featured-projects')}
                rightIcon={<ArrowDown className="w-4 h-4" />}
              >
                View Projects
              </Button>

              <a
                href={personalInfo.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="secondary"
                  size="lg"
                  leftIcon={<FileText className="w-4 h-4 text-brand-400" />}
                >
                  Download Resume
                </Button>
              </a>

              <Button
                variant="outline"
                size="lg"
                onClick={() => scrollTo('contact')}
                leftIcon={<Send className="w-4 h-4 text-cyan-400" />}
              >
                Contact Me
              </Button>
            </div>

            {/* Social Proof & Links */}
            <div className="pt-6 border-t border-slate-900/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-400 font-mono">
              <span className="text-xs text-slate-500 font-sans uppercase tracking-wider font-semibold">Connect:</span>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <GithubIcon size={16} />
                <span>GitHub</span>
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <LinkedinIcon size={16} className="text-blue-400" />
                <span>LinkedIn</span>
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>Email</span>
              </a>
            </div>
          </div>

          {/* Right Visual / Profile Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Decorative Corner Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-brand-500/30 to-cyan-500/30 blur-xl opacity-75 animate-pulse-slow pointer-events-none" />

              {/* Card Container */}
              <div className="relative bg-dark-900/90 border border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl">
                {/* Code Header Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Terminal className="w-3.5 h-3.5 text-brand-400" />
                    <span>engineer.config.ts</span>
                  </div>
                </div>

                {/* Simulated IDE / Profile Highlights */}
                <div className="py-5 font-mono text-xs sm:text-sm space-y-3 leading-relaxed text-slate-300">
                  <p className="text-slate-500">// Software Engineer Identity</p>
                  <p>
                    <span className="text-brand-400">const</span>{' '}
                    <span className="text-cyan-300">developer</span> = &#123;
                  </p>
                  <div className="pl-4 space-y-1.5">
                    <p>
                      <span className="text-slate-400">name:</span>{' '}
                      <span className="text-emerald-300">"{personalInfo.name}"</span>,
                    </p>
                    <p>
                      <span className="text-slate-400">role:</span>{' '}
                      <span className="text-emerald-300">"Full Stack | AI Engineer"</span>,
                    </p>
                    <p>
                      <span className="text-slate-400">coreStack:</span> [
                      <span className="text-amber-300">"React"</span>,{' '}
                      <span className="text-amber-300">"TypeScript"</span>,{' '}
                      <span className="text-amber-300">"Node.js"</span>,{' '}
                      <span className="text-amber-300">"PostgreSQL"</span>,{' '}
                      <span className="text-amber-300">"RAG/LLMs"</span>],
                    </p>
                    <p>
                      <span className="text-slate-400">dsaSolved:</span>{' '}
                      <span className="text-cyan-400">250</span>, <span className="text-slate-500">// LeetCode</span>
                    </p>
                    <p>
                      <span className="text-slate-400">focus:</span>{' '}
                      <span className="text-emerald-300">"Distributed Systems & GenAI"</span>
                    </p>
                  </div>
                  <p>&#125;;</p>
                </div>

                {/* Quick Interactive Stat Badges */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800/80">
                  <div className="bg-dark-950/60 border border-slate-800/80 rounded-2xl p-3 text-center">
                    <p className="text-lg sm:text-xl font-extrabold text-white font-mono">250+</p>
                    <p className="text-[11px] text-slate-400 font-medium">LeetCode Problems</p>
                  </div>
                  <div className="bg-dark-950/60 border border-slate-800/80 rounded-2xl p-3 text-center">
                    <p className="text-lg sm:text-xl font-extrabold text-brand-400 font-mono">100%</p>
                    <p className="text-[11px] text-slate-400 font-medium">Clean Code & Tests</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
