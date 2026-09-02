import React, { useEffect, useState } from 'react';
import {
  Star,
  Users,
  FolderGit2,
  ExternalLink,
  Search,
  Sparkles,
  GitBranch,
  Flame,
  Code2,
  RefreshCw,
} from 'lucide-react';
import {
  GitHubProfile,
  GitHubRepo,
  GitHubLanguageBreakdown,
  GitHubActivity,
  GitHubContributionData,
} from '../types';
import { api } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { GithubIcon } from '../components/ui/Icons';
import { ContributionGraph } from '../components/github/ContributionGraph';
import { RepoCard } from '../components/github/RepoCard';
import { LanguageBreakdown } from '../components/github/LanguageBreakdown';
import { ActivityTimeline } from '../components/github/ActivityTimeline';

export const GitHubPage: React.FC = () => {
  const [profile, setProfile] = useState<GitHubProfile | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [languages, setLanguages] = useState<GitHubLanguageBreakdown | null>(null);
  const [activity, setActivity] = useState<GitHubActivity[]>([]);
  const [contributions, setContributions] = useState<GitHubContributionData | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // SEO title
    document.title = 'GitHub & Open Source Activity | Mrityunjay Kumar';

    api.analytics.track({ path: '/github', type: 'PAGE_VIEW' });

    const fetchAllGitHubData = async () => {
      try {
        const [profData, reposData, langData, actData, contribData] = await Promise.all([
          api.github.getProfile(),
          api.github.getRepositories(),
          api.github.getLanguages(),
          api.github.getActivity(),
          api.github.getContributions(),
        ]);

        setProfile(profData);
        setRepos(reposData);
        setLanguages(langData);
        setActivity(actData);
        setContributions(contribData);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllGitHubData();
  }, []);

  const categories = ['All', 'AI', 'Full Stack', 'Backend', 'Frontend', 'DevOps', 'Other'];

  const filteredRepos = repos.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.language && r.language.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredRepos = repos.filter((r) => r.featured);

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500/20 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
              Open Source & Public Activity
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              Developer & GitHub Activity
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
              Real-time synchronization of open-source repositories, code commits, and contribution analytics.
            </p>
          </div>

          {/* GitHub Profile Card */}
          {profile && (
            <div className="bg-dark-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
                {/* Avatar & Bio */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                  <div className="relative group">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-brand-500/40 bg-dark-950 shadow-2xl">
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-dark-900 border border-slate-700 text-slate-300 shadow-md">
                      <GithubIcon size={16} />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                      <h2 className="text-2xl font-extrabold text-white tracking-tight">
                        {profile.name}
                      </h2>
                      <span className="text-xs font-mono text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
                        @{profile.username}
                      </span>
                    </div>

                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {profile.bio}
                    </p>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-400 pt-1">
                      {profile.location && <span>📍 {profile.location}</span>}
                      {profile.blog && (
                        <a
                          href={profile.blog}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-brand-400 underline underline-offset-2"
                        >
                          🔗 {profile.blog}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct CTA */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 w-full lg:w-auto">
                  <a
                    href={profile.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      leftIcon={<GithubIcon size={18} />}
                      rightIcon={<ExternalLink className="w-4 h-4" />}
                    >
                      View GitHub Profile
                    </Button>
                  </a>
                </div>
              </div>

              {/* Statistics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-slate-800/80">
                <div className="bg-dark-950/70 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-mono">
                    <FolderGit2 className="w-3.5 h-3.5 text-brand-400" />
                    <span>Public Repos</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white font-mono">{profile.publicRepos}</p>
                </div>

                <div className="bg-dark-950/70 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-mono">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>Total Stars</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white font-mono">{profile.totalStars}</p>
                </div>

                <div className="bg-dark-950/70 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-mono">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Followers</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white font-mono">{profile.followers}</p>
                </div>

                <div className="bg-dark-950/70 border border-slate-800/80 rounded-2xl p-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs font-mono">
                    <Flame className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Contributions</span>
                  </div>
                  <p className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {contributions?.totalContributions || 642}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 52-Week Contribution Heatmap */}
          {contributions && <ContributionGraph data={contributions} />}

          {/* Language Breakdown Bar */}
          {languages && <LanguageBreakdown data={languages} />}

          {/* Featured Repositories Section */}
          {featuredRepos.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Featured Repositories
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {featuredRepos.length} highlighted
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredRepos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </div>
          )}

          {/* All Public Repositories with Filter Tabs & Search */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  All Repositories
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Browse open source libraries, tools, and full-stack platforms
                </p>
              </div>

              <div className="w-full md:w-72">
                <Input
                  type="text"
                  placeholder="Filter repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4 text-slate-500" />}
                  className="py-2 text-xs"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/20 border border-brand-500/30 font-semibold'
                      : 'bg-dark-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Repositories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>

            {filteredRepos.length === 0 && (
              <div className="bg-dark-900/50 border border-slate-800 rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
                <FolderGit2 className="w-8 h-8 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-200">No repositories found</h4>
                <p className="text-xs text-slate-400">
                  Try adjusting your filter category or search keywords.
                </p>
              </div>
            )}
          </div>

          {/* Activity Timeline Stream */}
          {activity.length > 0 && <ActivityTimeline events={activity} />}
        </div>
      </main>

      <Footer />
    </div>
  );
};
