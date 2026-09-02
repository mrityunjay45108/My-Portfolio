import { z } from 'zod';

// Auth Validators
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Project Validators
export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens'),
  shortDescription: z.string().min(1, 'Short description is required').max(500),
  description: z.string().min(1, 'Description is required'),
  category: z.string().default('Full Stack'),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Invalid Live Demo URL').optional().or(z.literal('')),
  architectureImage: z.string().optional().or(z.literal('')),
  architectureDescription: z.string().optional().or(z.literal('')),
  videoUrl: z.string().optional().or(z.literal('')),
  order: z.number().int().default(0),
  technologies: z.array(z.string()).optional(), // Array of technology IDs or names
  features: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  })).optional(),
  images: z.array(z.object({
    id: z.string().optional(),
    url: z.string().min(1),
    altText: z.string().nullable().optional(),
    order: z.number().int().optional(),
  })).optional(),
});

export const projectImageSchema = z.object({
  url: z.string().min(1, 'Image URL is required'),
  altText: z.string().optional(),
  order: z.number().int().default(0),
});

export const imageReorderSchema = z.object({
  images: z.array(z.object({
    id: z.string(),
    order: z.number().int(),
  })),
});

// Blog Validators
export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(250),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500),
  content: z.string().min(1, 'Content is required'),
  featuredImage: z.string().optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PREVIEW', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  categoryId: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(), // tag names or IDs
  readingTime: z.number().int().positive().default(5),
});

export const blogCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens'),
  description: z.string().optional().or(z.literal('')),
});

// Case Study Validators
export const caseStudySchema = z.object({
  title: z.string().min(1, 'Title is required').max(250),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens'),
  summary: z.string().min(1, 'Summary is required'),
  problem: z.string().min(1, 'Problem description is required'),
  background: z.string().optional().or(z.literal('')),
  goals: z.string().optional().or(z.literal('')),
  architecture: z.string().optional().or(z.literal('')),
  architectureImage: z.string().optional().or(z.literal('')),
  implementation: z.string().optional().or(z.literal('')),
  challenges: z.string().optional().or(z.literal('')),
  solutions: z.string().optional().or(z.literal('')),
  security: z.string().optional().or(z.literal('')),
  performance: z.string().optional().or(z.literal('')),
  results: z.string().optional().or(z.literal('')),
  lessonsLearned: z.string().optional().or(z.literal('')),
  videoUrl: z.string().optional().or(z.literal('')),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Invalid Live Demo URL').optional().or(z.literal('')),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PREVIEW', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  technologies: z.array(z.string()).optional(),
  sections: z.array(z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    order: z.number().int().default(0),
  })).optional(),
});

// Technology Validators
export const technologySchema = z.object({
  name: z.string().min(1, 'Technology name is required').max(100),
  icon: z.string().optional().or(z.literal('')),
  category: z.string().default('General'),
});

// Contact Message Validators
export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().max(200).optional().or(z.literal('')),
  message: z.string().min(5, 'Message must be at least 5 characters').max(5000),
});

// Analytics Track Validator
export const analyticsSchema = z.object({
  path: z.string().min(1),
  type: z.enum(['PAGE_VIEW', 'GITHUB_CLICK', 'LIVE_DEMO_CLICK', 'RESUME_DOWNLOAD', 'PROJECT_VIEW', 'BLOG_VIEW', 'CASE_STUDY_VIEW']).default('PAGE_VIEW'),
  resourceId: z.string().optional(),
  referrer: z.string().optional(),
});
