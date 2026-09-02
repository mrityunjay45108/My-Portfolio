import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, BookOpen, Eye, Search, Calendar, Tag as TagIcon } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { BlogPost } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.blog.getAll();
      setPosts(res.posts);
    } catch (err: any) {
      toastError(err.message || 'Error fetching blog articles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async () => {
    if (!selectedPostId) return;
    try {
      await api.blog.delete(selectedPostId);
      success('Article deleted successfully');
      setDeleteModalOpen(false);
      fetchPosts();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete article');
    }
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      title="Blog CMS & Publications"
      actionButton={
        <Link to="/admin/blog/new">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Write Article
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-500" />}
              className="py-2 text-xs"
            />
          </div>
          <span className="text-xs font-mono text-slate-500">{filtered.length} total articles</span>
        </div>

        {/* Blog Table */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-dark-950/60 text-slate-400 font-mono text-xs uppercase">
                  <th className="py-4 px-6">Article</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4">Published Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-slate-100">{post.title}</p>
                        <p className="text-xs text-slate-500 font-mono">{post.slug}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {post.category ? (
                        <Badge variant="cyan" size="sm">
                          {post.category.name}
                        </Badge>
                      ) : (
                        <span className="text-slate-500 text-xs">Uncategorized</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium ${
                        post.status === 'PUBLISHED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {post.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-400 font-mono text-xs">
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="Preview public article"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/blog/${post.id}/edit`}
                          className="p-2 text-slate-400 hover:text-brand-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Edit article"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedPostId(post.id);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Article Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to permanently delete this article?
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};
