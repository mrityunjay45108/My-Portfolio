import { api } from './api';

const STORAGE_SESSION_KEY = 'mrityunjay_analytics_session_id';

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem(STORAGE_SESSION_KEY);
  if (!sessionId) {
    sessionId = 's_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem(STORAGE_SESSION_KEY, sessionId);
  }
  return sessionId;
};

export interface TrackEventOptions {
  page?: string;
  resourceType?: 'project' | 'blog' | 'case_study' | 'github' | 'resume' | 'contact' | 'ai';
  resourceId?: string;
  referrer?: string;
  metadata?: Record<string, any>;
}

export const trackEvent = (eventType: string, options: TrackEventOptions = {}) => {
  try {
    const sessionId = getSessionId();
    const page = options.page || window.location.pathname;
    const referrer = options.referrer || (document.referrer ? new URL(document.referrer).hostname : 'Direct');

    // Non-blocking beacon or fetch call
    const payload = {
      eventType,
      sessionId,
      page,
      resourceType: options.resourceType || null,
      resourceId: options.resourceId || null,
      referrer,
      metadata: options.metadata || null,
    };

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const url = `${API_BASE}/analytics/events`;

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(url, blob);
    } else {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Non-blocking: fail silently
  }
};

// Convenience helpers
export const trackPageView = (page?: string) => {
  trackEvent('PAGE_VIEW', { page: page || window.location.pathname });
};

export const trackProjectView = (slug: string, category?: string) => {
  trackEvent('PROJECT_VIEW', {
    resourceType: 'project',
    resourceId: slug,
    metadata: { category },
  });
};

export const trackProjectGithubClick = (slug: string) => {
  trackEvent('PROJECT_GITHUB_CLICK', {
    resourceType: 'project',
    resourceId: slug,
  });
};

export const trackProjectLiveDemoClick = (slug: string) => {
  trackEvent('PROJECT_LIVE_DEMO_CLICK', {
    resourceType: 'project',
    resourceId: slug,
  });
};

export const trackResumeDownload = (sourceLocation = 'general') => {
  trackEvent('RESUME_DOWNLOAD', {
    resourceType: 'resume',
    metadata: { sourceLocation },
  });
};

export const trackContactFormOpen = () => {
  trackEvent('CONTACT_FORM_OPEN', {
    resourceType: 'contact',
  });
};

export const trackSocialClick = (platform: 'github' | 'linkedin' | 'email') => {
  if (platform === 'github') trackEvent('GITHUB_PROFILE_CLICK');
  if (platform === 'linkedin') trackEvent('LINKEDIN_CLICK');
};

export const trackAiEvent = (action: 'open' | 'question' | 'source_click', metadata?: any) => {
  if (action === 'open') trackEvent('AI_ASSISTANT_OPEN');
  if (action === 'question') trackEvent('AI_QUESTION', { metadata });
  if (action === 'source_click') trackEvent('AI_SOURCE_CLICK', { metadata });
};
