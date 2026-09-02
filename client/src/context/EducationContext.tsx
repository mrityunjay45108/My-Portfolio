import React, { createContext, useContext, useState, useEffect } from 'react';
import { EducationItem } from '../types';
import { educations as defaultEducations } from '../data/education';

interface EducationContextType {
  educations: EducationItem[];
  addEducation: (item: Omit<EducationItem, 'id'>) => void;
  updateEducation: (id: string, item: Partial<EducationItem>) => void;
  deleteEducation: (id: string) => void;
  reorderEducation: (fromIndex: number, toIndex: number) => void;
  resetToDefault: () => void;
}

const STORAGE_KEY = 'mrityunjay_portfolio_educations';

const EducationContext = createContext<EducationContextType | undefined>(undefined);

export const EducationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [educations, setEducations] = useState<EducationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading educations from storage:', e);
    }
    return defaultEducations;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(educations));
    } catch (e) {
      console.error('Error saving educations to storage:', e);
    }
  }, [educations]);

  const addEducation = (item: Omit<EducationItem, 'id'>) => {
    const newItem: EducationItem = {
      ...item,
      id: `edu-${Date.now()}`,
    };
    setEducations((prev) => [newItem, ...prev]);
  };

  const updateEducation = (id: string, updatedFields: Partial<EducationItem>) => {
    setEducations((prev) =>
      prev.map((edu) => (edu.id === id ? { ...edu, ...updatedFields } : edu))
    );
  };

  const deleteEducation = (id: string) => {
    setEducations((prev) => prev.filter((edu) => edu.id !== id));
  };

  const reorderEducation = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= educations.length) return;
    setEducations((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
  };

  const resetToDefault = () => {
    setEducations(defaultEducations);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <EducationContext.Provider
      value={{
        educations,
        addEducation,
        updateEducation,
        deleteEducation,
        reorderEducation,
        resetToDefault,
      }}
    >
      {children}
    </EducationContext.Provider>
  );
};

export const useEducation = () => {
  const context = useContext(EducationContext);
  if (!context) {
    throw new Error('useEducation must be used within an EducationProvider');
  }
  return context;
};
