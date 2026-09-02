import React, { useEffect, useState } from 'react';
import { RefreshCw, Star, Edit2, Trash2, ExternalLink, Sparkles, FolderGit2, Link as LinkIcon } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { GitHubRepo, Project } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';

export const AdminGitHubPage: React.FC = () => {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<GitHubRepo | null>(null);
  const [editForm, setEditForm] = useState({
    customDescription: '',
    projectId: '',
    featured: false,
    displayOrder: 0,
  });

  const { success, error: toastError } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [repoList, projectList] = await Promise.all([
        api.adminGithub.getFeatured(),
        api.projects.getAll(),
      ]);
      setRepos(repoList);
      setProjects(projectList);
    } catch (err: any) {
      toastError(err.message || 'Error loading GitHub repositories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await api.adminGithub.sync();
      success(res.message || 'Repositories successfully synced with GitHub!');
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to sync with GitHub API');
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleFeatured = async (repo: GitHubRepo) => {
    try {
      await api.adminGithub.updateFeatured(repo.id, {
        featured: !repo.featured,
      });
      success(`Repository ${!repo.featured ? 'marked as featured' : 'unfeatured'}`);
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to update repository status');
    }
  };

  const openEditModal = (repo: GitHubRepo) => {
    setSelectedRepo(repo);
    setEditForm({
      customDescription: repo.customDescription || repo.description || '',
      projectId: repo.projectId || '',
      featured: repo.featured,
      displayOrder: repo.displayOrder || 0,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepo) return;

    try {
      await api.adminGithub.updateFeatured(selectedRepo.id, {
        customDescription: editForm.customDescription,
        projectId: editForm.projectId || null,
        featured: editForm.featured,
        displayOrder: editForm.displayOrder,
      });
      success('Repository metadata updated successfully');
      setEditModalOpen(false);
      fetchData();
    } catch (err: any) {
      toastError(err.message || 'Failed to update repository');
    }
  };

  return (
    <AdminLayout
      title="GitHub Repositories & Activity CMS"
      actionButton={
        <Button
          variant="primary"
          size="sm"
          onClick={handleSync}
          isLoading={syncing}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Sync with GitHub
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Status card */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">Repository Synchronization Status</h3>
            <p className="text-xs text-slate-400">
              Manage featured open source repositories and associate them with case study projects.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Connected: @mrityunjay45108
            </span>
          </div>
        </div>

        {/* Repositories Table */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-dark-950/60 text-slate-400 font-mono text-xs uppercase">
                  <th className="py-4 px-6">Repository</th>
                  <th className="py-4 px-4 text-center">Language</th>
                  <th className="py-4 px-4 text-center">Featured</th>
                  <th className="py-4 px-4">Associated Portfolio Project</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {repos.map((repo) => (
                  <tr key={repo.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-dark-950 border border-slate-800 flex items-center justify-center text-brand-400 flex-shrink-0">
                          <FolderGit2 className="w-4 h-4" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-semibold text-slate-100">{repo.name}</p>
                          <p className="text-xs text-slate-500 truncate max-w-xs">{repo.description}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center font-mono text-xs text-slate-300">
                      {repo.language || 'Code'}
                    </td>

                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(repo)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          repo.featured
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-dark-950 text-slate-600 border-slate-800 hover:text-slate-400'
                        }`}
                        title={repo.featured ? 'Featured repository' : 'Not featured'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </td>

                    <td className="py-4 px-4">
                      {repo.project ? (
                        <Badge variant="brand" size="sm">
                          {repo.project.title}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-500 font-mono">None</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={repo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="Open GitHub"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => openEditModal(repo)}
                          className="p-2 text-slate-400 hover:text-brand-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Edit repository settings"
                        >
                          <Edit2 className="w-4 h-4" />
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

      {/* Edit Repository Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={`Configure Repository: ${selectedRepo?.name}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4">
          <Textarea
            label="Custom Display Description"
            placeholder="Custom summary to display in repository cards..."
            rows={3}
            value={editForm.customDescription}
            onChange={(e) => setEditForm({ ...editForm, customDescription: e.target.value })}
          />

          <Select
            label="Associate with Portfolio Project"
            value={editForm.projectId}
            onChange={(e) => setEditForm({ ...editForm, projectId: e.target.value })}
            options={[
              { value: '', label: 'None (Standalone Repository)' },
              ...projects.map((p) => ({ value: p.id, label: p.title })),
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Display Order"
              type="number"
              value={editForm.displayOrder}
              onChange={(e) => setEditForm({ ...editForm, displayOrder: parseInt(e.target.value, 10) || 0 })}
            />

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editForm.featured}
                  onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                  className="rounded bg-dark-950 border-slate-700 text-brand-600 focus:ring-brand-500 w-4 h-4"
                />
                <span>Featured Repository</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};
