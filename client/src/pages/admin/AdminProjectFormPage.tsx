import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, Upload } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';

export const AdminProjectFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    category: 'Full Stack',
    featured: false,
    published: true,
    githubUrl: '',
    liveUrl: '',
    architectureImage: '',
    architectureDescription: '',
    videoUrl: '',
    technologies: 'React, TypeScript, Node.js, PostgreSQL, Tailwind CSS',
    features: [
      { title: 'Core Functionality', description: 'Detailed feature description.' },
    ],
  });

  const [images, setImages] = useState<{ id?: string; url: string; altText?: string }[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const fetchProject = async () => {
      setLoading(true);
      try {
        const project = await api.projects.getBySlug(id);
        const techString = Array.isArray(project.technologies)
          ? project.technologies.map((t: any) => (typeof t === 'string' ? t : t.technology?.name || t.name)).join(', ')
          : '';

        setFormData({
          title: project.title,
          slug: project.slug,
          shortDescription: project.shortDescription,
          description: project.description,
          category: project.category,
          featured: project.featured,
          published: project.published,
          githubUrl: project.githubUrl || '',
          liveUrl: project.liveUrl || '',
          architectureImage: project.architectureImage || '',
          architectureDescription: project.architectureDescription || '',
          videoUrl: project.videoUrl || '',
          technologies: techString,
          features: project.features && project.features.length > 0
            ? project.features.map((f) => ({ title: f.title, description: f.description }))
            : [{ title: 'Feature 1', description: 'Description' }],
        });

        if (project.images) {
          setImages(project.images.map((img) => ({
            id: img.id,
            url: img.url,
            altText: img.altText || undefined,
          })));
        }
      } catch (err: any) {
        toastError(err.message || 'Error loading project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, isEdit]);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => {
      const generatedSlug = !isEdit && !prev.slug
        ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : prev.slug;
      return { ...prev, title: val, slug: generatedSlug };
    });
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { title: '', description: '' }],
    }));
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx),
    }));
  };

  const handleFeatureChange = (idx: number, field: 'title' | 'description', val: string) => {
    setFormData((prev) => {
      const updated = [...prev.features];
      updated[idx][field] = val;
      return { ...prev, features: updated };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploaded = await api.media.upload(file);
      setImages((prev) => [...prev, { url: uploaded.url, altText: file.name }]);
      success('Image uploaded successfully');
    } catch (err: any) {
      toastError(err.message || 'Upload failed. You can also paste image URLs directly.');
    } finally {
      setUploading(false);
    }
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
        await api.projects.update(id, payload);
        success('Project updated successfully!');
      } else {
        await api.projects.create(payload);
        success('New project created successfully!');
      }

      navigate('/admin/projects');
    } catch (err: any) {
      toastError(err.message || 'Error saving project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Project' : 'Create New Project'}>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>

          <Button type="submit" variant="primary" size="md" isLoading={loading} leftIcon={<Save className="w-4 h-4" />}>
            {isEdit ? 'Save Changes' : 'Publish Project'}
          </Button>
        </div>

        {/* Basic Info Card */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800">
            1. Core Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Project Title"
              placeholder="AI Interview Copilot"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
            <Input
              label="URL Slug"
              placeholder="ai-interview-copilot"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: 'Full Stack', label: 'Full Stack' },
                { value: 'AI / GenAI', label: 'AI / GenAI' },
                { value: 'Backend & Cloud', label: 'Backend & Cloud' },
                { value: 'Web App', label: 'Web App' },
              ]}
            />
            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded bg-dark-950 border-slate-700 text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>Featured Project</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded bg-dark-950 border-slate-700 text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>Published</span>
              </label>
            </div>
          </div>

          <Textarea
            label="Short Description (Summary shown in project cards)"
            placeholder="Brief 1-2 sentence overview..."
            rows={2}
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            required
          />

          <Textarea
            label="Comprehensive Overview / Long Description"
            placeholder="Detailed explanation of the project, problem, and technical achievements..."
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        {/* Links & Technologies Card */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800">
            2. URLs & Technology Stack
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub Repository URL"
              placeholder="https://github.com/mrityunjay45108/project"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            />
            <Input
              label="Live Demo URL"
              placeholder="https://project.demo.mrityunjay.dev"
              value={formData.liveUrl}
              onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
            />
          </div>

          <Input
            label="Demo Video URL (YouTube, Vimeo, or MP4 URL)"
            placeholder="https://www.youtube.com/watch?v=..."
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
          />

          <Input
            label="Technologies (Comma-separated list)"
            placeholder="React, TypeScript, Node.js, PostgreSQL, Docker, Redis"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            helperText="Enter comma-separated technologies to automatically map to badges"
            required
          />
        </div>

        {/* Architecture & Media */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800">
            3. Architecture & Screenshots
          </h3>

          <Input
            label="Architecture Image URL"
            placeholder="https://... or /projects/name/architecture.webp"
            value={formData.architectureImage}
            onChange={(e) => setFormData({ ...formData, architectureImage: e.target.value })}
          />

          <Textarea
            label="Architecture Description"
            placeholder="High-throughput asynchronous architecture featuring Next.js frontend and WebSocket..."
            rows={3}
            value={formData.architectureDescription}
            onChange={(e) => setFormData({ ...formData, architectureDescription: e.target.value })}
          />

          {/* Upload media */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Upload Screenshot / Asset
            </label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors">
                <Upload className="w-4 h-4 text-brand-400" />
                <span>{uploading ? 'Uploading...' : 'Choose File to Upload'}</span>
                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*" />
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-dark-950 group">
                    <img src={img.url} alt={img.altText || ''} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1.5 right-1.5 p-1 rounded-md bg-dark-950/80 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Key Features Builder */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100">4. Key Features</h3>
            <Button type="button" variant="secondary" size="sm" onClick={handleAddFeature} leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Feature
            </Button>
          </div>

          <div className="space-y-4">
            {formData.features.map((feat, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-dark-950/60 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-mono text-slate-500">Feature #{idx + 1}</span>
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" /> Remove
                    </button>
                  )}
                </div>

                <Input
                  placeholder="Feature Title (e.g., Dynamic Question Engine)"
                  value={feat.title}
                  onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                  required
                />
                <Textarea
                  placeholder="Feature description..."
                  rows={2}
                  value={feat.description}
                  onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/projects')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={loading} leftIcon={<Save className="w-4 h-4" />}>
            {isEdit ? 'Update Project' : 'Publish Project'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};
