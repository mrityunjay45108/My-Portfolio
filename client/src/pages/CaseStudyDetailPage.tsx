import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Shield,
  Zap,
  Cpu,
  Target,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  Image as ImageIcon,
  Share2,
} from 'lucide-react';
import { CaseStudy } from '../types';
import { api } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';
import { Lightbox } from '../components/portfolio/Lightbox';
import { useToast } from '../context/ToastContext';
import { GithubIcon } from '../components/ui/Icons';

export const CaseStudyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { success } = useToast();

  useEffect(() => {
    if (!slug) return;

    api.analytics.track({
      path: `/case-studies/${slug}`,
      type: 'CASE_STUDY_VIEW',
      resourceId: slug,
    });

    const fetchCaseStudy = async () => {
      try {
        const data = await api.caseStudies.getBySlug(slug);
        setCaseStudy(data);
      } catch (err) {
        console.error('Case study not found:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Case study link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!caseStudy) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Case Study Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">The engineering case study could not be located.</p>
          <Button variant="primary" onClick={() => navigate('/case-studies')}>
            Back to Case Studies
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = caseStudy.images || [];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Back & Action */}
          <div className="flex items-center justify-between">
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Case Studies</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-dark-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Header */}
          <header className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="brand" size="md">
                System Architecture Deep Dive
              </Badge>
              {caseStudy.featured && (
                <Badge variant="cyan" size="md">
                  Featured
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {caseStudy.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {caseStudy.summary}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {caseStudy.liveUrl && (
                <a href={caseStudy.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" size="md" leftIcon={<ExternalLink className="w-4 h-4" />}>
                    Live Demo
                  </Button>
                </a>
              )}
              {caseStudy.githubUrl && (
                <a href={caseStudy.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="md" leftIcon={<GithubIcon size={16} />}>
                    GitHub Repository
                  </Button>
                </a>
              )}
            </div>
          </header>

          {/* Architecture Image if available */}
          {caseStudy.architectureImage && (
            <div className="aspect-video w-full rounded-3xl overflow-hidden border border-slate-800 bg-dark-900 shadow-2xl">
              <img
                src={caseStudy.architectureImage}
                alt="Architecture Diagram"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Problem & Background */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>The Engineering Problem</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {caseStudy.problem}
              </p>
            </div>

            {caseStudy.background && (
              <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
                  <BookOpen className="w-5 h-5" />
                  <span>Context & Background</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {caseStudy.background}
                </p>
              </div>
            )}
          </div>

          {/* Project Goals */}
          {caseStudy.goals && (
            <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
                <Target className="w-5 h-5" />
                <span>Project Objectives & Requirements</span>
              </div>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {caseStudy.goals}
              </p>
            </div>
          )}

          {/* Architecture & Implementation */}
          {(caseStudy.architecture || caseStudy.implementation) && (
            <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
              {caseStudy.architecture && (
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-brand-400" />
                    <span>System Architecture Overview</span>
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {caseStudy.architecture}
                  </p>
                </div>
              )}

              {caseStudy.implementation && (
                <div className="space-y-3 pt-4 border-t border-slate-800/80">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Implementation Details</span>
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {caseStudy.implementation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Challenges & Solutions */}
          {(caseStudy.challenges || caseStudy.solutions) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caseStudy.challenges && (
                <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-base">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Technical Challenges Encountered</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {caseStudy.challenges}
                  </p>
                </div>
              )}

              {caseStudy.solutions && (
                <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                    <Lightbulb className="w-5 h-5" />
                    <span>Engineered Solutions</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {caseStudy.solutions}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Security & Performance Benchmarks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudy.security && (
              <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-base">
                  <Shield className="w-5 h-5" />
                  <span>Security & Hardening</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {caseStudy.security}
                </p>
              </div>
            )}

            {caseStudy.performance && (
              <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
                  <Zap className="w-5 h-5" />
                  <span>Performance Optimization & Metrics</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {caseStudy.performance}
                </p>
              </div>
            )}
          </div>

          {/* Results & Measurable Outcomes */}
          {caseStudy.results && (
            <div className="bg-gradient-to-r from-emerald-950/30 to-dark-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span>Measurable Results & Outcomes</span>
              </div>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {caseStudy.results}
              </p>
            </div>
          )}

          {/* Additional Structured Sections */}
          {caseStudy.sections && caseStudy.sections.length > 0 && (
            <div className="space-y-6">
              {caseStudy.sections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-3"
                >
                  <h3 className="text-lg font-bold text-white">{sec.title}</h3>
                  <MarkdownRenderer content={sec.content} />
                </div>
              ))}
            </div>
          )}

          {/* Screenshots Lightbox */}
          {images.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <span>System Visuals & Telemetry</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-dark-900 cursor-pointer group hover:border-brand-500/50 transition-colors"
                    onClick={() => {
                      setCurrentImageIndex(idx);
                      setLightboxOpen(true);
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.caption || `Telemetry ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lessons Learned */}
          {caseStudy.lessonsLearned && (
            <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-cyan-400" />
                <span>Key Takeaways & Lessons Learned</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {caseStudy.lessonsLearned}
              </p>
            </div>
          )}

          {/* Footer Back action */}
          <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
            <Button variant="secondary" onClick={() => navigate('/case-studies')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Case Studies
            </Button>
          </div>
        </div>
      </main>

      <Lightbox
        isOpen={lightboxOpen}
        images={images}
        currentIndex={currentImageIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
        onNext={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
      />

      <Footer />
    </div>
  );
};
