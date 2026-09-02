export type ContentStatus = 'DRAFT' | 'PREVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface Technology {
  id: string;
  name: string;
  icon?: string | null;
  category: string;
  createdAt?: string;
}

export interface ProjectImage {
  id: string;
  projectId?: string;
  url: string;
  altText?: string | null;
  order: number;
}

export interface ProjectFeature {
  id?: string;
  projectId?: string;
  title: string;
  description: string;
  order?: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  featured: boolean;
  published: boolean;
  githubUrl?: string | null;
  githubOwner?: string | null;
  githubRepository?: string | null;
  liveUrl?: string | null;
  architectureImage?: string | null;
  architectureDescription?: string | null;
  videoUrl?: string | null;
  order: number;
  viewCount?: number;
  createdAt?: string;
  updatedAt?: string;
  images?: ProjectImage[];
  features?: ProjectFeature[];
  technologies?: {
    technology: Technology;
  }[] | string[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: {
    posts: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: {
    posts: number;
  };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string | null;
  authorId?: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  status: ContentStatus;
  categoryId?: string | null;
  category?: BlogCategory | null;
  readingTime: number;
  viewCount: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: {
    tag: Tag;
  }[];
  prevPost?: { id: string; title: string; slug: string; featuredImage?: string } | null;
  nextPost?: { id: string; title: string; slug: string; featuredImage?: string } | null;
  relatedPosts?: BlogPost[];
}

export interface CaseStudyImage {
  id: string;
  caseStudyId?: string;
  url: string;
  caption?: string | null;
  order: number;
}

export interface CaseStudySection {
  id?: string;
  caseStudyId?: string;
  title: string;
  content: string;
  order: number;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  problem: string;
  background?: string | null;
  goals?: string | null;
  architecture?: string | null;
  architectureImage?: string | null;
  implementation?: string | null;
  challenges?: string | null;
  solutions?: string | null;
  security?: string | null;
  performance?: string | null;
  results?: string | null;
  lessonsLearned?: string | null;
  videoUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  featured: boolean;
  status: ContentStatus;
  order: number;
  viewCount: number;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  images?: CaseStudyImage[];
  technologies?: {
    technology: Technology;
  }[];
  sections?: CaseStudySection[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  createdAt?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  duration: string;
  type: string;
  description: string[];
  technologies: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  university?: string;
  duration: string;
  location: string;
  grade?: string;
  highlights: string[];
}

export interface AchievementItem {
  id: string;
  title: string;
  organization?: string;
  date?: string;
  description: string;
  icon: string;
  badge: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
  location: string;
  stats: {
    label: string;
    value: string;
    sublabel: string;
  }[];
}

// GitHub Integration Types
export interface GitHubProfile {
  username: string;
  name: string;
  avatarUrl: string;
  bio: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  htmlUrl: string;
  company: string | null;
  location: string | null;
  blog: string | null;
  twitterUsername: string | null;
  createdAt: string;
}

export interface GitHubRepo {
  id: string;
  owner: string;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  category: 'All' | 'Frontend' | 'Backend' | 'Full Stack' | 'AI' | 'DevOps' | 'Other';
  isFork: boolean;
  featured: boolean;
  displayOrder: number;
  customDescription: string | null;
  projectId: string | null;
  project?: {
    id: string;
    title: string;
    slug: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface GitHubActivity {
  id: string;
  type: string;
  repoName: string;
  repoUrl: string;
  createdAt: string;
  description: string;
  commits?: { message: string; sha: string }[];
}

export interface GitHubLanguageBreakdown {
  languages: { name: string; percentage: number; color: string; bytes: number }[];
  totalBytes: number;
}

export interface GitHubContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface GitHubContributionData {
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  weeks: {
    days: GitHubContributionDay[];
  }[];
}
