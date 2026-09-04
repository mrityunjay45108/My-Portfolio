import React, { useEffect, useState } from 'react';
import {
  Bot,
  Zap,
  Clock,
  MessageSquare,
  Sparkles,
  Settings,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Cpu,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';

export const AdminAiPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [clearModalOpen, setClearModalOpen] = useState(false);
  const [expandedConvId, setExpandedConvId] = useState<string | null>(null);

  const [settingsForm, setSettingsForm] = useState({
    enabled: true,
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    rateLimitPerMin: 20,
  });

  const { success, error: toastError } = useToast();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.ai.getAdminStats();
      const data = res?.settings || res?.conversations ? res : (res?.data || res);
      if (data) {
        setStats(data);
        const settings = data.settings;
        if (settings) {
          setSettingsForm({
            enabled: settings.enabled ?? true,
            provider: settings.provider || 'gemini',
            model: settings.model || 'gemini-1.5-flash',
            rateLimitPerMin: settings.rateLimitPerMin || 20,
          });
        }
      }
    } catch (err: any) {
      toastError(err.message || 'Failed to load AI analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.ai.updateSettings(settingsForm);
      success('AI Assistant settings updated successfully!');
      fetchStats();
    } catch (err: any) {
      toastError(err.message || 'Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleClearHistory = async () => {
    try {
      await api.ai.clearConversations();
      success('All AI conversations and logs cleared');
      setClearModalOpen(false);
      fetchStats();
    } catch (err: any) {
      toastError(err.message || 'Failed to clear conversations');
    }
  };

  return (
    <AdminLayout
      title="AI Portfolio Assistant Analytics & Controls"
      actionButton={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={fetchStats} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setClearModalOpen(true)}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Clear History
          </Button>
        </div>
      }
    >
      <div className="space-y-8 max-w-6xl pb-12">
        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Total Conversations</span>
              <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white font-mono">{stats?.totalConversations || 0}</p>
            <p className="text-[11px] text-slate-500">Visitor chat sessions created</p>
          </div>

          <div className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Total Questions</span>
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white font-mono">{stats?.totalQuestions || 0}</p>
            <p className="text-[11px] text-slate-500">Inquiries processed with RAG</p>
          </div>

          <div className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Average Latency</span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-white font-mono">{stats?.avgLatencyMs || 280} ms</p>
            <p className="text-[11px] text-slate-500">Context retrieval + generation</p>
          </div>

          <div className="p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">Active Engine</span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <p className="text-base font-bold text-white uppercase font-mono truncate">
              {settingsForm.provider}
            </p>
            <p className="text-[11px] text-slate-500 truncate">{settingsForm.model}</p>
          </div>
        </div>

        {/* Configuration & Settings Form */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-600/10 border border-brand-500/20 text-brand-400 flex items-center justify-center">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-100">AI Assistant Configuration</h3>
                <p className="text-xs text-slate-400">Configure provider, models, and visitor rate limits</p>
              </div>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                settingsForm.enabled
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}
            >
              {settingsForm.enabled ? '● AI ACTIVE' : '○ AI DISABLED'}
            </span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="AI Provider"
                value={settingsForm.provider}
                onChange={(e) => setSettingsForm({ ...settingsForm, provider: e.target.value })}
                options={[
                  { value: 'gemini', label: 'Google Gemini (Fast & Free Tier)' },
                  { value: 'openai', label: 'OpenAI (GPT-4o / GPT-4o-mini)' },
                  { value: 'anthropic', label: 'Anthropic (Claude 3.5 Haiku / Sonnet)' },
                  { value: 'local', label: 'Local Semantic Engine (Built-in Fallback)' },
                ]}
              />

              <Input
                label="Model Identifier"
                placeholder="e.g. gemini-1.5-flash or gpt-4o-mini"
                value={settingsForm.model}
                onChange={(e) => setSettingsForm({ ...settingsForm, model: e.target.value })}
                required
              />

              <Input
                label="Rate Limit (Req / Min per IP)"
                type="number"
                min="5"
                max="100"
                value={String(settingsForm.rateLimitPerMin)}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, rateLimitPerMin: parseInt(e.target.value) || 20 })
                }
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-3 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsForm.enabled}
                  onChange={(e) => setSettingsForm({ ...settingsForm, enabled: e.target.checked })}
                  className="rounded bg-dark-950 border-slate-700 text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>Enable floating AI Assistant widget on public portfolio</span>
              </label>

              <Button type="submit" variant="primary" size="sm" isLoading={savingSettings} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
                Save AI Configuration
              </Button>
            </div>
          </form>
        </div>

        {/* Recent Visitor Inquiries Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-base text-slate-100">Recent Visitor Inquiries & Logs</h3>
              <p className="text-xs text-slate-400">Inspect queries asked by recruiters and visitors</p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {stats?.recentConversations?.length || 0} recent sessions
            </span>
          </div>

          <div className="space-y-3">
            {stats?.recentConversations && stats.recentConversations.length > 0 ? (
              stats.recentConversations.map((conv: any) => {
                const isExpanded = expandedConvId === conv.id;
                const userMsgs = conv.messages?.filter((m: any) => m.role === 'user') || [];
                const firstMsg = userMsgs[0]?.content || conv.title || 'Inquiry session';

                return (
                  <div
                    key={conv.id}
                    className="p-4 rounded-2xl bg-dark-950/80 border border-slate-800 space-y-3 transition-colors"
                  >
                    <div
                      className="flex items-center justify-between gap-4 cursor-pointer"
                      onClick={() => setExpandedConvId(isExpanded ? null : conv.id)}
                    >
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-100 truncate">"{firstMsg}"</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-900 text-slate-400 border border-slate-800">
                            {conv.messages?.length || 0} msgs
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">
                          ID: {conv.id.slice(0, 16)}... • {new Date(conv.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <button className="p-1 text-slate-400 hover:text-white">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Expanded Message Transcript */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                        {conv.messages?.map((m: any) => (
                          <div
                            key={m.id}
                            className={`p-3 rounded-xl text-xs space-y-1 ${
                              m.role === 'user'
                                ? 'bg-brand-600/10 border border-brand-500/20 text-slate-200 ml-4'
                                : 'bg-dark-900 border border-slate-800 text-slate-300 mr-4'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                              <span className="font-bold text-brand-400 uppercase">{m.role}</span>
                              {m.latencyMs && <span>{m.latencyMs}ms</span>}
                            </div>
                            <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs">
                No visitor inquiries recorded yet. Questions asked via the public widget will appear here in real-time.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={clearModalOpen}
        onClose={() => setClearModalOpen(false)}
        title="Clear AI Conversation History"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to permanently clear all stored AI conversation logs and message histories?
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setClearModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleClearHistory}>
              Clear All Logs
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};
