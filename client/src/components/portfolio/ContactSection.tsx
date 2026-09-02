import React, { useState } from 'react';
import { Mail, Send, Copy, Check, Sparkles, MessageSquare } from 'lucide-react';
import { personalInfo } from '../../data/personal';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const { success, error: toastError } = useToast();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    success('Email address copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Please enter your name';
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await api.contact.sendMessage(formData);
      success('Thank you! Your message has been delivered to Mrityunjay.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (err: any) {
      toastError(err.message || 'Failed to send message. Please try emailing directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Let's Discuss Projects, Engineering & Ideas
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Have an open role, project inquiry, or technical challenge? Send a message and I'll respond promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-5xl mx-auto items-start">
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-dark-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-400" />
                <span>Direct Contact Details</span>
              </h3>

              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Feel free to email me directly or send a message via the form. I typically respond within 24 hours.
              </p>

              {/* Copy Email Box */}
              <div className="bg-dark-950/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
                <div className="overflow-hidden">
                  <p className="text-[11px] font-mono text-slate-500">Official Email</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-200 truncate mt-0.5">
                    {personalInfo.email}
                  </p>
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2.5 rounded-xl bg-dark-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors flex-shrink-0 cursor-pointer"
                  title="Copy email to clipboard"
                  aria-label="Copy email"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Social Channels */}
              <div className="space-y-3 pt-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                  Online Profiles:
                </p>
                <div className="flex flex-col gap-2.5">
                  <a
                    href={personalInfo.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-950/50 hover:bg-dark-950 border border-slate-800 hover:border-slate-700 text-xs sm:text-sm text-slate-300 hover:text-white transition-all group"
                  >
                    <span className="flex items-center gap-2.5">
                      <GithubIcon size={16} className="text-slate-400 group-hover:text-white" />
                      GitHub Profile
                    </span>
                    <span className="text-xs font-mono text-slate-500">mrityunjay45108</span>
                  </a>

                  <a
                    href={personalInfo.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-dark-950/50 hover:bg-dark-950 border border-slate-800 hover:border-slate-700 text-xs sm:text-sm text-slate-300 hover:text-white transition-all group"
                  >
                    <span className="flex items-center gap-2.5">
                      <LinkedinIcon size={16} className="text-blue-400" />
                      LinkedIn Profile
                    </span>
                    <span className="text-xs font-mono text-slate-500">mrityunjay-kumar</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-dark-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8">
              <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" />
                <span>Send a Direct Message</span>
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={errors.email}
                    required
                  />
                </div>

                <Input
                  label="Subject (Optional)"
                  placeholder="Full-Stack Opportunity / Project Proposal"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />

                <Textarea
                  label="Your Message"
                  rows={5}
                  placeholder="Hi Mrityunjay, I'd like to discuss..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  error={errors.message}
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={loading}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
