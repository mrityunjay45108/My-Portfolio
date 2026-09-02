import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink, Star, Eye, Search, Globe, Lock, CheckCircle2 } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Project } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await api.projects.getAll();
      setProjects(data);
    } catch (err: any) {
      toastError(err.message || 'Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async () => {
    if (!selectedProjectId) return;
    try {
      await api.projects.delete(selectedProjectId);
      success('Project removed successfully');
      setDeleteModalOpen(false);
      fetchProjects();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete project');
    }
  };

  const toggleFeatured = async (project: Project) => {
    try {
      await api.projects.update(project.id, { featured: !project.featured });
      success(`Project marked as ${!project.featured ? 'featured on homepage' : 'standard'}`);
      fetchProjects();
    } catch (err: any) {
      toastError(err.message || 'Failed to update project');
    }
  };

  const togglePublished = async (project: Project) => {
    const newStatus = !project.published;
    try {
      // Optimistic local update
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, published: newStatus } : p))
      );
      await api.projects.update(project.id, { published: newStatus });
      success(
        newStatus
          ? `🌐 "${project.title}" is now PUBLIC (Visible to all visitors)`
          : `🔒 "${project.title}" is now PRIVATE (Hidden from public portfolio)`
      );
    } catch (err: any) {
      toastError(err.message || 'Failed to change project visibility');
      fetchProjects();
    }
  };

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      title="Project Management"
      actionButton={
        <Link to="/admin/projects/new">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Create Project
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Search & Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <Input
              type="text"
              placeholder="Search projects by title or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-500" />}
              className="py-2 text-xs"
            />
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              {projects.filter((p) => p.published).length} Public
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              {projects.filter((p) => !p.published).length} Private
            </span>
            <span>• {filtered.length} total</span>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-dark-950/60 text-slate-400 font-mono text-xs uppercase">
                  <th className="py-4 px-6">Project</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4 text-center">Featured</th>
                  <th className="py-4 px-4 text-center">Visibility (Click to Toggle)</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-dark-950 flex-shrink-0 border border-slate-800">
                          <img
                            src={proj.images?.[0]?.url || proj.architectureImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=150&q=80'}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100">{proj.title}</p>
                          <p className="text-xs text-slate-500 font-mono">{proj.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <Badge variant="cyan" size="sm">
                        {proj.category}
                      </Badge>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => toggleFeatured(proj)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          proj.featured
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-dark-950 text-slate-600 border-slate-800 hover:text-slate-400'
                        }`}
                        title={proj.featured ? 'Featured on homepage (Click to unfeature)' : 'Not featured (Click to feature)'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    {/* Interactive Public / Private 1-Click Toggle */}
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => togglePublished(proj)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-all border cursor-pointer ${
                          proj.published
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25 hover:border-emerald-400'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25 hover:border-amber-400'
                        }`}
                        title={proj.published ? 'Currently PUBLIC: Visible to everyone. Click to make PRIVATE.' : 'Currently PRIVATE: Hidden draft. Click to make PUBLIC.'}
                      >
                        {proj.published ? (
                          <>
                            <Globe className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Public</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Private</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/projects/${proj.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="Preview project page"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/projects/${proj.id}/edit`}
                          className="p-2 text-slate-400 hover:text-brand-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Edit project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedProjectId(proj.id);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete project"
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
        title="Confirm Project Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete this project? This will permanently remove all associated features and media records.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};
