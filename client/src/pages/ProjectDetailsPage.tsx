import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2,
  Cpu,
  Video,
  Image as ImageIcon,
  Share2,
} from 'lucide-react';
import { Project } from '../types';
import { api } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { VideoPlayer } from '../components/ui/VideoPlayer';
import { Lightbox } from '../components/portfolio/Lightbox';
import { useToast } from '../context/ToastContext';
import { GithubIcon } from '../components/ui/Icons';
import { trackProjectGithubClick, trackProjectLiveDemoClick } from '../services/analytics';

export const ProjectDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { success } = useToast();

  useEffect(() => {
    if (!slug) return;

    api.analytics.track({
      path: `/projects/${slug}`,
      type: 'PROJECT_VIEW',
      resourceId: slug,
    });

    const fetchProject = async () => {
      try {
        const data = await api.projects.getBySlug(slug);
        setProject(data);
      } catch (err) {
        console.error('Project not found:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Project link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Project Not Found</h2>
          <p className="text-slate-400 text-sm mb-6">The project you are looking for does not exist or has been removed.</p>
          <Button variant="primary" onClick={() => navigate('/#projects')}>
            Back to All Projects
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const techList: string[] = Array.isArray(project.technologies)
    ? project.technologies.map((t: any) => (typeof t === 'string' ? t : t.technology?.name || t.name)).filter(Boolean)
    : [];

  const galleryImages = project.images && project.images.length > 0
    ? project.images
    : project.architectureImage
    ? [{ id: 'arch-1', url: project.architectureImage, altText: 'Architecture Diagram', order: 0 }]
    : [];

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Back Button & Navigation */}
          <div className="flex items-center justify-between">
            <Link
              to="/#projects"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Showcase</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-dark-900 border border-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Project</span>
            </button>
          </div>

          {/* Project Hero Header */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="cyan" size="md">
                {project.category}
              </Badge>
              {project.featured && (
                <Badge variant="brand" size="md">
                  Featured System
                </Badge>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {project.shortDescription}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackProjectLiveDemoClick(project.slug)}
                >
                  <Button variant="primary" size="lg" leftIcon={<ExternalLink className="w-4 h-4" />}>
                    Live Demo
                  </Button>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackProjectGithubClick(project.slug)}
                >
                  <Button variant="outline" size="lg" leftIcon={<GithubIcon size={16} />}>
                    Source Code
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* Main Cover / Architecture Hero Image */}
          {galleryImages.length > 0 && (
            <div
              className="relative aspect-video w-full rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-dark-900 cursor-pointer group"
              onClick={() => {
                setCurrentImageIndex(0);
                setLightboxOpen(true);
              }}
            >
              <img
                src={galleryImages[0].url}
                alt={project.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-dark-950/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute bottom-4 right-4 bg-dark-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-brand-400" />
                <span>Click to Expand Lightbox</span>
              </div>
            </div>
          )}

          {/* Project Overview */}
          <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span>Project Overview</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Key Features */}
          {project.features && project.features.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Key Features & Capabilities</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="bg-dark-900/50 border border-slate-800/80 rounded-2xl p-5 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-400 inline-block" />
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technology Stack Grid */}
          <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Technology Stack & Integrations</span>
            </h2>
            <div className="flex flex-wrap gap-2 pt-2">
              {techList.map((t, idx) => (
                <div
                  key={idx}
                  className="px-3.5 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 font-mono text-xs sm:text-sm font-medium flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-brand-400" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Diagram Section */}
          {project.architectureDescription && (
            <div className="bg-dark-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                <span>Architecture & Data Flow</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {project.architectureDescription}
              </p>
              {project.architectureImage && (
                <div
                  className="mt-4 rounded-2xl overflow-hidden border border-slate-800/80 bg-[#070b13] cursor-pointer group shadow-2xl relative"
                  onClick={() => {
                    const archIndex = galleryImages.findIndex((g) => g.url === project.architectureImage);
                    setCurrentImageIndex(archIndex >= 0 ? archIndex : 0);
                    setLightboxOpen(true);
                  }}
                >
                  <img
                    src={project.architectureImage}
                    alt={`${project.title} Architecture & Data Flow Diagram`}
                    className="w-full h-auto max-h-[600px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 right-3 bg-dark-950/80 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-1.5 pointer-events-none">
                    <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Click to Zoom Diagram</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Screenshots Gallery */}
          {galleryImages.length > 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-400" />
                <span>Screenshots & Interface Previews</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {galleryImages.map((img, idx) => (
                  <div
                    key={img.id || idx}
                    className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-dark-900 cursor-pointer group hover:border-brand-500/50 transition-all"
                    onClick={() => {
                      setCurrentImageIndex(idx);
                      setLightboxOpen(true);
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.altText || `Screenshot ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-dark-950/30 group-hover:bg-transparent transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Demo Video Player */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-red-400" />
              <span>Demo Walkthrough Video</span>
            </h2>
            <VideoPlayer
              url={project.videoUrl}
              title={`${project.title} Demo`}
              poster={galleryImages[0]?.url}
            />
          </div>

          {/* Next / Prev Navigation and Footer Actions */}
          <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
            <Button variant="secondary" onClick={() => navigate('/#projects')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to All Projects
            </Button>

            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="primary" rightIcon={<ExternalLink className="w-4 h-4" />}>
                  Launch Application
                </Button>
              </a>
            )}
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        images={galleryImages}
        currentIndex={currentImageIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
        onNext={() => setCurrentImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
      />

      <Footer />
    </div>
  );
};
