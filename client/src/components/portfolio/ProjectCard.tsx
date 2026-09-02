import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Project } from '../../types';
import { Badge } from '../ui/Badge';
import { GithubIcon } from '../ui/Icons';

export interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const techList: string[] = Array.isArray(project.technologies)
    ? project.technologies.map((t: any) => (typeof t === 'string' ? t : t.technology?.name || t.name)).filter(Boolean)
    : [];

  const thumbnail = project.images?.[0]?.url || project.architectureImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-dark-900/60 hover:bg-dark-900/90 border border-slate-800/80 hover:border-brand-500/40 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col group shadow-lg hover:shadow-2xl hover:shadow-brand-500/10">
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-dark-950">
        <img
          src={thumbnail}
          alt={project.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3">
          <Badge variant="cyan" size="sm">
            {project.category}
          </Badge>
        </div>

        {/* Featured Tag */}
        {project.featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="brand" size="sm">
              Featured
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <Link
            to={`/projects/${project.slug}`}
            className="block group-hover:text-brand-400 transition-colors"
          >
            <h3 className="text-lg font-bold text-slate-100 group-hover:text-brand-300 transition-colors line-clamp-1">
              {project.title}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {project.shortDescription}
          </p>
        </div>

        {/* Tech Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {techList.slice(0, 4).map((techName, idx) => (
            <span
              key={idx}
              className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-dark-950 border border-slate-800 text-slate-400"
            >
              {techName}
            </span>
          ))}
          {techList.length > 4 && (
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-dark-950 border border-slate-800 text-slate-500">
              +{techList.length - 4}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="GitHub Code"
                aria-label="View source code on GitHub"
              >
                <GithubIcon size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                title="Live Demo"
                aria-label="View live demo website"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors group/link"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
