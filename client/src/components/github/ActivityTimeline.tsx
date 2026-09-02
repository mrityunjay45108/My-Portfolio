import React from 'react';
import { GitCommit, GitPullRequest, GitMerge, PlusCircle, Star, Tag, Clock, ExternalLink } from 'lucide-react';
import { GitHubActivity } from '../../types';

interface ActivityTimelineProps {
  events: GitHubActivity[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return <GitCommit className="w-4 h-4 text-emerald-400" />;
      case 'CreateEvent':
        return <PlusCircle className="w-4 h-4 text-brand-400" />;
      case 'PullRequestEvent':
        return <GitPullRequest className="w-4 h-4 text-purple-400" />;
      case 'ReleaseEvent':
        return <Tag className="w-4 h-4 text-amber-400" />;
      case 'WatchEvent':
        return <Star className="w-4 h-4 text-yellow-400" />;
      default:
        return <GitMerge className="w-4 h-4 text-cyan-400" />;
    }
  };

  const formatRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return new Date(isoString).toLocaleDateString();
  };

  return (
    <div className="bg-dark-900/70 border border-slate-800/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">Latest GitHub Activity</h3>
        </div>
        <span className="text-xs font-mono text-slate-500">Live public event stream</span>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-2xl bg-dark-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-dark-900 border border-slate-800 flex-shrink-0">
                  {getEventIcon(event.type)}
                </div>
                <a
                  href={event.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-xs sm:text-sm text-slate-200 hover:text-brand-400 transition-colors truncate"
                >
                  {event.repoName}
                </a>
              </div>

              <span className="text-[11px] font-mono text-slate-500 flex-shrink-0">
                {formatRelativeTime(event.createdAt)}
              </span>
            </div>

            <p className="text-xs text-slate-400 pl-8 leading-relaxed">
              {event.description}
            </p>

            {/* Commits list if available */}
            {event.commits && event.commits.length > 0 && (
              <div className="pl-8 space-y-1.5 pt-1">
                {event.commits.slice(0, 3).map((c, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                    <span className="px-1.5 py-0.5 rounded bg-dark-900 border border-slate-800 text-brand-300 text-[10px]">
                      {c.sha}
                    </span>
                    <span className="truncate">{c.message}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {events.length === 0 && (
          <p className="text-center text-xs text-slate-500 py-6">
            No recent public activity recorded.
          </p>
        )}
      </div>
    </div>
  );
};
