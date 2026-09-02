import { GitHubProfile, GitHubRepo, GitHubActivity, GitHubLanguageBreakdown, GitHubContributionData } from '../types';

export const fallbackGitHubProfile: GitHubProfile = {
  username: 'mrityunjay45108',
  name: 'Mrityunjay Kumar',
  avatarUrl: 'https://avatars.githubusercontent.com/u/104928620?v=4',
  bio: 'Full Stack Developer & AI Engineer specializing in Microservices, RAG, and Autonomous AI Systems.',
  publicRepos: 25,
  followers: 42,
  following: 28,
  totalStars: 142,
  htmlUrl: 'https://github.com/mrityunjay45108',
  company: null,
  location: 'India',
  blog: 'https://mrityunjay.dev',
  twitterUsername: null,
  createdAt: '2022-05-04T00:00:00Z',
};

export const fallbackGitHubRepos: GitHubRepo[] = [
  {
    id: 'gh-jobseekers',
    owner: 'mrityunjay45108',
    name: 'job_portal',
    fullName: 'mrityunjay45108/job_portal',
    description: 'AI-Powered Job Search & Recruitment Portal with AI Resume Builder, 95% ATS Compatibility Analyzer, and Admin/Recruiter Dashboards.',
    url: 'https://github.com/mrityunjay45108/job_portal',
    homepage: 'https://job-portal-psi-henna-74.vercel.app/',
    language: 'TypeScript',
    stars: 38,
    forks: 9,
    topics: ['react', 'nextjs', 'mongodb', 'ats-checker', 'job-portal', 'tailwind-css', 'express'],
    category: 'Full Stack',
    isFork: false,
    featured: true,
    displayOrder: 1,
    customDescription: 'Next-Gen Talent Network and job search platform featuring AI Resume Builder, ATS Score Checker, and Multi-Role Admin Management.',
    projectId: 'proj-jobseekers',
    project: {
      id: 'proj-jobseekers',
      title: 'JobSeekers — AI-Powered Job Search & Recruitment Portal',
      slug: 'job-portal',
    },
    createdAt: '2024-04-10T00:00:00Z',
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
  },
  {
    id: 'gh-1',
    owner: 'mrityunjay45108',
    name: 'ai-english-learning-app',
    fullName: 'mrityunjay45108/ai-english-learning-app',
    description: 'AI-powered English learning platform & mock interview copilot with Emma AI prompt studio, real-time speech evaluation, and mobile app sync.',
    url: 'https://github.com/mrityunjay45108/ai-english-learning-app',
    homepage: 'https://interview-copilot.demo.mrityunjay.dev',
    language: 'TypeScript',
    stars: 48,
    forks: 12,
    topics: ['ai', 'rag', 'nextjs', 'react-native', 'llm', 'speech-to-text'],
    category: 'AI',
    isFork: false,
    featured: true,
    displayOrder: 2,
    customDescription: 'Flagship open-source AI English learning and mock interview copilot utilizing Emma AI prompt studio and real-time voice streaming.',
    projectId: 'proj-1',
    project: {
      id: 'proj-1',
      title: 'AI Interview Copilot & Seekho English Learning App',
      slug: 'ai-interview-copilot',
    },
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: 'gh-2',
    owner: 'mrityunjay45108',
    name: 'enterprise-rag-platform',
    fullName: 'mrityunjay45108/enterprise-rag-platform',
    description: 'Production-ready Retrieval-Augmented Generation (RAG) platform with hybrid vector search and exact citation tracking.',
    url: 'https://github.com/mrityunjay45108/enterprise-rag-platform',
    homepage: 'https://rag-platform.demo.mrityunjay.dev',
    language: 'Python',
    stars: 35,
    forks: 8,
    topics: ['python', 'rag', 'pgvector', 'fastapi', 'langchain'],
    category: 'AI',
    isFork: false,
    featured: true,
    displayOrder: 3,
    customDescription: 'Enterprise document intelligence platform supporting multi-tenant document collections and hybrid search.',
    projectId: '2',
    project: {
      id: '2',
      title: 'Enterprise RAG Knowledge & Document Platform',
      slug: 'enterprise-rag-platform',
    },
    createdAt: '2024-05-20T00:00:00Z',
    updatedAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
  },
  {
    id: 'gh-3',
    owner: 'mrityunjay45108',
    name: 'scalable-ecommerce-platform',
    fullName: 'mrityunjay45108/scalable-ecommerce-platform',
    description: 'Event-driven e-commerce backend with distributed Saga orchestration, Docker, and Redis caching.',
    url: 'https://github.com/mrityunjay45108/scalable-ecommerce-platform',
    homepage: 'https://ecommerce.demo.mrityunjay.dev',
    language: 'TypeScript',
    stars: 29,
    forks: 5,
    topics: ['microservices', 'docker', 'kubernetes', 'redis', 'postgresql', 'nodejs'],
    category: 'Backend',
    isFork: false,
    featured: true,
    displayOrder: 4,
    customDescription: 'Distributed microservices architecture capable of sustaining 10,000 requests per second.',
    projectId: '3',
    project: {
      id: '3',
      title: 'Scalable Microservices E-Commerce Platform',
      slug: 'microservices-ecommerce',
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
  },
  {
    id: 'gh-4',
    owner: 'mrityunjay45108',
    name: 'distributed-chat-workspace',
    fullName: 'mrityunjay45108/distributed-chat-workspace',
    description: 'Full-featured real-time messaging and collaborative workspace engine with WebSockets and Redis pub/sub.',
    url: 'https://github.com/mrityunjay45108/distributed-chat-workspace',
    homepage: 'https://chat.demo.mrityunjay.dev',
    language: 'TypeScript',
    stars: 22,
    forks: 4,
    topics: ['react', 'websockets', 'redis', 'tailwindcss', 'mongodb'],
    category: 'Full Stack',
    isFork: false,
    featured: true,
    displayOrder: 5,
    customDescription: 'High-throughput real-time collaboration workspace tool.',
    projectId: '4',
    project: {
      id: '4',
      title: 'Real-Time Collaborative Distributed Chat & Workspace',
      slug: 'distributed-chat-workspace',
    },
    createdAt: '2023-11-05T00:00:00Z',
    updatedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
  },
];

export const fallbackGitHubLanguages: GitHubLanguageBreakdown = {
  languages: [
    { name: 'TypeScript', percentage: 46.2, color: '#3178c6', bytes: 64000 },
    { name: 'Python', percentage: 24.5, color: '#3572A5', bytes: 34000 },
    { name: 'JavaScript', percentage: 18.5, color: '#f7df1e', bytes: 25600 },
    { name: 'C++', percentage: 10.8, color: '#f34b7d', bytes: 15000 },
  ],
  totalBytes: 138600,
};

export const fallbackGitHubActivity: GitHubActivity[] = [
  {
    id: 'ev-0',
    type: 'PushEvent',
    repoName: 'mrityunjay45108/ai-english-learning-app',
    repoUrl: 'https://github.com/mrityunjay45108/ai-english-learning-app',
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    description: 'Pushed 4 commits to mrityunjay45108/ai-english-learning-app',
    commits: [
      { message: 'feat: add Seekho English admin video lesson publisher', sha: 'f49a201' },
      { message: 'feat: integrate Emma AI prompt studio and Hindi phrase mappings', sha: 'c81e372' },
    ],
  },
  {
    id: 'ev-1',
    type: 'PushEvent',
    repoName: 'mrityunjay45108/job_portal',
    repoUrl: 'https://github.com/mrityunjay45108/job_portal',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    description: 'Pushed 3 commits to mrityunjay45108/job_portal',
    commits: [
      { message: 'feat: add AI resume builder and ATS score calculation engine', sha: 'e29c841' },
    ],
  },
  {
    id: 'ev-2',
    type: 'CreateEvent',
    repoName: 'mrityunjay45108/enterprise-rag-platform',
    repoUrl: 'https://github.com/mrityunjay45108/enterprise-rag-platform',
    createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    description: 'Created branch feature/hybrid-bm25-vector in mrityunjay45108/enterprise-rag-platform',
  },
  {
    id: 'ev-3',
    type: 'PushEvent',
    repoName: 'mrityunjay45108/microservices-ecommerce',
    repoUrl: 'https://github.com/mrityunjay45108/microservices-ecommerce',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    description: 'Pushed 2 commits to mrityunjay45108/microservices-ecommerce',
    commits: [
      { message: 'perf: implement atomic Redis Lua scripts for inventory decrements', sha: '7b28a90' },
    ],
  },
  {
    id: 'ev-4',
    type: 'ReleaseEvent',
    repoName: 'mrityunjay45108/distributed-chat-workspace',
    repoUrl: 'https://github.com/mrityunjay45108/distributed-chat-workspace',
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    description: 'Released version v2.1.0 for mrityunjay45108/distributed-chat-workspace',
  },
];

export const fallbackGitHubContributions: GitHubContributionData = (() => {
  const weeks: { days: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] }[] = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 52 * 7);

  let totalContributions = 0;

  for (let w = 0; w < 52; w++) {
    const days: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] = [];
    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (w * 7 + d));
      const dateStr = currentDate.toISOString().split('T')[0];

      const dayOfWeek = currentDate.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const seed = (w * 7 + d + currentDate.getMonth() * 31) % 17;

      let count = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;

      if (seed > 13) {
        count = 7 + (seed % 6);
        level = 4;
      } else if (seed > 9) {
        count = 4 + (seed % 4);
        level = 3;
      } else if (seed > 5 || !isWeekend) {
        count = 2 + (seed % 3);
        level = 2;
      } else if (seed > 2) {
        count = 1;
        level = 1;
      }

      totalContributions += count;
      days.push({ date: dateStr, count, level });
    }
    weeks.push({ days });
  }

  return {
    totalContributions: Math.max(totalContributions, 678),
    currentStreak: 21,
    longestStreak: 45,
    weeks,
  };
})();
