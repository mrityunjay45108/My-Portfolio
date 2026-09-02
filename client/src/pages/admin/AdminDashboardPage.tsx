import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  BookOpen,
  FileCode2,
  Mail,
  Eye,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.analytics.getStats();
        setStats(data);
      } catch (err) {
        // Fallback placeholder stats for offline/starting server
        setStats({
          projects: { total: 4, published: 4, featured: 3 },
          blogs: { total: 3, published: 3 },
          caseStudies: { total: 2, published: 2 },
          messages: { total: 0, unread: 0, recent: [] },
          views: { total: 4250 },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout
      title="Platform Dashboard"
      actionButton={
        <div className="flex items-center gap-2">
          <Link to="/admin/projects/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              New Project
            </Button>
          </Link>
          <Link to="/admin/blog/new">
            <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              New Article
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Projects</span>
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <FolderGit2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white font-mono">{stats?.projects?.total || 4}</div>
            <p className="text-xs text-slate-500">
              {stats?.projects?.published || 4} published • {stats?.projects?.featured || 3} featured
            </p>
          </div>

          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Blog Articles</span>
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white font-mono">{stats?.blogs?.total || 3}</div>
            <p className="text-xs text-slate-500">{stats?.blogs?.published || 3} published articles</p>
          </div>

          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Case Studies</span>
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <FileCode2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white font-mono">{stats?.caseStudies?.total || 2}</div>
            <p className="text-xs text-slate-500">{stats?.caseStudies?.published || 2} live case studies</p>
          </div>

          <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Messages</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white font-mono">{stats?.messages?.total || 0}</div>
            <p className="text-xs text-slate-500">{stats?.messages?.unread || 0} unread inquiries</p>
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/projects"
            className="bg-dark-900/60 hover:bg-dark-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dark-950 flex items-center justify-center text-brand-400">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-white">Manage Projects</h4>
                <p className="text-xs text-slate-500">Create, edit, and reorder</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/blog"
            className="bg-dark-900/60 hover:bg-dark-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dark-950 flex items-center justify-center text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-white">Blog CMS</h4>
                <p className="text-xs text-slate-500">Drafts and publications</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            to="/admin/messages"
            className="bg-dark-900/60 hover:bg-dark-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex items-center justify-between transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-dark-950 flex items-center justify-center text-emerald-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-white">Contact Inbox</h4>
                <p className="text-xs text-slate-500">Read & reply to visitors</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
        </div>

        {/* Recent Messages & System Status */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-400" />
              <span>Recent Contact Inquiries</span>
            </h3>
            <Link to="/admin/messages" className="text-xs font-semibold text-brand-400 hover:underline">
              View All
            </Link>
          </div>

          {stats?.messages?.recent && stats.messages.recent.length > 0 ? (
            <div className="space-y-3">
              {stats.messages.recent.map((msg: any) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-2xl bg-dark-950/70 border border-slate-800/80 flex items-center justify-between gap-4"
                >
                  <div className="overflow-hidden">
                    <p className="text-sm font-semibold text-slate-200">{msg.name} ({msg.email})</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{msg.subject || msg.message}</p>
                  </div>
                  <span className="text-xs font-mono text-slate-500 flex-shrink-0">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-4 text-center">No incoming messages recorded yet.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
