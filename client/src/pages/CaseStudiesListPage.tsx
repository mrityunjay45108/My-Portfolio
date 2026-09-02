import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { CaseStudy } from '../types';
import { api } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const CaseStudiesListPage: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.analytics.track({ path: '/case-studies', type: 'PAGE_VIEW' });

    const fetchCaseStudies = async () => {
      try {
        const data = await api.caseStudies.getAll();
        setCaseStudies(data);
      } catch (err) {
        console.error('Error fetching case studies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              In-Depth System Documentation
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Engineering Case Studies
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Detailed technical breakdowns of real architectural decisions, benchmarking, concurrency challenges, and solutions.
            </p>
          </div>

          {/* Case Studies List */}
          <div className="space-y-8 max-w-5xl mx-auto">
            {caseStudies.map((cs) => {
              const techList = Array.isArray(cs.technologies)
                ? cs.technologies.map((t: any) => (typeof t === 'string' ? t : t.technology?.name || t.name)).filter(Boolean)
                : [];

              return (
                <div
                  key={cs.id}
                  className="bg-dark-900/60 hover:bg-dark-900/90 border border-slate-800/80 hover:border-brand-500/40 rounded-3xl p-6 sm:p-8 lg:p-10 transition-all shadow-xl group space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="brand" size="sm">
                        Technical Case Study
                      </Badge>
                      {cs.featured && (
                        <Badge variant="cyan" size="sm">
                          Flagship Deep Dive
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-500">
                      {new Date(cs.publishedAt || cs.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <Link to={`/case-studies/${cs.slug}`} className="block">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-brand-400 transition-colors tracking-tight">
                        {cs.title}
                      </h2>
                    </Link>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-3">
                      {cs.summary}
                    </p>
                  </div>

                  {/* Problem / Results Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="bg-dark-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-1.5">
                      <span className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
                        Core Problem
                      </span>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {cs.problem}
                      </p>
                    </div>

                    {cs.results && (
                      <div className="bg-dark-950/70 border border-slate-800/80 rounded-2xl p-4 space-y-1.5">
                        <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                          Measurable Outcome
                        </span>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                          {cs.results}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                    <div className="flex flex-wrap gap-1.5">
                      {techList.map((t, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-mono px-2.5 py-1 rounded-lg bg-dark-950 border border-slate-800 text-slate-300 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <Link to={`/case-studies/${cs.slug}`}>
                      <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        Read Case Study
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
