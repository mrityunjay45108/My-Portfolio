import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Layers, Search } from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Technology } from '../../types';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';

export const AdminTechnologiesPage: React.FC = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTech, setNewTech] = useState({ name: '', category: 'Languages', icon: 'Code' });
  const [saving, setSaving] = useState(false);
  const { success, error: toastError } = useToast();

  const fetchTechnologies = async () => {
    setLoading(true);
    try {
      const data = await api.technologies.getAll();
      setTechnologies(data);
    } catch (err: any) {
      toastError(err.message || 'Error loading technologies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnologies();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.technologies.create(newTech);
      success('Technology added successfully');
      setNewTech({ name: '', category: 'Languages', icon: 'Code' });
      setAddModalOpen(false);
      fetchTechnologies();
    } catch (err: any) {
      toastError(err.message || 'Failed to add technology');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.technologies.delete(id);
      success('Technology removed');
      fetchTechnologies();
    } catch (err: any) {
      toastError(err.message || 'Failed to delete technology');
    }
  };

  return (
    <AdminLayout
      title="Technology Catalog"
      actionButton={
        <Button variant="primary" size="sm" onClick={() => setAddModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Add Technology
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="bg-dark-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {technologies.map((tech) => (
              <div
                key={tech.id}
                className="p-4 rounded-2xl bg-dark-950/60 border border-slate-800/80 flex items-center justify-between gap-3 group hover:border-slate-700 transition-colors"
              >
                <div>
                  <p className="font-semibold text-sm text-slate-100">{tech.name}</p>
                  <p className="text-xs font-mono text-slate-500">{tech.category}</p>
                </div>
                <button
                  onClick={() => handleDelete(tech.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {technologies.length === 0 && (
            <p className="text-center text-xs text-slate-500 py-8">
              No custom technologies loaded yet. Click Add Technology above to add new ones.
            </p>
          )}
        </div>
      </div>

      <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Add Technology">
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Technology Name"
            placeholder="e.g. Next.js, Redis, LangChain"
            value={newTech.name}
            onChange={(e) => setNewTech({ ...newTech, name: e.target.value })}
            required
          />
          <Select
            label="Category"
            value={newTech.category}
            onChange={(e) => setNewTech({ ...newTech, category: e.target.value })}
            options={[
              { value: 'Languages', label: 'Languages' },
              { value: 'Frontend', label: 'Frontend' },
              { value: 'Backend', label: 'Backend' },
              { value: 'Databases', label: 'Databases' },
              { value: 'DevOps & Cloud', label: 'DevOps & Cloud' },
              { value: 'AI & GenAI', label: 'AI & GenAI' },
              { value: 'General', label: 'General' },
            ]}
          />
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={saving}>
              Add Technology
            </Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};
