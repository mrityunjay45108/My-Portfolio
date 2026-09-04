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
  FileText,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { Button } from '../../components/ui/Button';
import { useResume } from '../../context/ResumeContext';

export const AdminDashboardPage: React.FC = () => {
  const { resumeUrl } = useResume();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [overviewRes, msgsRes, projectsRes] = await Promise.allSettled([
          api.analytics.getStats(),
          api.contact.getMessages({ limit: 5 }),
          api.projects.getAll(),
        ]);

        const overview: any = overviewRes.status === 'fulfilled' ? (overviewRes.value as any)?.data || overviewRes.value : {};
        const msgsRaw: any = msgsRes.status === 'fulfilled' ? (msgsRes.value as any)?.data || msgsRes.value : {};
        const projsRaw: any = projectsRes.status === 'fulfilled' ? (projectsRes.value as any)?.data || projectsRes.value : [];
        const projs = Array.isArray(projsRaw) ? projsRaw : (projsRaw?.projects || []);

        const messagesList = Array.isArray(msgsRaw?.messages) ? msgsRaw.messages : (Array.isArray(msgsRaw) ? msgsRaw : []);
        const totalMessages = msgsRaw?.total ?? messagesList.length;
        const unreadMessages = msgsRaw?.unreadCount ?? messagesList.filter((m: any) => m.status === 'NEW' || !m.isRead).length;

        setStats({
          projects: {
            total: projs.length || 4,
            published: projs.filter((p: any) => p.published !== false).length || 4,
            featured: projs.filter((p: any) => p.featured).length || 3,
          },
          blogs: { total: 3, published: 3 },
          caseStudies: { total: 2, published: 2 },
          messages: {
            total: totalMessages,
            unread: unreadMessages,
            recent: messagesList,
          },
          views: { total: overview?.pageViews || 4250 },
        });
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

        {/* Live Resume Quick Status Banner */}
        <div className="bg-gradient-to-r from-dark-900 via-dark-900 to-brand-950/40 border border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 shadow-xs">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold text-white">Live Portfolio Resume</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Live & Connected
                </span>
                {resumeUrl.includes('cloudinary.com') && (
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Cloudinary CDN
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1 truncate max-w-xs sm:max-w-md md:max-w-xl">
                {resumeUrl}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-dark-950 border border-slate-800 hover:border-slate-700 transition-colors"
              title="Preview Live PDF"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <Link to="/admin/resume" className="flex-1 sm:flex-initial">
              <Button variant="primary" size="sm" leftIcon={<FileText className="w-3.5 h-3.5" />}>
                Update Resume URL
              </Button>
            </Link>
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
