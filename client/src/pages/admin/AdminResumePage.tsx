import React, { useState, useEffect } from 'react';
import {
  FileText,
  ExternalLink,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  Cloud,
  FileCheck,
  Layers,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { personalInfo } from '../../data/personal';

export const AdminResumePage: React.FC = () => {
  const { resumeUrl, updateResumeUrl, loading } = useResume();
  const { success, error: toastError } = useToast();

  const [inputUrl, setInputUrl] = useState(resumeUrl);
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setInputUrl(resumeUrl);
  }, [resumeUrl]);

  const isCloudinary = inputUrl.toLowerCase().includes('cloudinary.com');
  const isPdf = inputUrl.toLowerCase().includes('.pdf');
  const isValidHttp = inputUrl.startsWith('http://') || inputUrl.startsWith('https://');

  const handleCopy = () => {
    navigator.clipboard.writeText(resumeUrl);
    setCopied(true);
    success('Resume URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      toastError('Please enter a resume URL');
      return;
    }

    if (!isValidHttp) {
      toastError('URL must start with http:// or https://');
      return;
    }

    setSubmitting(true);
    try {
      await updateResumeUrl(inputUrl.trim());
      success('Resume URL updated and published live across your entire portfolio!');
    } catch (err: any) {
      toastError(err.message || 'Failed to update resume URL');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = async () => {
    const defaultUrl = personalInfo.resumeUrl;
    setInputUrl(defaultUrl);
    setSubmitting(true);
    try {
      await updateResumeUrl(defaultUrl);
      success('Resume reset to original Cloudinary PDF URL');
    } catch (err: any) {
      toastError(err.message || 'Failed to reset resume URL');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Resume Management"
      actionButton={
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all shadow-xs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-brand-400" />
          Preview Live PDF
        </a>
      }
    >
      <div className="max-w-5xl space-y-8">
        {/* Active Status Hero Card */}
        <div className="bg-gradient-to-br from-dark-900 via-dark-900 to-brand-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/5">
                <FileText className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl font-bold text-white tracking-tight">Active Portfolio Resume</h2>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Live & Connected
                  </span>
                  {resumeUrl.includes('cloudinary.com') && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      <Cloud className="w-3 h-3" /> Cloudinary CDN
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl break-all font-mono">
                  {resumeUrl}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                leftIcon={copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                className="flex-1 md:flex-initial"
              >
                {copied ? 'Copied' : 'Copy URL'}
              </Button>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-initial"
              >
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                  className="w-full"
                >
                  Open PDF
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Update Resume URL Card */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Cloud className="w-5 h-5 text-brand-400" />
              Update Resume (Cloudinary URL)
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Enter your updated Cloudinary PDF URL below. When saved, all "Download Resume" buttons on the portfolio will automatically point to this new URL immediately.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="resumeUrl" className="block text-xs font-mono font-medium text-slate-300 uppercase tracking-wider">
                Cloudinary PDF URL
              </label>
              <div className="relative rounded-2xl shadow-xs">
                <input
                  id="resumeUrl"
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/your-cloud-name/image/upload/.../resume.pdf"
                  required
                  className="w-full px-4 py-3.5 bg-dark-950/80 border border-slate-700/80 rounded-2xl text-slate-100 placeholder-slate-500 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all pr-24"
                />
                <button
                  type="button"
                  onClick={() => inputUrl && window.open(inputUrl, '_blank', 'noopener,noreferrer')}
                  disabled={!isValidHttp}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Test
                </button>
              </div>

              {/* URL Intelligence Badges */}
              <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
                {isCloudinary ? (
                  <span className="flex items-center gap-1 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Valid Cloudinary Resource
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md">
                    Custom CDN / Direct URL
                  </span>
                )}

                {isPdf ? (
                  <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    <FileCheck className="w-3 h-3" /> PDF Document Detected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    <AlertCircle className="w-3 h-3" /> Ensure the link points to a .pdf file
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800/80 flex-wrap">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleReset}
                disabled={submitting || loading}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset to Original
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={submitting || loading || inputUrl === resumeUrl}
                  leftIcon={<Save className="w-4 h-4" />}
                >
                  {submitting ? 'Updating Live...' : 'Save & Publish Resume'}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Cloudinary Step-by-Step Guide Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-900/90 border border-slate-800/90 rounded-3xl p-6 space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Cloud className="w-4 h-4 text-cyan-400" />
              How to Upload & Get URL from Cloudinary
            </h4>
            <ol className="space-y-2.5 text-xs sm:text-sm text-slate-400 list-decimal list-inside leading-relaxed">
              <li>
                Log into your <a href="https://console.cloudinary.com" target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:underline">Cloudinary Console</a>.
              </li>
              <li>Navigate to <strong className="text-slate-200">Media Library</strong> and click <strong className="text-slate-200">Upload</strong>.</li>
              <li>Select your latest resume PDF from your computer.</li>
              <li>
                Click on the uploaded file and copy the direct URL (or click the <strong className="text-slate-200">Copy Link</strong> icon).
              </li>
              <li>Paste the URL in the input above and click <strong className="text-slate-200">Save & Publish</strong>.</li>
            </ol>
          </div>

          <div className="bg-dark-900/90 border border-slate-800/90 rounded-3xl p-6 space-y-4">
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-400" />
              Where is this Resume linked?
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                <span><strong className="text-slate-200">Navbar (Desktop):</strong> Top-right "Resume" button</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                <span><strong className="text-slate-200">Navbar (Mobile):</strong> Mobile drawer "CV" & "Download Resume"</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                <span><strong className="text-slate-200">Hero Section:</strong> Primary "Download Resume" CTA button</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                <span><strong className="text-slate-200">Why Work With Me:</strong> "Download Resume (PDF)" button</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-emerald-400/90 font-medium">All downloads are tracked automatically in Admin Analytics!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminResumePage;
