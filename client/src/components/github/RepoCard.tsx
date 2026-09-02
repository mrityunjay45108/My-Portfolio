import React from 'react';
import { Link } from 'react-router-dom';
import { Star, GitFork, ExternalLink, ArrowRight, Sparkles, FolderGit2 } from 'lucide-react';
import { GitHubRepo } from '../../types';
import { Badge } from '../ui/Badge';
import { GithubIcon } from '../ui/Icons';

interface RepoCardProps {
  repo: GitHubRepo;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572A5',
  'C++': '#f34b7d',
  C: '#555555',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Rust: '#dea584',
  Go: '#00ADD8',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  Default: '#64748b',
};

export const RepoCard: React.FC<RepoCardProps> = ({ repo }) => {
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Default : LANGUAGE_COLORS.Default;

  return (
    <div className="bg-dark-900/60 hover:bg-dark-900/90 border border-slate-800/80 hover:border-brand-500/40 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:shadow-brand-500/10">
      <div className="space-y-4">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="cyan" size="sm">
              {repo.category}
            </Badge>
            {repo.featured && (
              <Badge variant="brand" size="sm">
                Featured
              </Badge>
            )}
          </div>

          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Open on GitHub"
            aria-label={`Open ${repo.name} on GitHub`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Title */}
        <div>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-brand-400 transition-colors line-clamp-1 inline-flex items-center gap-2"
          >
            <FolderGit2 className="w-4 h-4 text-slate-500 group-hover:text-brand-400 flex-shrink-0" />
            <span>{repo.name}</span>
          </a>

          <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 mt-2 leading-relaxed">
            {repo.customDescription || repo.description}
          </p>
        </div>

        {/* Associated Portfolio Project banner if connected */}
        {repo.project && (
          <Link
            to={`/projects/${repo.project.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-xs font-semibold text-brand-300 hover:bg-brand-500/20 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>View Architecture Case Study</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </Link>
        )}

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {repo.topics.slice(0, 4).map((topic, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-dark-950 border border-slate-800 text-slate-400"
              >
                #{topic}
              </span>
            ))}
            {repo.topics.length > 4 && (
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-md bg-dark-950 border border-slate-800 text-slate-500">
                +{repo.topics.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Meta Footer */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: langColor }}
          />
          <span>{repo.language || 'Code'}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <Star className="w-3.5 h-3.5 text-amber-400" />
            {repo.stars}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <GitFork className="w-3.5 h-3.5 text-slate-500" />
            {repo.forks}
          </span>
        </div>
      </div>
    </div>
  );
};
