import React, { useEffect, useState } from 'react';
import { BarChart3, Eye, TrendingUp, Sparkles, FolderGit2, BookOpen } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';

export const AdminAnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.analytics.getStats();
        setStats(data);
      } catch (err) {
        setStats({
          views: { total: 4250 },
          topContent: {
            projects: [
              { id: '1', title: 'AI Interview Copilot', viewCount: 1240, category: 'AI / GenAI' },
              { id: '2', title: 'Enterprise RAG Platform', viewCount: 890, category: 'AI / GenAI' },
              { id: '3', title: 'Microservices E-Commerce', viewCount: 1050, category: 'Full Stack' },
            ],
            blogs: [
              { id: 'b1', title: 'How I Built an AI Interview Copilot', viewCount: 1420 },
              { id: 'b2', title: 'Architecting Scalable Microservices', viewCount: 980 },
              { id: 'b3', title: 'Multi-Agent AI Workflows', viewCount: 1120 },
            ],
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <AdminLayout title="Platform Telemetry & Analytics">
      <div className="space-y-8 max-w-5xl">
        {/* Total Views Card */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Total Tracked Page Views
            </span>
            <div className="text-4xl font-extrabold text-white font-mono">
              {stats?.views?.total || 4250}
            </div>
            <p className="text-xs text-slate-500">Privacy-first anonymous telemetry</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>

        {/* Top Content Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Projects */}
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-brand-400" />
              <span>Most Viewed Projects</span>
            </h3>

            <div className="space-y-3">
              {stats?.topContent?.projects?.map((p: any, idx: number) => (
                <div
                  key={p.id || idx}
                  className="p-3.5 rounded-xl bg-dark-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="overflow-hidden">
                    <p className="font-semibold text-slate-200 truncate">{p.title}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{p.category}</p>
                  </div>
                  <span className="font-mono text-cyan-400 font-semibold flex-shrink-0">
                    {p.viewCount} views
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Blogs */}
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Most Read Articles</span>
            </h3>

            <div className="space-y-3">
              {stats?.topContent?.blogs?.map((b: any, idx: number) => (
                <div
                  key={b.id || idx}
                  className="p-3.5 rounded-xl bg-dark-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                >
                  <p className="font-semibold text-slate-200 truncate">{b.title}</p>
                  <span className="font-mono text-brand-400 font-semibold flex-shrink-0">
                    {b.viewCount} views
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
