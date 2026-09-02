import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';

interface ProjectImageItem {
  id?: string;
  url: string;
  altText: string;
}

export const AdminProjectFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    category: 'Full Stack',
    featured: false,
    published: true,
    order: 0,
    githubUrl: '',
    liveUrl: '',
    architectureImage: '',
    architectureDescription: '',
    videoUrl: '',
    technologies: 'React, TypeScript, Node.js, Express.js, PostgreSQL, Tailwind CSS',
    features: [
      { title: 'Core Functionality', description: 'Detailed feature description.' },
    ],
  });

  const [images, setImages] = useState<ProjectImageItem[]>([]);

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
          shortDescription: project.shortDescription || '',
          description: project.description || '',
          category: project.category || 'Full Stack',
          featured: project.featured || false,
          published: project.published !== undefined ? project.published : true,
          order: project.order || 0,
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

        if (project.images && project.images.length > 0) {
          setImages(project.images.map((img) => ({
            id: img.id,
            url: img.url,
            altText: img.altText || '',
          })));
        }
      } catch (err: any) {
        toastError(err.message || 'Error loading project details');
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

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) {
      toastError('Please enter a valid image URL');
      return;
    }
    setImages((prev) => [...prev, { url: newImageUrl.trim(), altText: newImageAlt.trim() || formData.title }]);
    setNewImageUrl('');
    setNewImageAlt('');
    success('Photo added to project gallery');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploaded = await api.media.upload(file);
      setImages((prev) => [...prev, { url: uploaded.url, altText: file.name }]);
      success('Image uploaded and added to gallery!');
    } catch (err: any) {
      toastError(err.message || 'Upload failed. You can also paste image URLs directly.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleMoveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((prev) => {
      const updated = [...prev];
      const item = updated.splice(from, 1)[0];
      updated.splice(to, 0, item);
      return updated;
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
        images: images.map((img, idx) => ({
          url: img.url,
          altText: img.altText || null,
          order: idx,
        })),
      };

      if (isEdit) {
        await api.projects.update(id, payload);
        success('Project updated successfully with all photos and features!');
      } else {
        await api.projects.create(payload);
        success('New project created and published!');
      }

      navigate('/admin/projects');
    } catch (err: any) {
      toastError(err.message || 'Error saving project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={isEdit ? `Edit Project: ${formData.title || 'Loading...'}` : 'Create New Project'}>
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
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800">
            1. Core Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Project Title"
              placeholder="JobSeekers — AI-Powered Job Search & Recruitment Portal"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
            <Input
              label="URL Slug"
              placeholder="job-portal"
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
                { value: 'Backend', label: 'Backend' },
                { value: 'Frontend', label: 'Frontend' },
                { value: 'DevOps & Cloud', label: 'DevOps & Cloud' },
              ]}
            />
            <div className="flex items-center gap-4 pt-6 sm:col-span-2">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded bg-dark-950 border-slate-700 text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>Featured on Homepage</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded bg-dark-950 border-slate-700 text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>Published (Visible to Visitors)</span>
              </label>
            </div>
          </div>

          <Textarea
            label="Short Description (Summary shown in cards)"
            placeholder="Brief 1-2 sentence overview..."
            rows={2}
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
            required
          />

          <Textarea
            label="Comprehensive Overview / Long Description"
            placeholder="Detailed explanation of the project, architecture, problem statement, and engineering achievements..."
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        {/* Links & Technologies Card */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800">
            2. URLs & Technology Stack
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="GitHub Repository URL"
              placeholder="https://github.com/mrityunjay45108/job_portal"
              value={formData.githubUrl}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            />
            <Input
              label="Live Demo URL"
              placeholder="https://job-portal-psi-henna-74.vercel.app/"
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
            placeholder="React, TypeScript, Node.js, Express.js, MongoDB, PostgreSQL, Tailwind CSS"
            value={formData.technologies}
            onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
            helperText="Enter comma-separated technologies to automatically map to badges"
            required
          />
        </div>

        {/* Photos & Screenshots Gallery Manager */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-brand-400" />
              <h3 className="text-base font-bold text-slate-100">3. Project Photos & Screenshots Gallery</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">{images.length} photos added</span>
          </div>

          {/* Add via URL */}
          <div className="p-4 rounded-2xl bg-dark-950/70 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Add Photo via URL</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                placeholder="Image URL (e.g. /images/projects/jobseekers/landing.png or https://...)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <Input
                placeholder="Caption / Alt Text (e.g. JobSeekers Landing Page)"
                value={newImageAlt}
                onChange={(e) => setNewImageAlt(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-500">
                Supports local assets (/images/...) and web image URLs
              </span>
              <Button type="button" variant="secondary" size="sm" onClick={handleAddImageUrl} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Add Photo
              </Button>
            </div>
          </div>

          {/* Upload from Computer */}
          <div className="flex items-center gap-4 pt-1">
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-950 border border-slate-700 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors">
              <Upload className="w-4 h-4 text-brand-400" />
              <span>{uploading ? 'Uploading...' : 'Upload Photo from Computer'}</span>
              <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
            </label>
          </div>

          {/* Photo Gallery Grid with Controls */}
          {images.length > 0 ? (
            <div className="space-y-3 pt-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Current Project Photos (Drag / Reorder / Delete)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-2xl overflow-hidden border border-slate-800 bg-dark-950 group shadow-md flex flex-col justify-between"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-black/40">
                      <img
                        src={img.url}
                        alt={img.altText}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    <div className="p-3 bg-dark-900 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="truncate flex-1">
                        <span className="text-[10px] font-mono text-brand-400 block">#{idx + 1}</span>
                        <p className="text-xs text-slate-300 truncate" title={img.altText || img.url}>
                          {img.altText || 'Untitled Photo'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, idx - 1)}
                            className="p-1 text-slate-400 hover:text-white rounded bg-dark-950 border border-slate-800"
                            title="Move Left / Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                        )}
                        {idx < images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMoveImage(idx, idx + 1)}
                            className="p-1 text-slate-400 hover:text-white rounded bg-dark-950 border border-slate-800"
                            title="Move Right / Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 text-red-400 hover:text-white hover:bg-red-500 rounded bg-dark-950 border border-slate-800 transition-colors"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-4 bg-dark-950/40 rounded-2xl border border-dashed border-slate-800">
              No photos added yet. Use the upload button or URL form above to add screenshots.
            </p>
          )}
        </div>

        {/* Architecture Section */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <h3 className="text-base font-bold text-slate-100 pb-3 border-b border-slate-800">
            4. Architecture Blueprint & Description
          </h3>

          <Input
            label="Architecture Blueprint Image URL"
            placeholder="/images/projects/jobseekers/admin-dashboard.png or https://..."
            value={formData.architectureImage}
            onChange={(e) => setFormData({ ...formData, architectureImage: e.target.value })}
          />

          <Textarea
            label="Architecture Explanation"
            placeholder="Modern decoupled architecture featuring Next.js/React frontend, Node.js/Express API orchestration, and MongoDB/PostgreSQL database indexing..."
            rows={3}
            value={formData.architectureDescription}
            onChange={(e) => setFormData({ ...formData, architectureDescription: e.target.value })}
          />
        </div>

        {/* Dynamic Key Features Builder */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100">5. Key Features List</h3>
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
                  placeholder="Feature Title (e.g. AI Resume Builder & ATS Score Checker)"
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
            {isEdit ? 'Update Project & Photos' : 'Publish Project'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};
