import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Eye, Code, Sparkles, BookOpen } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { MarkdownRenderer } from '../../components/ui/MarkdownRenderer';

export const AdminBlogFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: `# Introduction\n\nWrite your technical article in Markdown here...`,
    featuredImage: '',
    status: 'PUBLISHED',
    categoryId: '',
    tags: 'AI, RAG, React, Node.js',
    readingTime: 5,
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const cats = await api.blog.getCategories();
        setCategories([
          { value: '', label: 'Select a category' },
          ...cats.map((c) => ({ value: c.id, label: c.name })),
        ]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCats();

    if (!isEdit) return;

    const fetchPost = async () => {
      setLoading(true);
      try {
        const post = await api.blog.getBySlug(id);
        const tagStr = post.tags ? post.tags.map((t: any) => t.tag?.name || t).join(', ') : '';

        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          featuredImage: post.featuredImage || '',
          status: post.status,
          categoryId: post.categoryId || '',
          tags: tagStr,
          readingTime: post.readingTime || 5,
        });
      } catch (err: any) {
        toastError(err.message || 'Error loading article');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
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
      const tagArray = formData.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        tags: tagArray,
      };

      if (isEdit) {
        await api.blog.update(id, payload);
        success('Article updated successfully!');
      } else {
        await api.blog.create(payload);
        success('New article published successfully!');
      }

      navigate('/admin/blog');
    } catch (err: any) {
      toastError(err.message || 'Error saving article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Article' : 'Write New Article'}>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl pb-16">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog List</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setPreviewMode(!previewMode)}
              leftIcon={<Eye className="w-4 h-4" />}
            >
              {previewMode ? 'Edit Mode' : 'Live Preview'}
            </Button>

            <Button type="submit" variant="primary" size="md" isLoading={loading} leftIcon={<Save className="w-4 h-4" />}>
              {isEdit ? 'Save Changes' : 'Publish Article'}
            </Button>
          </div>
        </div>

        {/* Article Metadata Card */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Article Title"
              placeholder="How I Built an AI Interview Copilot..."
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
            <Input
              label="URL Slug"
              placeholder="how-i-built-ai-interview-copilot"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category"
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              options={categories}
            />

            <Select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'PUBLISHED', label: 'Published (Public)' },
                { value: 'DRAFT', label: 'Draft (Admin Only)' },
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
            />

            <Input
              label="Estimated Reading Time (Minutes)"
              type="number"
              value={formData.readingTime}
              onChange={(e) => setFormData({ ...formData, readingTime: parseInt(e.target.value, 10) || 5 })}
            />
          </div>

          <Input
            label="Featured Image URL"
            placeholder="https://images.unsplash.com/..."
            value={formData.featuredImage}
            onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
          />

          <Input
            label="Tags (Comma-separated)"
            placeholder="AI, RAG, LLM, Next.js, Node.js"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />

          <Textarea
            label="Excerpt / Summary (Appears in article cards and SEO description)"
            placeholder="A brief 1-2 sentence summary of the article..."
            rows={2}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            required
          />
        </div>

        {/* Content / Markdown Editor */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Code className="w-4 h-4 text-brand-400" />
              <span>Article Content (Markdown with Syntax Highlighting)</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">Supports headings, code blocks, tables</span>
          </div>

          {previewMode ? (
            <div className="p-6 rounded-2xl bg-dark-950/70 border border-slate-800/80 min-h-[400px]">
              <MarkdownRenderer content={formData.content} />
            </div>
          ) : (
            <Textarea
              placeholder="Write your article content in markdown format..."
              rows={18}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="font-mono text-xs sm:text-sm leading-relaxed"
              required
            />
          )}
        </div>

        {/* Save button */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/blog')}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="lg" isLoading={loading} leftIcon={<Save className="w-4 h-4" />}>
            {isEdit ? 'Save Article' : 'Publish Article'}
          </Button>
        </div>
      </form>
    </AdminLayout>
  );
};
