import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Award,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Check,
} from 'lucide-react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { useEducation } from '../../context/EducationContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { EducationItem } from '../../types';

export const AdminEducationPage: React.FC = () => {
  const { educations, addEducation, updateEducation, deleteEducation, reorderEducation, resetToDefault } = useEducation();
  const { success, error: toastError } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    university: '',
    duration: '',
    location: '',
    grade: '',
    highlights: [''],
  });

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      degree: '',
      institution: '',
      university: '',
      duration: '',
      location: '',
      grade: '',
      highlights: [''],
    });
    setModalOpen(true);
  };

  const openEditModal = (edu: EducationItem) => {
    setEditingId(edu.id);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      university: edu.university || '',
      duration: edu.duration,
      location: edu.location,
      grade: edu.grade || '',
      highlights: edu.highlights && edu.highlights.length > 0 ? [...edu.highlights] : [''],
    });
    setModalOpen(true);
  };

  const handleHighlightChange = (index: number, val: string) => {
    setFormData((prev) => {
      const copy = [...prev.highlights];
      copy[index] = val;
      return { ...prev, highlights: copy };
    });
  };

  const addHighlightField = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, ''],
    }));
  };

  const removeHighlightField = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.degree.trim() || !formData.institution.trim() || !formData.duration.trim()) {
      toastError('Please fill in Degree, Institution, and Duration');
      return;
    }

    const cleanedHighlights = formData.highlights.map((h) => h.trim()).filter(Boolean);

    if (editingId) {
      updateEducation(editingId, {
        degree: formData.degree.trim(),
        institution: formData.institution.trim(),
        university: formData.university.trim() || undefined,
        duration: formData.duration.trim(),
        location: formData.location.trim(),
        grade: formData.grade.trim() || undefined,
        highlights: cleanedHighlights,
      });
      success('Education details updated successfully!');
    } else {
      addEducation({
        degree: formData.degree.trim(),
        institution: formData.institution.trim(),
        university: formData.university.trim() || undefined,
        duration: formData.duration.trim(),
        location: formData.location.trim(),
        grade: formData.grade.trim() || undefined,
        highlights: cleanedHighlights,
      });
      success('New education record added successfully!');
    }

    setModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!selectedId) return;
    deleteEducation(selectedId);
    success('Education record deleted successfully');
    setDeleteModalOpen(false);
    setSelectedId(null);
  };

  const handleReset = () => {
    if (window.confirm('Reset education details to default demo records?')) {
      resetToDefault();
      success('Education records reset to default');
    }
  };

  return (
    <AdminLayout
      title="Education & Qualifications Manager"
      actionButton={
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleReset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            Reset Default
          </Button>
          <Button variant="primary" size="sm" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
            Add Education
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Info card */}
        <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-brand-400" />
            <span>Manage your academic degrees, institutions, duration, coursework, and highlights.</span>
          </div>
          <span className="font-mono text-slate-500">{educations.length} records</span>
        </div>

        {/* Education List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {educations.map((edu, idx) => (
            <div
              key={edu.id}
              className="bg-dark-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl relative group"
            >
              <div className="space-y-4">
                {/* Header with Badges and Reorder controls */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <span className="text-xs font-mono text-slate-400 bg-dark-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {edu.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {idx > 0 && (
                      <button
                        onClick={() => reorderEducation(idx, idx - 1)}
                        className="p-1.5 text-slate-400 hover:text-white rounded bg-dark-950 border border-slate-800"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {idx < educations.length - 1 && (
                      <button
                        onClick={() => reorderEducation(idx, idx + 1)}
                        className="p-1.5 text-slate-400 hover:text-white rounded bg-dark-950 border border-slate-800"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(edu)}
                      className="p-1.5 text-slate-400 hover:text-brand-400 rounded bg-dark-950 border border-slate-800 transition-colors"
                      title="Edit education"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedId(edu.id);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded bg-dark-950 border border-slate-800 transition-colors"
                      title="Delete education"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Degree & Institution */}
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{edu.degree}</h3>
                  <p className="text-sm font-semibold text-brand-400 mt-0.5">{edu.institution}</p>
                  {edu.university && (
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{edu.university}</p>
                  )}
                  {edu.grade && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-medium text-emerald-300 mt-2">
                      <Award className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{edu.grade}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs text-slate-500 font-mono mt-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{edu.location}</span>
                  </div>
                </div>

                {/* Highlights */}
                {edu.highlights && edu.highlights.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                      Highlights & Coursework:
                    </p>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {edu.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-brand-400 font-bold">•</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {educations.length === 0 && (
          <div className="text-center py-12 bg-dark-900 border border-slate-800 rounded-3xl p-8 space-y-4">
            <GraduationCap className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-200">No Education Records Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add your university degrees, diplomas, coursework, and qualifications.
            </p>
            <Button variant="primary" size="sm" onClick={openAddModal} leftIcon={<Plus className="w-4 h-4" />}>
              Add First Education Record
            </Button>
          </div>
        )}
      </div>

      {/* Add / Edit Education Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit Education Details' : 'Add New Education'}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Degree / Diploma Title"
              placeholder="B.Tech in Computer Science & Engineering"
              value={formData.degree}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
              required
            />
            <Input
              label="Institution / College Name"
              placeholder="Katihar Engineering College"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="University / Board (Optional)"
              placeholder="Bihar Engineering University (BEU)"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
            />
            <Input
              label="Score: CGPA / Percentage / Division (Optional)"
              placeholder="e.g. 8.4 CGPA or 85.6% or CGPA: 8.2 / 10"
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              helperText="Displays as a verified score badge on public portfolio"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Duration"
              placeholder="2021 - 2025"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
            <Input
              label="Location"
              placeholder="Katihar, Bihar, India"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          {/* Highlights & Coursework Builder */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Coursework & Key Highlights (Bullet Points)
              </label>
              <button
                type="button"
                onClick={addHighlightField}
                className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Bullet
              </button>
            </div>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {formData.highlights.map((highlight, hIdx) => (
                <div key={hIdx} className="flex items-center gap-2">
                  <Input
                    placeholder={`e.g. Core Coursework: DSA, DBMS, OS, Networks...`}
                    value={highlight}
                    onChange={(e) => handleHighlightChange(hIdx, e.target.value)}
                    className="flex-1"
                  />
                  {formData.highlights.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlightField(hIdx)}
                      className="p-2.5 rounded-xl bg-dark-950 border border-slate-800 text-red-400 hover:bg-red-500 hover:text-white transition-colors cursor-pointer flex-shrink-0"
                      title="Remove bullet point"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingId ? 'Update Education' : 'Add Education'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Education Deletion"
        maxWidth="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete this education qualification? This will remove it from your public portfolio.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>
              Delete Record
            </Button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};
