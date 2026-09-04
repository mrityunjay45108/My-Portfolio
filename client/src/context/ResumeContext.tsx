import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { personalInfo } from '../data/personal';

interface ResumeContextType {
  resumeUrl: string;
  loading: boolean;
  updateResumeUrl: (newUrl: string) => Promise<void>;
  refreshResumeUrl: () => Promise<void>;
}

const STORAGE_KEY = 'mrityunjay_resume_url';

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeUrl, setResumeUrl] = useState<string>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached && cached.trim().length > 0) {
        return cached.trim();
      }
    } catch {}
    return personalInfo.resumeUrl;
  });
  const [loading, setLoading] = useState(false);

  const fetchResume = async () => {
    try {
      const data = await api.settings.getResume();
      if (data?.resumeUrl && data.resumeUrl.trim().length > 0) {
        setResumeUrl(data.resumeUrl.trim());
        try {
          localStorage.setItem(STORAGE_KEY, data.resumeUrl.trim());
        } catch {}
      }
    } catch (e) {
      console.warn('Could not fetch resume URL from backend, using current/cached:', e);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const updateResumeUrl = async (newUrl: string) => {
    setLoading(true);
    try {
      const res = await api.settings.updateResume(newUrl);
      const updated = res.resumeUrl || newUrl;
      setResumeUrl(updated);
      try {
        localStorage.setItem(STORAGE_KEY, updated);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeUrl,
        loading,
        updateResumeUrl,
        refreshResumeUrl: fetchResume,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
};
