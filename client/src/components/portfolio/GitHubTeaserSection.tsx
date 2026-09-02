import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, FolderGit2, Flame, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { GitHubProfile, GitHubRepo, GitHubContributionData } from '../../types';
import { api } from '../../services/api';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { GithubIcon } from '../ui/Icons';
import { RepoCard } from '../github/RepoCard';

export const GitHubTeaserSection: React.FC = () => {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [featuredRepos, setFeaturedRepos] = useState<GitHubRepo[]>([]);
  const [contributions, setContributions] = useState<GitHubContributionData | null>(null);

  useEffect(() => {
    const loadGitHubTeaser = async () => {
      try {
        const [prof, repos, contrib] = await Promise.all([
          api.github.getProfile(),
          api.github.getRepositories(),
          api.github.getContributions(),
        ]);
        setProfile(prof);
        setFeaturedRepos(repos.filter((r) => r.featured).slice(0, 3));
        setContributions(contrib);
      } catch (err) {
        console.error('GitHub teaser load failed:', err);
      }
    };

    loadGitHubTeaser();
  }, []);

  return (
    <section id="github-activity" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Live Open Source Stream
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              GitHub & Developer Activity
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Real-time synchronization of open-source projects, contributions, and code repositories.
            </p>
          </div>

          <Link to="/github" className="flex-shrink-0">
            <Button
              variant="primary"
              size="md"
              leftIcon={<GithubIcon size={16} />}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Explore my GitHub
            </Button>
          </Link>
        </div>

        {/* Quick Stats Grid */}
        {profile && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="bg-dark-900/60 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-mono">
                <FolderGit2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Public Repos</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white font-mono">{profile.publicRepos}</p>
            </div>

            <div className="bg-dark-900/60 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-mono">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Stars Received</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white font-mono">{profile.totalStars}</p>
            </div>

            <div className="bg-dark-900/60 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-mono">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>Followers</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-white font-mono">{profile.followers}</p>
            </div>

            <div className="bg-dark-900/60 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-mono">
                <Flame className="w-3.5 h-3.5 text-emerald-400" />
                <span>Contributions</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono">
                {contributions?.totalContributions || 642}
              </p>
            </div>
          </div>
        )}

        {/* Featured Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredRepos.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-10 p-6 rounded-3xl bg-dark-900/40 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center flex-shrink-0">
              <GithubIcon size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">Want to inspect full commit telemetry and activity?</h4>
              <p className="text-xs text-slate-400">View detailed contribution heatmaps, language breakdowns, and public events.</p>
            </div>
          </div>

          <Link to="/github">
            <Button variant="secondary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Open Developer Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
