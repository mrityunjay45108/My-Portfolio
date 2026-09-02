import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Code2 } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';

export const AdminCaseStudyFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    problem: '',
    background: '',
    goals: '',
    architecture: '',
    architectureImage: '',
    implementation: '',
    challenges: '',
    solutions: '',
    security: '',
    performance: '',
    results: '',
    lessonsLearned: '',
    videoUrl: '',
    githubUrl: '',
    liveUrl: '',
    featured: false,
    status: 'PUBLISHED',
    technologies: 'React, TypeScript, Node.js, PostgreSQL, Docker, Redis',
  });

  useEffect(() => {
    if (!isEdit) return;

    const fetchCaseStudy = async () => {
      setLoading(true);
      try {
        const cs = await api.caseStudies.getBySlug(id);
        const techStr = cs.technologies ? cs.technologies.map((t: any) => t.technology?.name || t).join(', ') : '';

        setFormData({
          title: cs.title,
          slug: cs.slug,
          summary: cs.summary,
          problem: cs.problem,
          background: cs.background || '',
          goals: cs.goals || '',
          architecture: cs.architecture || '',
          architectureImage: cs.architectureImage || '',
          implementation: cs.implementation || '',
          challenges: cs.challenges || '',
          solutions: cs.solutions || '',
          security: cs.security || '',
          performance: cs.performance || '',
          results: cs.results || '',
          lessonsLearned: cs.lessonsLearned || '',
          videoUrl: cs.videoUrl || '',
          githubUrl: cs.githubUrl || '',
          liveUrl: cs.liveUrl || '',
          featured: cs.featured,
          status: cs.status,
          technologies: techStr,
        });
      } catch (err: any) {
        toastError(err.message || 'Error loading case study');
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
  }, [id, isEdit]);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const generatedSlug = !isEdit && !prev.slug
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : prev.slug;
      return { ...prev, title: val, slug: generatedSlug };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const techArray = formData.technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        technologies: techArray,
      };

      if (isEdit) {
        await api.caseStudies.update(id, payload);
        success('Case study updated successfully!');
      } else {
        await api.caseStudies.create(payload);
        success('New case study published successfully!');
      }

      navigate('/admin/case-studies');
    } catch (err: any) {
      toastError(err.message || 'Error saving case study');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Case Study' : 'Create New Case Study'}>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/case-studies"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Case Studies</span>
          </Link>

          <Button type="submit" variant="primary" size="md" isLoading={loading} leftIcon={<Save className="w-4 h-4" />}>
            {isEdit ? 'Save Changes' : 'Publish Case Study'}
          </Button>
        </div>

        {/* Core Info */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800">
            1. Overview & Setup
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Case Study Title"
              placeholder="AI Interview Copilot: Architecting Real-Time Voice & RAG"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
            <Input
              label="URL Slug"
              placeholder="ai-interview-copilot-architecture"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Publish Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'PUBLISHED', label: 'Published (Public)' },
                { value: 'DRAFT', label: 'Draft (Admin Only)' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
            />
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded bg-dark-950 border-slate-700 text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>Featured Flagship Case Study</span>
              </label>
            </div>
          </div>

          <Textarea
            label="Executive Summary"
            placeholder="High-level engineering overview of the case study..."
            rows={3}
            value={formData.summary}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            required
          />

          <Input
            label="Technologies (Comma-separated)"
            placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, Redis"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            required
          />
        </div>

        {/* Problem, Goals, Architecture */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800">
            2. Problem & Architectural Blueprint
          </h3>

          <Textarea
            label="The Engineering Problem"
            placeholder="What technical problem or architectural bottleneck needed solving?"
            rows={4}
            value={formData.problem}
            onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
            required
          />

          <Textarea
            label="Context & Background (Optional)"
            placeholder="Business and system context..."
            rows={3}
            value={formData.background}
            onChange={(e) => setFormData({ ...formData, background: e.target.value })}
          />

          <Textarea
            label="System Goals & Requirements"
            placeholder="Key architectural and throughput goals..."
            rows={3}
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
          />

          <Textarea
            label="Architecture Overview"
            placeholder="Detailed architecture description and data pipelines..."
            rows={4}
            value={formData.architecture}
            onChange={(e) => setFormData({ ...formData, architecture: e.target.value })}
          />

          <Input
            label="Architecture Diagram Image URL"
            placeholder="https://... or /projects/architecture.webp"
            value={formData.architectureImage}
            onChange={(e) => setFormData({ ...formData, architectureImage: e.target.value })}
          />
        </div>

        {/* Challenges, Solutions, Results */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800">
            3. Challenges, Solutions & Outcomes
          </h3>

          <Textarea
            label="Technical Challenges"
            placeholder="Specific race conditions, high-latency bottlenecks, or concurrency hurdles..."
            rows={3}
            value={formData.challenges}
            onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
          />

          <Textarea
            label="Engineered Solutions"
            placeholder="How were those challenges resolved?"
            rows={3}
            value={formData.solutions}
            onChange={(e) => setFormData({ ...formData, solutions: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea
              label="Security Implementation"
              placeholder="Auth, encryption, rate limiting..."
              rows={3}
              value={formData.security}
              onChange={(e) => setFormData({ ...formData, security: e.target.value })}
            />
            <Textarea
              label="Performance & Benchmarks"
              placeholder="RPS, p99 latency, caching metrics..."
              rows={3}
              value={formData.performance}
              onChange={(e) => setFormData({ ...formData, performance: e.target.value })}
            />
          </div>

          <Textarea
            label="Measurable Results"
            placeholder="Quantitative outcomes and production uptime..."
            rows={3}
            value={formData.results}
            onChange={(e) => setFormData({ ...formData, results: e.target.value })}
          />

          <Textarea
            label="Lessons Learned & Takeaways"
            placeholder="Key architectural insights gained..."
            rows={3}
            value={formData.lessonsLearned}
            onChange={(e) => setFormData({ ...formData, lessonsLearned: e.target.value })}
          />
        </div>

        {/* Save Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/case-studies')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={loading} leftIcon={<Save className="w-4 h-4" />}>
            {isEdit ? 'Save Case Study' : 'Publish Case Study'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};
