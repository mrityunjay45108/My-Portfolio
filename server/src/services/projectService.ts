import prisma from '../database/prisma.js';

export interface ProjectCreateInput {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category?: string;
  featured?: boolean;
  published?: boolean;
  githubUrl?: string;
  githubOwner?: string;
  githubRepository?: string;
  liveUrl?: string;
  architectureImage?: string;
  architectureDescription?: string;
  videoUrl?: string;
  order?: number;
  technologies?: string[]; // Array of tech names or IDs
  features?: { title: string; description: string }[];
  images?: { id?: string; url: string; altText?: string; order?: number }[];
}

export class ProjectService {
  static async getAllProjects(params?: {
    publishedOnly?: boolean;
    featuredOnly?: boolean;
    category?: string;
    search?: string;
  }) {
    const where: any = {};

    if (params?.publishedOnly) {
      where.published = true;
    }

    if (params?.featuredOnly) {
      where.featured = true;
    }

    if (params?.category && params.category !== 'All') {
      where.category = params.category;
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { shortDescription: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    try {
      return await prisma.project.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          features: {
            orderBy: { order: 'asc' },
          },
          technologies: {
            include: {
              technology: true,
            },
          },
        },
      });
    } catch (err) {
      console.warn('Database query failed in ProjectService.getAllProjects, using fallback data:', err);
      return this.getFallbackProjects(params);
    }
  }

  static async getFeaturedProjects() {
    try {
      return await prisma.project.findMany({
        where: {
          published: true,
          featured: true,
        },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        include: {
          images: { orderBy: { order: 'asc' } },
          features: { orderBy: { order: 'asc' } },
          technologies: { include: { technology: true } },
        },
      });
    } catch (err) {
      console.warn('Database query failed in ProjectService.getFeaturedProjects, using fallback data:', err);
      return this.getFallbackProjects({ publishedOnly: true, featuredOnly: true });
    }
  }

  static async getProjectBySlugOrId(identifier: string, incrementView = false) {
    try {
      const project = await prisma.project.findFirst({
        where: {
          OR: [{ id: identifier }, { slug: identifier }],
        },
        include: {
          images: { orderBy: { order: 'asc' } },
          features: { orderBy: { order: 'asc' } },
          technologies: { include: { technology: true } },
        },
      });

      if (project && incrementView) {
        prisma.project
          .update({
            where: { id: project.id },
            data: { viewCount: { increment: 1 } },
          })
          .catch(() => {});
      }

      if (project) return project;
      return this.getFallbackProject(identifier);
    } catch (err) {
      console.warn('Database query failed in ProjectService.getProjectBySlugOrId, using fallback data:', err);
      return this.getFallbackProject(identifier);
    }
  }

  static async createProject(data: ProjectCreateInput) {
    const { technologies = [], features = [], images = [], ...projectData } = data;

    // Create the project
    const project = await prisma.project.create({
      data: {
        ...projectData,
        features: {
          create: features.map((f, idx) => ({
            title: f.title,
            description: f.description,
            order: idx,
          })),
        },
        images: {
          create: images.map((img, idx) => ({
            url: img.url,
            altText: img.altText || null,
            order: img.order !== undefined ? img.order : idx,
          })),
        },
      },
    });

    // Attach technologies
    if (technologies.length > 0) {
      for (const techInput of technologies) {
        let tech = await prisma.technology.findFirst({
          where: {
            OR: [{ id: techInput }, { name: { equals: techInput, mode: 'insensitive' } }],
          },
        });

        if (!tech) {
          tech = await prisma.technology.create({
            data: {
              name: techInput,
              category: 'General',
            },
          });
        }

        await prisma.projectTechnology.create({
          data: {
            projectId: project.id,
            technologyId: tech.id,
          },
        });
      }
    }

    return this.getProjectBySlugOrId(project.id);
  }

  static async updateProject(id: string, data: Partial<ProjectCreateInput>) {
    const { technologies, features, images, ...projectData } = data;

    // Update basic fields
    await prisma.project.update({
      where: { id },
      data: projectData,
    });

    // Update features if provided
    if (features !== undefined) {
      await prisma.projectFeature.deleteMany({ where: { projectId: id } });
      if (features.length > 0) {
        await prisma.projectFeature.createMany({
          data: features.map((f, idx) => ({
            projectId: id,
            title: f.title,
            description: f.description,
            order: idx,
          })),
        });
      }
    }

    // Update images if provided
    if (images !== undefined) {
      await prisma.projectImage.deleteMany({ where: { projectId: id } });
      if (images.length > 0) {
        await prisma.projectImage.createMany({
          data: images.map((img, idx) => ({
            projectId: id,
            url: img.url,
            altText: img.altText || null,
            order: img.order !== undefined ? img.order : idx,
          })),
        });
      }
    }

    // Update technologies if provided
    if (technologies !== undefined) {
      await prisma.projectTechnology.deleteMany({ where: { projectId: id } });

      for (const techInput of technologies) {
        let tech = await prisma.technology.findFirst({
          where: {
            OR: [{ id: techInput }, { name: { equals: techInput, mode: 'insensitive' } }],
          },
        });

        if (!tech) {
          tech = await prisma.technology.create({
            data: { name: techInput, category: 'General' },
          });
        }

        await prisma.projectTechnology.create({
          data: {
            projectId: id,
            technologyId: tech.id,
          },
        });
      }
    }

    return this.getProjectBySlugOrId(id);
  }

  static async deleteProject(idOrSlug: string) {
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!project) {
      return null;
    }

    await prisma.projectTechnology.deleteMany({ where: { projectId: project.id } });
    await prisma.projectFeature.deleteMany({ where: { projectId: project.id } });
    await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
    await prisma.gitHubRepository.updateMany({
      where: { projectId: project.id },
      data: { projectId: null },
    });

    return prisma.project.delete({
      where: { id: project.id },
    });
  }

  static async addImage(projectId: string, url: string, altText?: string, order = 0) {
    return prisma.projectImage.create({
      data: {
        projectId,
        url,
        altText,
        order,
      },
    });
  }

  static async deleteImage(imageId: string) {
    return prisma.projectImage.delete({
      where: { id: imageId },
    });
  }

  static async reorderImages(images: { id: string; order: number }[]) {
    return prisma.$transaction(
      images.map((img) =>
        prisma.projectImage.update({
          where: { id: img.id },
          data: { order: img.order },
        })
      )
    );
  }

  static async reorderProjects(projects: { id: string; order: number }[]) {
    return prisma.$transaction(
      projects.map((p) =>
        prisma.project.update({
          where: { id: p.id },
          data: { order: p.order },
        })
      )
    );
  }

  private static getFallbackProjects(params?: {
    publishedOnly?: boolean;
    featuredOnly?: boolean;
    category?: string;
    search?: string;
  }) {
    let list = [...FALLBACK_PROJECTS];

    if (params?.publishedOnly) {
      list = list.filter((p) => p.published);
    }
    if (params?.featuredOnly) {
      list = list.filter((p) => p.featured);
    }
    if (params?.category && params.category !== 'All') {
      list = list.filter((p) => p.category === params.category);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  private static getFallbackProject(identifier: string) {
    const p = FALLBACK_PROJECTS.find((item) => item.id === identifier || item.slug === identifier);
    return p || null;
  }
}

const FALLBACK_PROJECTS: any[] = [
  {
    id: '668a4609-e8e4-485f-a50e-3bec015e3584',
    title: 'JobSeekers — AI-Powered Job Search & Recruitment Portal',
    slug: 'job-portal',
    shortDescription: 'Full-stack job search and recruitment management platform featuring AI resume builder, 95% ATS compatibility analyzer, dynamic multi-filter job search, and role-based Super Admin/Recruiter control panels.',
    description: 'JobSeekers is a modern recruitment and career acceleration platform connecting high-growth startups with elite candidates. Built with React, TypeScript, Node.js, and Express, it empowers job seekers with an AI-assisted resume builder and automated ATS scoring, while offering recruiters and administrators a centralized cockpit to post jobs, track applicants, and orchestrate interviews.',
    category: 'Full Stack',
    featured: true,
    published: true,
    order: 1,
    githubUrl: 'https://github.com/mrityunjay45108/job_portal',
    liveUrl: 'https://job-portal-psi-henna-74.vercel.app/',
    architectureImage: '/images/projects/jobseekers/jobseekers-architecture-diagram.svg',
    architectureDescription: 'Modern decoupled architecture featuring a responsive React/TypeScript frontend deployed on Vercel, Node.js/Express REST APIs, database models with indexing on search parameters, JWT authentication with role authorization, and ATS scoring algorithm.',
    viewCount: 1540,
    createdAt: new Date('2023-11-05T00:00:00Z'),
    updatedAt: new Date('2024-10-30T00:00:00Z'),
    technologies: [
      { technology: { id: 't1', name: 'React', category: 'Frontend', icon: 'Atom' } },
      { technology: { id: 't2', name: 'TypeScript', category: 'Languages', icon: 'Code' } },
      { technology: { id: 't3', name: 'Node.js', category: 'Backend', icon: 'Server' } },
      { technology: { id: 't13', name: 'Express.js', category: 'Backend', icon: 'Cpu' } },
      { technology: { id: 't4', name: 'PostgreSQL', category: 'Databases', icon: 'Database' } },
      { technology: { id: 't15', name: 'MongoDB', category: 'Databases', icon: 'HardDrive' } },
      { technology: { id: 't8', name: 'Tailwind CSS', category: 'Frontend', icon: 'Palette' } },
    ],
    features: [
      { id: 'f1', order: 1, title: 'AI Resume Builder & ATS Score Checker', description: 'Real-time 95% ATS compatibility analysis and intelligent suggestions tailored to target job specifications.' },
      { id: 'f2', order: 2, title: 'Dynamic Multi-Filter Job Search', description: 'Instant search by job title, required tech stack, work mode (Remote/On-site), location, and experience tier.' },
      { id: 'f3', order: 3, title: 'Super Admin & Recruiter Control Panel', description: 'Comprehensive dashboard managing candidates, recruiters, job postings, application lifecycles, and interview schedules.' },
    ],
    images: [
      { id: 'img-1', order: 1, url: '/images/projects/jobseekers/landing.png', altText: 'JobSeekers Landing Page' },
      { id: 'img-2', order: 2, url: '/images/projects/jobseekers/jobs-grid.png', altText: 'JobSeekers Interactive Job Search Board' },
      { id: 'img-3', order: 3, url: '/images/projects/jobseekers/admin-dashboard.png', altText: 'JobSeekers Admin Dashboard' },
    ],
  },
  {
    id: '9f775301-4ae0-4111-a6e1-f6e49420eabd',
    title: 'AI Interview Copilot & Seekho English Learning App',
    slug: 'ai-interview-copilot',
    shortDescription: 'AI-powered mock interview and real-time candidate assessment platform with automated question synthesis, speech evaluation, and comprehensive performance analytics.',
    description: 'An intelligent AI-driven English learning & interview preparation platform designed to simulate realistic technical and behavioral interviews. Leverages retrieval-augmented generation (RAG), Emma AI prompt studio, and low-latency LLM evaluation pipelines to deliver actionable feedback.',
    category: 'AI / GenAI',
    featured: true,
    published: true,
    order: 2,
    githubUrl: 'https://github.com/mrityunjay45108/ai-english-learning-app',
    liveUrl: 'https://interview-copilot.demo.mrityunjay.dev',
    architectureImage: '/images/projects/ai-interview-copilot/ai-copilot-architecture-diagram.svg',
    architectureDescription: 'High-throughput asynchronous architecture featuring Next.js/React frontend, Node.js/Express API orchestration, vector search indexing via PostgreSQL/pgvector, OpenAI Whisper voice transcription, and WebSocket audio streaming.',
    videoUrl: 'https://res.cloudinary.com/dpd6q8ex4/video/upload/v1788341518/ai_inter_video_xz7fya.mp4',
    viewCount: 1240,
    createdAt: new Date('2024-03-10T00:00:00Z'),
    updatedAt: new Date('2024-11-15T00:00:00Z'),
    technologies: [
      { technology: { id: 't1', name: 'React', category: 'Frontend', icon: 'Atom' } },
      { technology: { id: 't2', name: 'TypeScript', category: 'Languages', icon: 'Code' } },
      { technology: { id: 't3', name: 'Node.js', category: 'Backend', icon: 'Server' } },
      { technology: { id: 't4', name: 'PostgreSQL', category: 'Databases', icon: 'Database' } },
      { technology: { id: 't6', name: 'RAG', category: 'AI & GenAI', icon: 'Sparkles' } },
    ],
    features: [
      { id: 'f4', order: 1, title: 'Seekho English & Emma AI Prompt Studio', description: 'Centralized admin control center for publishing video modules, spoken phrases, and translations.' },
      { id: 'f5', order: 2, title: 'Dynamic Question Engine', description: 'Contextual interview prompt generation tailored to candidate resume, role, and experience level.' },
    ],
    images: [
      { id: 'img-4', order: 1, url: '/images/projects/ai-interview-copilot/seekho-english-dashboard.png', altText: 'Seekho English Admin Control Center' },
    ],
  },
  {
    id: '2c65d902-3a85-46d6-8250-b006085b0692',
    title: 'Enterprise RAG Knowledge & Document Platform',
    slug: 'enterprise-rag-platform',
    shortDescription: 'Enterprise-grade Retrieval-Augmented Generation system allowing semantic document exploration, citation tracking, and hybrid keyword-vector retrieval over huge document corpuses.',
    description: 'Built for enterprise knowledge workers, this platform ingests complex PDFs, API documentation, and Markdown files, performs hierarchical chunking, vector embedding, and hybrid search to generate factual responses with exact citations.',
    category: 'AI / GenAI',
    featured: true,
    published: true,
    order: 3,
    githubUrl: 'https://github.com/mrityunjay45108/enterprise-rag-platform',
    liveUrl: 'https://rag-platform.demo.mrityunjay.dev',
    architectureImage: '/images/projects/rag-platform/enterprise-rag-dashboard.svg',
    architectureDescription: 'Modular ingestion pipeline using LangChain, FastEmbed, PostgreSQL with pgvector, and Redis caching.',
    viewCount: 890,
    createdAt: new Date('2024-01-15T00:00:00Z'),
    updatedAt: new Date('2024-11-20T00:00:00Z'),
    technologies: [
      { technology: { id: 't9', name: 'Python', category: 'Languages', icon: 'Terminal' } },
      { technology: { id: 't3', name: 'Node.js', category: 'Backend', icon: 'Server' } },
      { technology: { id: 't4', name: 'PostgreSQL', category: 'Databases', icon: 'Database' } },
      { technology: { id: 't10', name: 'Redis', category: 'DevOps & Cloud', icon: 'Flame' } },
    ],
    features: [
      { id: 'f6', order: 1, title: 'Hybrid Retrieval Engine', description: 'Combines dense embeddings and BM25 sparse lexical search for 98% factual precision.' },
      { id: 'f7', order: 2, title: 'Citation Verification', description: 'Every generated claim links directly to the highlighted source paragraph in the original document.' },
    ],
    images: [
      { id: 'img-5', order: 1, url: '/images/projects/rag-platform/enterprise-rag-dashboard.svg', altText: 'Enterprise RAG Studio' },
    ],
  },
  {
    id: '7dc7022a-2ab8-401c-9f9a-3f27d650939f',
    title: 'Scalable Microservices E-Commerce Platform',
    slug: 'microservices-ecommerce',
    shortDescription: 'High-concurrency e-commerce backend and frontend ecosystem utilizing event-driven microservices, distributed transaction saga patterns, and Redis caching.',
    description: 'A cloud-native e-commerce infrastructure engineered for peak load events. Segregated services for Auth, Catalog, Cart, Order, Payment, and Notification communicating asynchronously via RabbitMQ and gRPC.',
    category: 'Backend',
    featured: true,
    published: true,
    order: 4,
    githubUrl: 'https://github.com/mrityunjay45108/scalable-ecommerce-platform',
    liveUrl: 'https://ecommerce.demo.mrityunjay.dev',
    architectureImage: '/images/projects/ecommerce/ecommerce-architecture-diagram.svg',
    architectureDescription: 'Kubernetes-orchestrated microservices cluster with Kong API Gateway, Dockerized container instances, and PostgreSQL sharded databases.',
    viewCount: 1050,
    createdAt: new Date('2023-08-14T00:00:00Z'),
    updatedAt: new Date('2024-09-12T00:00:00Z'),
    technologies: [
      { technology: { id: 't3', name: 'Node.js', category: 'Backend', icon: 'Server' } },
      { technology: { id: 't13', name: 'Express.js', category: 'Backend', icon: 'Cpu' } },
      { technology: { id: 't12', name: 'Docker', category: 'DevOps & Cloud', icon: 'Container' } },
      { technology: { id: 't4', name: 'PostgreSQL', category: 'Databases', icon: 'Database' } },
    ],
    features: [
      { id: 'f8', order: 1, title: 'Event-Driven Order Processing', description: 'Saga orchestrator coordinating inventory reservation, payment authorization, and fulfillment.' },
      { id: 'f9', order: 2, title: 'Sub-10ms Product Catalog Search', description: 'Multi-level Redis cache invalidation and database read-replicas.' },
    ],
    images: [
      { id: 'img-6', order: 1, url: '/images/projects/ecommerce/ecommerce-storefront.svg', altText: 'E-commerce storefront' },
    ],
  },
];
