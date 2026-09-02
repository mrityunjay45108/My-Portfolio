import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUp } from 'lucide-react';
import { personalInfo } from '../../data/personal';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-950 border-t border-slate-900 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-brand-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white font-mono font-bold text-xs shadow-md shadow-brand-500/20">
                MK
              </div>
              <span className="font-bold text-lg text-slate-100">{personalInfo.name}</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              {personalInfo.title}. Specializing in high-throughput backend microservices, distributed systems, and intelligent Generative AI & RAG solutions.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition-all hover:scale-105"
                aria-label="GitHub"
              >
                <GithubIcon size={16} />
              </a>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition-all hover:scale-105"
                aria-label="LinkedIn"
              >
                <LinkedinIcon size={16} />
              </a>
              <a
                href={`mailto:${personalInfo.email}`}
                className="w-9 h-9 rounded-xl bg-dark-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 flex items-center justify-center transition-all hover:scale-105"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Platform & Work
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="/#featured-projects" className="hover:text-brand-400 transition-colors">
                  Featured Projects
                </a>
              </li>
              <li>
                <a href="/#projects" className="hover:text-brand-400 transition-colors">
                  All Projects
                </a>
              </li>
              <li>
                <Link to="/github" className="hover:text-brand-400 transition-colors">
                  GitHub & Open Source
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="hover:text-brand-400 transition-colors">
                  Architecture Case Studies
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-brand-400 transition-colors">
                  Engineering Blog
                </Link>
              </li>
              <li>
                <a href="/#skills" className="hover:text-brand-400 transition-colors">
                  Tech Stack & Skills
                </a>
              </li>
            </ul>
          </div>

          {/* Background & Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-4 font-mono">
              Background & Direct
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="/#experience" className="hover:text-brand-400 transition-colors">
                  Experience & Roles
                </a>
              </li>
              <li>
                <a href="/#education" className="hover:text-brand-400 transition-colors">
                  Education & Honors
                </a>
              </li>
              <li>
                <a href="/#achievements" className="hover:text-brand-400 transition-colors">
                  LeetCode & Achievements
                </a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-brand-400 transition-colors">
                  Contact Form
                </a>
              </li>
              <li>
                <Link to="/admin" className="text-slate-500 hover:text-slate-300 transition-colors text-xs">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-12 border-t border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              Built with React, TypeScript & Node.js
            </span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white p-2 rounded-lg bg-dark-900 border border-slate-800 transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
