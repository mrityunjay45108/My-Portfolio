import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, FileCode2, Eye, Search, Star } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { CaseStudy } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';

export const AdminCaseStudiesPage: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  const fetchCaseStudies = async () => {
    setLoading(true);
    try {
      const data = await api.caseStudies.getAll();
      setCaseStudies(data);
    } catch (err: any) {
      toastError(err.message || 'Error loading case studies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const handleDelete = async () => {
    if (!selectedCaseStudyId) return;
    try {
      await api.caseStudies.delete(selectedCaseStudyId);
      success('Case study deleted successfully');
      setDeleteModalOpen(false);
      fetchCaseStudies();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete case study');
    }
  };

  const filtered = caseStudies.filter((cs) =>
    cs.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout
      title="Engineering Case Studies"
      actionButton={
        <Link to="/admin/case-studies/new">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            New Case Study
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
              placeholder="Search case studies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-500" />}
              className="py-2 text-xs"
            />
          </div>
          <span className="text-xs font-mono text-slate-500">{filtered.length} total case studies</span>
        </div>

        {/* Case Studies Table */}
        <div className="bg-dark-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-dark-950/60 text-slate-400 font-mono text-xs uppercase">
                  <th className="py-4 px-6">Case Study</th>
                  <th className="py-4 px-4 text-center">Featured</th>
                  <th className="py-4 px-4 text-center">Status</th>
                  <th className="py-4 px-4">Published Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((cs) => (
                  <tr key={cs.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-slate-100">{cs.title}</p>
                        <p className="text-xs text-slate-500 font-mono">{cs.slug}</p>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className={`p-1.5 rounded-lg border inline-flex ${
                        cs.featured
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                          : 'bg-dark-950 text-slate-600 border-slate-800'
                      }`}>
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {cs.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-400 font-mono text-xs">
                      {new Date(cs.publishedAt || cs.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/case-studies/${cs.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title="Preview public case study"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <Link
                          to={`/admin/case-studies/${cs.id}/edit`}
                          className="p-2 text-slate-400 hover:text-brand-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="Edit case study"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedCaseStudyId(cs.id);
                            setDeleteModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Delete case study"
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
        title="Confirm Case Study Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to permanently delete this case study?
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
