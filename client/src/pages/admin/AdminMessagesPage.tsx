import React, { useEffect, useState } from 'react';
import {
  Mail,
  Trash2,
  CheckCircle2,
  Circle,
  Reply,
  Calendar,
  Building2,
  Briefcase,
  Search,
  Archive,
  CheckCheck,
  RefreshCw,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { success, error: toastError } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.contact.getMessages({
        status: statusFilter,
        search: searchQuery || undefined,
      });
      if (res.data) {
        setMessages(res.data.messages || []);
        setTotal(res.data.total || 0);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err: any) {
      toastError(err.message || 'Error fetching messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMessages();
  };

  const handleUpdateStatus = async (id: string, newStatus: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED') => {
    try {
      await api.contact.updateStatus(id, newStatus);
      success(`Message marked as ${newStatus.toLowerCase()}`);
      fetchMessages();
    } catch (err: any) {
      toastError(err.message || 'Failed to update message status');
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await api.contact.deleteMessage(deleteTargetId);
      success('Message permanently deleted');
      setDeleteTargetId(null);
      fetchMessages();
    } catch (err: any) {
      toastError(err.message || 'Error deleting message');
    }
  };

  const getPurposeBadge = (purpose: string) => {
    switch (purpose) {
      case 'Job Opportunity':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">💼 Job Opportunity</span>;
      case 'Freelance / Contract':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">🚀 Freelance Project</span>;
      case 'Technical Collaboration':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">🤝 Collaboration</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700">{purpose || 'General'}</span>;
    }
  };

  return (
    <AdminLayout
      title="Contact Inquiries & Recruiter CRM"
      actionButton={
        <Button variant="secondary" size="sm" onClick={fetchMessages} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh Inquiries
        </Button>
      }
    >
      <div className="space-y-6 max-w-5xl pb-16">
        {/* Filter & Search Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-dark-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-dark-950 p-1 rounded-2xl border border-slate-800 text-xs font-mono">
              {[
                { id: 'ALL', label: 'All Inquiries' },
                { id: 'NEW', label: `New (${unreadCount})`, badge: unreadCount > 0 },
                { id: 'READ', label: 'Read' },
                { id: 'REPLIED', label: 'Replied' },
                { id: 'ARCHIVED', label: 'Archived' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusFilter === tab.id
                      ? 'bg-brand-600 text-white font-bold shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Search Input */}
            <form onSubmit={handleSearch} className="w-full sm:w-72 relative">
              <input
                type="text"
                placeholder="Search name, company, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-950 text-slate-200 placeholder-slate-500 text-xs rounded-xl pl-8 pr-3 py-2 border border-slate-800 focus:border-brand-500 outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            </form>
          </div>
        </div>

        {/* Message Cards List */}
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((msg) => {
              const isNew = msg.status === 'NEW' || !msg.isRead;
              return (
                <div
                  key={msg.id}
                  className={`p-6 rounded-3xl border transition-all shadow-lg space-y-4 ${
                    isNew
                      ? 'bg-dark-950 border-brand-500/50 shadow-brand-500/5'
                      : 'bg-dark-900/80 border-slate-800 text-slate-300'
                  }`}
                >
                  {/* Top Row: Sender Info & Quick Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-bold text-base text-white">{msg.name}</span>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs font-mono text-cyan-400 hover:underline"
                        >
                          {msg.email}
                        </a>
                        {msg.company && (
                          <span className="inline-flex items-center gap-1 text-xs text-slate-300 font-medium bg-dark-950 px-2 py-0.5 rounded border border-slate-800">
                            <Building2 className="w-3 h-3 text-brand-400" />
                            {msg.company}
                          </span>
                        )}
                        {getPurposeBadge(msg.purpose)}
                      </div>
                      <p className="text-[11px] font-mono text-slate-500">
                        Received: {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {/* Quick Status Control Buttons */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}&body=Hi ${encodeURIComponent(msg.name)},%0D%0A%0D%0AThank you for reaching out.%0D%0A%0D%0ABest regards,%0D%0AMrityunjay Kumar`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-xs"
                      >
                        <Reply className="w-3.5 h-3.5" />
                        <span>Reply Email</span>
                      </a>

                      {msg.status !== 'REPLIED' && (
                        <button
                          onClick={() => handleUpdateStatus(msg.id, 'REPLIED')}
                          className="p-1.5 rounded-xl bg-dark-950 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 border border-slate-800 transition-colors"
                          title="Mark as Replied"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}

                      {msg.status !== 'ARCHIVED' ? (
                        <button
                          onClick={() => handleUpdateStatus(msg.id, 'ARCHIVED')}
                          className="p-1.5 rounded-xl bg-dark-950 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 transition-colors"
                          title="Archive message"
                        >
                          <Archive className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(msg.id, 'READ')}
                          className="p-1.5 rounded-xl bg-dark-950 hover:bg-slate-800 text-slate-400 hover:text-brand-400 border border-slate-800 transition-colors"
                          title="Unarchive message"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => setDeleteTargetId(msg.id)}
                        className="p-1.5 rounded-xl bg-dark-950 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 transition-colors cursor-pointer"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  {msg.subject && (
                    <div className="text-xs font-semibold text-brand-300 font-mono">
                      Subject: {msg.subject}
                    </div>
                  )}

                  {/* Message Body */}
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-dark-950/60 p-4 rounded-2xl border border-slate-800/60">
                    {msg.message}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="p-12 rounded-3xl bg-dark-900 border border-slate-800 text-center text-slate-500 space-y-3">
              <Mail className="w-10 h-10 mx-auto text-slate-600" />
              <h4 className="text-sm font-bold text-slate-200">No Inquiries Found</h4>
              <p className="text-xs max-w-sm mx-auto">
                No recruiter or visitor contact messages match the current status filter.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Contact Inquiry"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to permanently delete this contact message? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Message
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};
