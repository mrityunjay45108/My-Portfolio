import {
  Project,
  BlogPost,
  CaseStudy,
  Technology,
  ContactMessage,
  User,
  GitHubProfile,
  GitHubRepo,
  GitHubActivity,
  GitHubLanguageBreakdown,
  GitHubContributionData,
} from '../types';
import { initialProjects } from '../data/projects';
import { initialBlogPosts } from '../data/blogs';
import { initialCaseStudies } from '../data/caseStudies';
import {
  fallbackGitHubProfile,
  fallbackGitHubRepos,
  fallbackGitHubLanguages,
  fallbackGitHubActivity,
  fallbackGitHubContributions,
} from '../data/github';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private token: string | null = localStorage.getItem('token');

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(data.message || `Request failed with status ${res.status}`);
      }

      return data.data !== undefined ? data.data : data;
    } catch (err: any) {
      console.warn(`API call failed on ${endpoint}:`, err.message);
      throw err;
    }
  }

  // AUTH
  auth = {
    login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
      const res = await this.request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (res?.token) {
        this.setToken(res.token);
      }
      return res;
    },
    logout: async (): Promise<void> => {
      try {
        await this.request('/auth/logout', { method: 'POST' });
      } finally {
        this.setToken(null);
      }
    },
    getMe: async (): Promise<User> => {
      return this.request<User>('/auth/me');
    },
  };

  // PROJECTS
  projects = {
    getAll: async (params?: { category?: string; search?: string }): Promise<Project[]> => {
      try {
        const query = new URLSearchParams();
        if (params?.category && params.category !== 'All') query.set('category', params.category);
        if (params?.search) query.set('search', params.search);
        const qs = query.toString() ? `?${query.toString()}` : '';
        return await this.request<Project[]>(`/projects${qs}`);
      } catch {
        let filtered = [...initialProjects];
        if (params?.category && params.category !== 'All') {
          filtered = filtered.filter((p) => p.category === params.category);
        }
        if (params?.search) {
          const s = params.search.toLowerCase();
          filtered = filtered.filter((p) => p.title.toLowerCase().includes(s) || p.shortDescription.toLowerCase().includes(s));
        }
        return filtered;
      }
    },
    getFeatured: async (): Promise<Project[]> => {
      try {
        return await this.request<Project[]>('/projects/featured');
      } catch {
        return initialProjects.filter((p) => p.featured);
      }
    },
    getBySlug: async (slug: string): Promise<Project> => {
      try {
        return await this.request<Project>(`/projects/${slug}`);
      } catch {
        const p = initialProjects.find((item) => item.slug === slug || item.id === slug);
        if (!p) throw new Error('Project not found');
        return p;
      }
    },
    create: async (data: any): Promise<Project> => {
      return this.request<Project>('/projects', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any): Promise<Project> => {
      return this.request<Project>(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string): Promise<void> => {
      return this.request<void>(`/projects/${id}`, {
        method: 'DELETE',
      });
    },
    addImage: async (projectId: string, url: string, altText?: string, order = 0) => {
      return this.request(`/projects/${projectId}/images`, {
        method: 'POST',
        body: JSON.stringify({ url, altText, order }),
      });
    },
    deleteImage: async (projectId: string, imageId: string) => {
      return this.request(`/projects/${projectId}/images/${imageId}`, {
        method: 'DELETE',
      });
    },
    reorderImages: async (projectId: string, images: { id: string; order: number }[]) => {
      return this.request(`/projects/${projectId}/images/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ images }),
      });
    },
    reorder: async (projects: { id: string; order: number }[]) => {
      return this.request(`/projects/reorder`, {
        method: 'PUT',
        body: JSON.stringify({ projects }),
      });
    },
  };

  // BLOG
  blog = {
    getAll: async (params?: { page?: number; limit?: number; search?: string; category?: string; tag?: string }): Promise<{ posts: BlogPost[]; pagination: any }> => {
      try {
        const query = new URLSearchParams();
        if (params?.page) query.set('page', params.page.toString());
        if (params?.limit) query.set('limit', params.limit.toString());
        if (params?.search) query.set('search', params.search);
        if (params?.category) query.set('category', params.category);
        if (params?.tag) query.set('tag', params.tag);
        const qs = query.toString() ? `?${query.toString()}` : '';
        const data = await this.request<any>(`/blog${qs}`);
        return {
          posts: Array.isArray(data) ? data : data.posts || data,
          pagination: data.pagination || { page: 1, limit: 9, total: initialBlogPosts.length, totalPages: 1 },
        };
      } catch {
        let posts = [...initialBlogPosts];
        if (params?.category) {
          posts = posts.filter((p) => p.category?.slug === params.category);
        }
        if (params?.search) {
          const s = params.search.toLowerCase();
          posts = posts.filter((p) => p.title.toLowerCase().includes(s) || p.excerpt.toLowerCase().includes(s));
        }
        return {
          posts,
          pagination: { page: 1, limit: 9, total: posts.length, totalPages: 1 },
        };
      }
    },
    getBySlug: async (slug: string): Promise<BlogPost> => {
      try {
        return await this.request<BlogPost>(`/blog/${slug}`);
      } catch {
        const b = initialBlogPosts.find((item) => item.slug === slug || item.id === slug);
        if (!b) throw new Error('Article not found');
        return b;
      }
    },
    create: async (data: any): Promise<BlogPost> => {
      return this.request<BlogPost>('/blog', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any): Promise<BlogPost> => {
      return this.request<BlogPost>(`/blog/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string): Promise<void> => {
      return this.request<void>(`/blog/${id}`, {
        method: 'DELETE',
      });
    },
    getCategories: async () => {
      try {
        return await this.request<any[]>('/blog/categories');
      } catch {
        return [
          { id: 'cat-1', name: 'AI & Generative AI', slug: 'ai-generative-ai', _count: { posts: 2 } },
          { id: 'cat-2', name: 'Backend & Architecture', slug: 'backend-architecture', _count: { posts: 1 } },
          { id: 'cat-3', name: 'Full Stack Development', slug: 'full-stack-dev', _count: { posts: 0 } },
          { id: 'cat-4', name: 'System Design & DevOps', slug: 'system-design-devops', _count: { posts: 0 } },
        ];
      }
    },
    createCategory: async (data: { name: string; description?: string }) => {
      return this.request('/blog/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    deleteCategory: async (id: string) => {
      return this.request(`/blog/categories/${id}`, {
        method: 'DELETE',
      });
    },
    getTags: async () => {
      try {
        return await this.request<any[]>('/blog/tags');
      } catch {
        return [
          { id: 'tag-1', name: 'AI', slug: 'ai' },
          { id: 'tag-2', name: 'RAG', slug: 'rag' },
          { id: 'tag-3', name: 'LLM', slug: 'llm' },
          { id: 'tag-4', name: 'React', slug: 'react' },
          { id: 'tag-5', name: 'Node.js', slug: 'nodejs' },
          { id: 'tag-6', name: 'PostgreSQL', slug: 'postgresql' },
          { id: 'tag-7', name: 'Docker', slug: 'docker' },
        ];
      }
    },
  };

  // CASE STUDIES
  caseStudies = {
    getAll: async (params?: { featured?: boolean; search?: string }): Promise<CaseStudy[]> => {
      try {
        const query = new URLSearchParams();
        if (params?.featured) query.set('featured', 'true');
        if (params?.search) query.set('search', params.search);
        const qs = query.toString() ? `?${query.toString()}` : '';
        return await this.request<CaseStudy[]>(`/case-studies${qs}`);
      } catch {
        let list = [...initialCaseStudies];
        if (params?.featured) list = list.filter((c) => c.featured);
        if (params?.search) {
          const s = params.search.toLowerCase();
          list = list.filter((c) => c.title.toLowerCase().includes(s) || c.summary.toLowerCase().includes(s));
        }
        return list;
      }
    },
    getBySlug: async (slug: string): Promise<CaseStudy> => {
      try {
        return await this.request<CaseStudy>(`/case-studies/${slug}`);
      } catch {
        const cs = initialCaseStudies.find((c) => c.slug === slug || c.id === slug);
        if (!cs) throw new Error('Case study not found');
        return cs;
      }
    },
    create: async (data: any): Promise<CaseStudy> => {
      return this.request<CaseStudy>('/case-studies', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any): Promise<CaseStudy> => {
      return this.request<CaseStudy>(`/case-studies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string): Promise<void> => {
      return this.request<void>(`/case-studies/${id}`, {
        method: 'DELETE',
      });
    },
  };

  // TECHNOLOGIES
  technologies = {
    getAll: async (category?: string): Promise<Technology[]> => {
      try {
        const qs = category ? `?category=${encodeURIComponent(category)}` : '';
        return await this.request<Technology[]>(`/technologies${qs}`);
      } catch {
        return [];
      }
    },
    create: async (data: { name: string; icon?: string; category?: string }): Promise<Technology> => {
      return this.request<Technology>('/technologies', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    update: async (id: string, data: any): Promise<Technology> => {
      return this.request<Technology>(`/technologies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    delete: async (id: string): Promise<void> => {
      return this.request<void>(`/technologies/${id}`, {
        method: 'DELETE',
      });
    },
  };

  // GITHUB INTEGRATION
  github = {
    getProfile: async (): Promise<GitHubProfile> => {
      try {
        return await this.request<GitHubProfile>('/github/profile');
      } catch {
        return fallbackGitHubProfile;
      }
    },
    getRepositories: async (refresh = false): Promise<GitHubRepo[]> => {
      try {
        const qs = refresh ? '?refresh=true' : '';
        return await this.request<GitHubRepo[]>(`/github/repositories${qs}`);
      } catch {
        return fallbackGitHubRepos;
      }
    },
    getRepository: async (owner: string, repo: string): Promise<any> => {
      try {
        return await this.request<any>(`/github/repositories/${owner}/${repo}`);
      } catch {
        const found = fallbackGitHubRepos.find((r) => r.name === repo || r.fullName.includes(repo));
        if (found) return found;
        return {
          name: repo,
          full_name: `${owner}/${repo}`,
          description: 'Open source repository by Mrityunjay Kumar.',
          html_url: `https://github.com/${owner}/${repo}`,
          stargazers_count: 25,
          forks_count: 5,
          language: 'TypeScript',
          topics: ['portfolio', 'open-source'],
        };
      }
    },
    getLanguages: async (): Promise<GitHubLanguageBreakdown> => {
      try {
        return await this.request<GitHubLanguageBreakdown>('/github/languages');
      } catch {
        return fallbackGitHubLanguages;
      }
    },
    getActivity: async (): Promise<GitHubActivity[]> => {
      try {
        return await this.request<GitHubActivity[]>('/github/activity');
      } catch {
        return fallbackGitHubActivity;
      }
    },
    getContributions: async (): Promise<GitHubContributionData> => {
      try {
        return await this.request<GitHubContributionData>('/github/contributions');
      } catch {
        return fallbackGitHubContributions;
      }
    },
  };

  // ADMIN GITHUB MANAGEMENT
  adminGithub = {
    getFeatured: async (): Promise<GitHubRepo[]> => {
      try {
        return await this.request<GitHubRepo[]>('/admin/github/featured');
      } catch {
        return fallbackGitHubRepos.filter((r) => r.featured);
      }
    },
    createFeatured: async (data: any): Promise<GitHubRepo> => {
      return this.request<GitHubRepo>('/admin/github/featured', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    updateFeatured: async (id: string, data: any): Promise<GitHubRepo> => {
      return this.request<GitHubRepo>(`/admin/github/featured/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    },
    deleteFeatured: async (id: string): Promise<void> => {
      return this.request<void>(`/admin/github/featured/${id}`, {
        method: 'DELETE',
      });
    },
    sync: async (): Promise<{ syncedCount: number; message: string }> => {
      return this.request<{ syncedCount: number; message: string }>('/admin/github/sync', {
        method: 'POST',
      });
    },
  };

  // CONTACT
  contact = {
    sendMessage: async (data: {
      name: string;
      email: string;
      subject?: string;
      message: string;
      company?: string;
      purpose?: string;
      sessionId?: string;
    }): Promise<{ success: boolean; message: string }> => {
      return this.request<{ success: boolean; message: string }>('/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    getMessages: async (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
      const query = new URLSearchParams();
      if (params?.status) query.set('status', params.status);
      if (params?.search) query.set('search', params.search);
      if (params?.page) query.set('page', String(params.page));
      if (params?.limit) query.set('limit', String(params.limit));
      const qs = query.toString();
      return this.request<any>(`/contact${qs ? `?${qs}` : ''}`);
    },
    updateStatus: async (id: string, status: 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED') => {
      return this.request<any>(`/contact/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    },
    deleteMessage: async (id: string): Promise<void> => {
      return this.request<void>(`/contact/${id}`, {
        method: 'DELETE',
      });
    },
  };

  // ANALYTICS & RECRUITER CONVERSION
  analytics = {
    recordEvent: async (data: any) => {
      try {
        return await this.request('/analytics/events', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch {
        // Silent fail
      }
    },
    track: async (data: { path?: string; type?: string; resourceId?: string; referrer?: string }) => {
      return this.analytics.recordEvent({
        eventType: data.type || 'PAGE_VIEW',
        page: data.path,
        resourceId: data.resourceId,
        referrer: data.referrer,
      });
    },
    getStats: async (timeRange = '30d') => {
      return this.analytics.getOverview(timeRange);
    },
    getOverview: async (timeRange = '30d') => {
      return this.request<any>(`/analytics/overview?timeRange=${timeRange}`);
    },
    getProjects: async (timeRange = '30d') => {
      return this.request<any>(`/analytics/projects?timeRange=${timeRange}`);
    },
    getFunnel: async (timeRange = '30d') => {
      return this.request<any>(`/analytics/funnel?timeRange=${timeRange}`);
    },
    getSources: async (timeRange = '30d') => {
      return this.request<any>(`/analytics/sources?timeRange=${timeRange}`);
    },
    getExportUrl: (timeRange = 'all') => {
      return `${API_BASE}/analytics/export?timeRange=${timeRange}`;
    },
  };

  // MEDIA UPLOAD
  media = {
    upload: async (file: File): Promise<{ url: string; filename: string }> => {
      const formData = new FormData();
      formData.append('file', file);

      const token = this.getToken();
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE}/media/upload`, {
        method: 'POST',
        body: formData,
        headers,
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Media upload failed');
      }

      return data.data;
    },
  };

  // AI PORTFOLIO ASSISTANT
  ai = {
    chat: async (message: string, conversationId?: string, sessionId?: string): Promise<{
      success: boolean;
      answer: string;
      conversationId: string;
      sources: { title: string; url: string; type: string }[];
      responseType: string;
      metadata?: any;
      latencyMs: number;
    }> => {
      try {
        const res = await this.request<any>('/ai/chat', {
          method: 'POST',
          body: JSON.stringify({ message, conversationId, sessionId }),
        });
        return res;
      } catch (err: any) {
        return {
          success: false,
          answer: "I'm temporarily experiencing an issue. You can explore Mrityunjay's Projects, Skills, and About sections directly!",
          conversationId: conversationId || 'error-session',
          sources: [],
          responseType: 'text',
          latencyMs: 0,
        };
      }
    },

    getSuggestedQuestions: async (): Promise<string[]> => {
      try {
        const res = await this.request<any>('/ai/suggested-questions');
        return res.questions || [];
      } catch {
        return [
          "Who is Mrityunjay Kumar?",
          "Show me his AI projects",
          "What technologies does he use?",
          "Tell me about AI Interview Copilot",
          "How can I contact him?",
        ];
      }
    },

    getAdminStats: async () => {
      return this.request<any>('/ai/admin/stats');
    },

    updateSettings: async (settings: any) => {
      return this.request<any>('/ai/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });
    },

    clearConversations: async () => {
      return this.request<any>('/ai/admin/conversations', {
        method: 'DELETE',
      });
    },
  };
}

export const api = new ApiClient();
export default api;
