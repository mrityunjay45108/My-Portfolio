import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  Search,
  Globe,
  Lock,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Check,
  RotateCcw,
  Star,
  Layers,
} from 'lucide-react';
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
  const [savingOrder, setSavingOrder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await api.projects.getAll();
      // Sort by order ascending
      const sorted = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setProjects(sorted);
    } catch (err: any) {
      toastError(err.message || 'Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Save new order positions to backend
  const persistOrder = async (updatedList: Project[]) => {
    setSavingOrder(true);
    try {
      const payload = updatedList.map((p, idx) => ({
        id: p.id,
        order: idx + 1,
      }));
      await api.projects.reorder(payload);
      success('Display order updated & saved to live portfolio!');
    } catch (err: any) {
      toastError(err.message || 'Failed to save new project order');
      fetchProjects();
    } finally {
      setSavingOrder(false);
    }
  };

  // Move a project Up in rank
  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;

    // Re-assign sequence order
    const reordered = updated.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjects(reordered);
    persistOrder(reordered);
  };

  // Move a project Down in rank
  const moveDown = (index: number) => {
    if (index === projects.length - 1) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;

    // Re-assign sequence order
    const reordered = updated.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjects(reordered);
    persistOrder(reordered);
  };

  // Set as #1 Top Project with 1 click
  const makeTopProject = (index: number) => {
    if (index === 0) return;
    const updated = [...projects];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);

    const reordered = updated.map((p, idx) => ({ ...p, order: idx + 1 }));
    setProjects(reordered);
    persistOrder(reordered);
  };

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
      title="Project Management & Display Ranking"
      actionButton={
        <div className="flex items-center gap-2">
          <Link to="/admin/projects/new">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Create Project
            </Button>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Helper Banner for Order Management */}
        <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-brand-500/20 text-brand-400">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">
                Project Position &amp; Sequence Ordering (Kon sa project pehle dikhega)
              </p>
              <p className="text-slate-400 mt-0.5">
                Use the <span className="text-brand-300 font-mono">▲ Move Up</span> and{' '}
                <span className="text-brand-300 font-mono">▼ Move Down</span> arrows or click{' '}
                <span className="text-brand-300 font-mono">Make #1</span> to change which project appears 1st, 2nd, 3rd on the homepage.
              </p>
            </div>
          </div>
          {savingOrder && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 font-mono text-[11px] animate-pulse">
              Saving Order to Portfolio...
            </span>
          )}
        </div>

        {/* Search & Info Bar */}
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

        {/* Projects Ranking Table */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-dark-950/60 text-slate-400 font-mono text-xs uppercase">
                  <th className="py-4 px-4 text-center w-28">Order / Rank</th>
                  <th className="py-4 px-4">Project</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4 text-center">Featured</th>
                  <th className="py-4 px-4 text-center">Visibility (Click to Toggle)</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((proj, idx) => {
                  const originalIndex = projects.findIndex((p) => p.id === proj.id);
                  const isFirst = originalIndex === 0;
                  const isLast = originalIndex === projects.length - 1;

                  return (
                    <tr
                      key={proj.id}
                      className={`hover:bg-slate-800/30 transition-colors ${
                        isFirst ? 'bg-brand-500/5' : ''
                      }`}
                    >
                      {/* Reorder Buttons & Position Badge */}
                      <td className="py-4 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => moveUp(originalIndex)}
                              disabled={isFirst || searchQuery.length > 0}
                              className={`p-1 rounded-md border transition-all cursor-pointer ${
                                isFirst || searchQuery.length > 0
                                  ? 'opacity-25 cursor-not-allowed border-transparent text-slate-600'
                                  : 'bg-dark-950 text-slate-300 border-slate-700 hover:border-brand-500 hover:text-brand-400'
                              }`}
                              title={isFirst ? 'Already at the top' : 'Move up (Show earlier)'}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveDown(originalIndex)}
                              disabled={isLast || searchQuery.length > 0}
                              className={`p-1 rounded-md border transition-all cursor-pointer ${
                                isLast || searchQuery.length > 0
                                  ? 'opacity-25 cursor-not-allowed border-transparent text-slate-600'
                                  : 'bg-dark-950 text-slate-300 border-slate-700 hover:border-brand-500 hover:text-brand-400'
                              }`}
                              title={isLast ? 'Already at the bottom' : 'Move down (Show later)'}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Rank Badge */}
                          <div className="flex flex-col items-center">
                            <span
                              className={`px-2 py-1 rounded-lg font-mono font-bold text-xs border ${
                                isFirst
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/10'
                                  : 'bg-dark-950 text-slate-300 border-slate-800'
                              }`}
                            >
                              #{originalIndex + 1}
                            </span>
                            {!isFirst && searchQuery.length === 0 && (
                              <button
                                onClick={() => makeTopProject(originalIndex)}
                                className="text-[10px] text-brand-400 hover:text-brand-300 font-mono mt-0.5 underline cursor-pointer"
                                title="Set as #1 top project instantly"
                              >
                                Make #1
                              </button>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Project Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-dark-950 flex-shrink-0 border border-slate-800">
                            <img
                              src={
                                proj.images?.[0]?.url ||
                                proj.architectureImage ||
                                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=150&q=80'
                              }
                              alt={proj.title}
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=150&q=80';
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold text-slate-100">{proj.title}</p>
                              {isFirst && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-medium">
                                  <Sparkles className="w-2.5 h-2.5" />
                                  1st Position
                                </span>
                              )}
                            </div>
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
                          title={
                            proj.featured
                              ? 'Featured on homepage (Click to unfeature)'
                              : 'Not featured (Click to feature)'
                          }
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
                          title={
                            proj.published
                              ? 'Currently PUBLIC: Visible to everyone. Click to make PRIVATE.'
                              : 'Currently PRIVATE: Hidden draft. Click to make PUBLIC.'
                          }
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
                  );
                })}
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

export default AdminProjectsPage;
