import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ExternalLink, Star, Eye, Search, Layers } from 'lucide-react';
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
      success(`Project marked as ${!project.featured ? 'featured' : 'standard'}`);
      fetchProjects();
    } catch (err: any) {
      toastError(err.message || 'Failed to update project');
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
        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="w-full sm:w-72">
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-500" />}
              className="py-2 text-xs"
            />
          </div>
          <span className="text-xs font-mono text-slate-500">
            {filtered.length} total projects
          </span>
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
                  <th className="py-4 px-4 text-center">Status</th>
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
                        title={proj.featured ? 'Featured on homepage' : 'Not featured'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Published
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/projects/${proj.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="Preview public page"
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
