import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, CheckCircle } from 'lucide-react';
import { Project } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { GithubIcon } from '../ui/Icons';
import { trackProjectGithubClick, trackProjectLiveDemoClick } from '../../services/analytics';

export interface FeaturedProjectsProps {
  projects: Project[];
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects }) => {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="featured-projects" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Featured Engineering Work
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Flagship Applications & Architectures
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            In-depth projects demonstrating full-stack scalability, AI integration, and robust system design.
          </p>
        </div>

        {/* Alternating Project Showcases */}
        <div className="space-y-16 lg:space-y-24">
          {projects.map((project, index) => {
            const isEven = index % 2 === 0;
            const techList: string[] = Array.isArray(project.technologies)
              ? project.technologies.map((t: any) => (typeof t === 'string' ? t : t.technology?.name || t.name)).filter(Boolean)
              : [];

            const imageSrc = project.images?.[0]?.url || project.architectureImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80';

            return (
              <div
                key={project.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-dark-900/40 border border-slate-800/80 rounded-3xl p-6 sm:p-8 lg:p-10"
              >
                {/* Visual Image Column */}
                <div
                  className={`lg:col-span-7 ${
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  <Link
                    to={`/projects/${project.slug}`}
                    className="block relative rounded-2xl overflow-hidden group shadow-2xl border border-slate-800"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-dark-950">
                      <img
                        src={imageSrc}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-dark-950/20 group-hover:bg-transparent transition-colors" />
                  </Link>
                </div>

                {/* Text Content Column */}
                <div
                  className={`lg:col-span-5 space-y-5 ${
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan" size="sm">
                      {project.category}
                    </Badge>
                    <Badge variant="brand" size="sm">
                      Featured Architecture
                    </Badge>
                  </div>

                  <Link to={`/projects/${project.slug}`} className="block group">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white group-hover:text-brand-400 transition-colors tracking-tight">
                      {project.title}
                    </h3>
                  </Link>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {/* Highlights / Features List */}
                  {project.features && project.features.length > 0 && (
                    <ul className="space-y-2 pt-1">
                      {project.features.slice(0, 2).map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-400">
                          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-slate-200 font-semibold">{feat.title}:</strong> {feat.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {techList.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-xs font-mono px-2.5 py-1 rounded-lg bg-dark-950 border border-slate-800 text-slate-300 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Action CTAs */}
                  <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
                    <Link to={`/projects/${project.slug}`}>
                      <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        View Details
                      </Button>
                    </Link>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackProjectLiveDemoClick(project.slug)}
                      >
                        <Button
                          variant="secondary"
                          size="md"
                          leftIcon={<ExternalLink className="w-4 h-4 text-cyan-400" />}
                        >
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
                        <Button
                          variant="outline"
                          size="md"
                          leftIcon={<GithubIcon size={16} className="text-slate-300" />}
                        >
                          GitHub
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
