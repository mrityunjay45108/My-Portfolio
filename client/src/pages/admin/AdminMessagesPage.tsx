import React, { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle2, Circle, Send, Reply, Calendar, User as UserIcon } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { ContactMessage } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await api.contact.getMessages();
      setMessages(data);
    } catch (err: any) {
      toastError(err.message || 'Error fetching messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      await api.contact.markAsRead(msg.id, !msg.isRead);
      success(`Marked as ${!msg.isRead ? 'read' : 'unread'}`);
      fetchMessages();
    } catch (err: any) {
      toastError(err.message || 'Error updating message status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.contact.deleteMessage(id);
      success('Message removed');
      fetchMessages();
    } catch (err: any) {
      toastError(err.message || 'Error deleting message');
    }
  };

  return (
    <AdminLayout title="Contact Inquiries & Messages">
      <div className="space-y-6 max-w-4xl">
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              {messages.length} Total Inquiries ({messages.filter((m) => !m.isRead).length} Unread)
            </span>
          </div>

          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    msg.isRead
                      ? 'bg-dark-950/40 border-slate-800/80 text-slate-400'
                      : 'bg-dark-950/90 border-brand-500/40 shadow-md text-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleToggleRead(msg)}
                        className="cursor-pointer"
                        title={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                      >
                        {msg.isRead ? (
                          <CheckCircle2 className="w-4 h-4 text-slate-500" />
                        ) : (
                          <Circle className="w-4 h-4 text-brand-400 fill-brand-400" />
                        )}
                      </button>
                      <span className="font-bold text-sm text-slate-100">{msg.name}</span>
                      <span className="text-xs font-mono text-brand-400">({msg.email})</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                        title="Reply via Email client"
                      >
                        <Reply className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Delete inquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {msg.subject && (
                    <p className="text-xs font-semibold text-cyan-300 pt-3 font-mono">
                      Subject: {msg.subject}
                    </p>
                  )}

                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line pt-2 text-slate-300">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Mail className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-300">Your message inbox is clear</p>
              <p className="text-xs">When visitors submit inquiries via the public contact form, they will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
