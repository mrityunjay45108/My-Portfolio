import React, { useEffect, useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  FileText,
  Globe,
  Mail,
  Download,
  Calendar,
  Layers,
  ArrowDownRight,
  Filter,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { GithubIcon } from '../../components/ui/Icons';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

export const AdminAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | '90d' | 'all'>('30d');
  const [overview, setOverview] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { error: toastError } = useToast();

  const fetchAnalytics = async (range = timeRange) => {
    setLoading(true);
    try {
      const [overviewRes, projectsRes, funnelRes, sourcesRes] = await Promise.all([
        api.analytics.getOverview(range),
        api.analytics.getProjects(range),
        api.analytics.getFunnel(range),
        api.analytics.getSources(range),
      ]);

      const o = overviewRes?.data !== undefined ? overviewRes.data : overviewRes;
      const p = projectsRes?.data !== undefined ? projectsRes.data : projectsRes;
      const f = funnelRes?.data !== undefined ? funnelRes.data : funnelRes;
      const s = sourcesRes?.data !== undefined ? sourcesRes.data : sourcesRes;

      if (o) setOverview(o);
      if (p) setProjects(p);
      if (f) setFunnel(f);
      if (s) setSources(s);
    } catch (err: any) {
      toastError(err.message || 'Error fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(timeRange);
  }, [timeRange]);

  const handleExportCsv = () => {
    const url = api.analytics.getExportUrl(timeRange);
    window.open(url, '_blank');
  };

  return (
    <AdminLayout
      title="Analytics & Recruiter Conversion System"
      actionButton={
        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchAnalytics(timeRange)}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleExportCsv}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export CSV
          </Button>
        </div>
      }
    >
      <div className="space-y-8 max-w-7xl pb-16">
        {/* Time Range Filter Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-dark-900 border border-slate-800">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-400" />
            <span className="text-xs font-semibold text-slate-200">Date Range Filter:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-dark-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {[
              { id: 'today', label: 'Today' },
              { id: '7d', label: '7 Days' },
              { id: '30d', label: '30 Days' },
              { id: '90d', label: '90 Days' },
              { id: 'all', label: 'All Time' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTimeRange(t.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeRange === t.id
                    ? 'bg-brand-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* KPI Metrics Grid (7 Key conversion indicators) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Unique Visitors */}
          <div className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">Unique Visitors</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">
              {overview?.totalVisitors ?? 0}
            </p>
            <p className="text-[11px] text-slate-500">Distinct browser sessions</p>
          </div>

          {/* Page Views */}
          <div className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">Total Page Views</span>
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white font-mono">
              {overview?.pageViews ?? 0}
            </p>
            <p className="text-[11px] text-slate-500">Portfolio & project impressions</p>
          </div>

          {/* Resume Downloads */}
          <div className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">Resume Downloads</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                {overview?.resumeDownloads ?? 0}
              </p>
              <span className="text-xs font-mono font-semibold text-emerald-400">
                ({overview?.resumeConversionRate ?? 0}% conv.)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Recruiters downloading PDF</p>
          </div>

          {/* Contact Submissions */}
          <div className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-2 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">Contact Leads</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Mail className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-black text-white font-mono">
                {overview?.contactSubmissions ?? 0}
              </p>
              <span className="text-xs font-mono font-semibold text-purple-400">
                ({overview?.contactConversionRate ?? 0}% conv.)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Inquiries sent via contact form</p>
          </div>
        </div>

        {/* Secondary Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase">Project Views</p>
              <p className="text-xl font-bold text-white font-mono mt-0.5">{overview?.projectViews ?? 0}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-mono text-slate-400">Blog / Case Studies</span>
              <p className="text-sm font-semibold text-slate-300 font-mono mt-0.5">
                {(overview?.blogViews ?? 0) + (overview?.caseStudyViews ?? 0)} views
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase">GitHub Clicks</p>
              <p className="text-xl font-bold text-white font-mono mt-0.5">{overview?.githubClicks ?? 0}</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg">
              Outbound Code Inspection
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-mono text-slate-400 uppercase">Live Demo Clicks</p>
              <p className="text-xl font-bold text-white font-mono mt-0.5">{overview?.liveDemoClicks ?? 0}</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg">
              App Prototype Trials
            </span>
          </div>
        </div>

        {/* Recruiter Conversion Funnel Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-400" />
                <span>Recruiter & Client Conversion Funnel</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Track how visitors progress from landing to downloading resume & submitting inquiries
              </p>
            </div>
          </div>

          {/* Funnel Visualizer Steps */}
          <div className="space-y-4">
            {funnel && funnel.length > 0 ? (
              funnel.map((step, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{step.step}</span>
                    <div className="flex items-center gap-3 font-mono">
                      <span className="font-bold text-white">{step.count} sessions</span>
                      <span className="text-emerald-400 font-semibold">{step.conversionRate}%</span>
                      {step.dropoffRate > 0 && (
                        <span className="text-slate-500 text-[11px]">(-{step.dropoffRate}% drop)</span>
                      )}
                    </div>
                  </div>

                  {/* Funnel Progress Bar */}
                  <div className="w-full h-3 rounded-full bg-dark-950 overflow-hidden border border-slate-800/80">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-600 via-indigo-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${Math.max(step.conversionRate, 2)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs">
                Collecting real-time conversion funnel events...
              </div>
            )}
          </div>
        </div>

        {/* Projects Conversion Performance Matrix */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span>Top Projects by Engagement & Click-Through Rate (CTR)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Shows which projects generate the most GitHub code inspections and live demo visits
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">{projects.length} projects analyzed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-dark-950/60 text-slate-400 font-mono text-xs uppercase">
                  <th className="py-3 px-4">Project Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3 text-center">Views</th>
                  <th className="py-3 px-3 text-center">GitHub Clicks</th>
                  <th className="py-3 px-3 text-center">Demo Clicks</th>
                  <th className="py-3 px-3 text-center">GitHub CTR</th>
                  <th className="py-3 px-3 text-center">Demo CTR</th>
                  <th className="py-3 px-4 text-right">Combined CTR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {projects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      <div>
                        <p>{p.title}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{p.slug}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-dark-950 text-cyan-400 border border-slate-800">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-white">
                      {p.views}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                      {p.githubClicks}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-slate-300">
                      {p.liveDemoClicks}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono">
                      <span className={p.githubCtr > 0 ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                        {p.githubCtr}%
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono">
                      <span className={p.liveDemoCtr > 0 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                        {p.liveDemoCtr}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-black text-brand-400">
                      {p.totalCtr}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traffic Acquisition Sources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Traffic Referral Sources</span>
            </h3>
            <div className="space-y-3">
              {sources && sources.length > 0 ? (
                sources.map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{s.source}</span>
                      <span className="font-mono text-slate-400">{s.count} hits ({s.percentage}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-dark-950 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${Math.max(s.percentage, 2)}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 text-xs py-4">No external referrers logged yet.</div>
              )}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Privacy & Retention Policy</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                This platform implements a strictly privacy-conscious analytics pipeline. No personal identification, browser fingerprinting, or raw IP addresses are permanently persisted.
              </p>
              <div className="p-3 rounded-xl bg-dark-950 border border-slate-800 space-y-1 text-xs">
                <p className="font-semibold text-slate-200">Active Retention Window: 90 Days</p>
                <p className="text-slate-500 text-[11px]">Events older than 90 days are automatically purged to minimize storage overhead.</p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleExportCsv}
              className="w-full"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Export Full Aggregated Telemetry (CSV)
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
