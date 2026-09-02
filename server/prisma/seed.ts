import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed for Mrityunjay Kumar Portfolio...');

  // 1. Seed Admin User
  const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@mrityunjay.dev';
  const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'AdminSecurePassword123!';
  const adminName = process.env.INITIAL_ADMIN_NAME || 'Mrityunjay Kumar';

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail.toLowerCase() },
    update: { passwordHash },
    create: {
      name: adminName,
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin user seeded: ${admin.email} (${admin.name})`);

  // 2. Seed Technologies
  const techData = [
    // Languages
    { name: 'C', category: 'Languages', icon: 'FileCode' },
    { name: 'C++', category: 'Languages', icon: 'Code2' },
    { name: 'Python', category: 'Languages', icon: 'Terminal' },
    { name: 'JavaScript', category: 'Languages', icon: 'FileJson' },
    { name: 'TypeScript', category: 'Languages', icon: 'Code' },

    // Frontend
    { name: 'React', category: 'Frontend', icon: 'Atom' },
    { name: 'Next.js', category: 'Frontend', icon: 'Layers' },
    { name: 'Tailwind CSS', category: 'Frontend', icon: 'Palette' },
    { name: 'Vite', category: 'Frontend', icon: 'Zap' },
    { name: 'Shadcn UI', category: 'Frontend', icon: 'Layout' },
    { name: 'Mantine UI', category: 'Frontend', icon: 'Box' },

    // Backend
    { name: 'Node.js', category: 'Backend', icon: 'Server' },
    { name: 'Express.js', category: 'Backend', icon: 'Cpu' },
    { name: 'NestJS', category: 'Backend', icon: 'Network' },

    // Databases
    { name: 'PostgreSQL', category: 'Databases', icon: 'Database' },
    { name: 'MongoDB', category: 'Databases', icon: 'HardDrive' },
    { name: 'MySQL', category: 'Databases', icon: 'Database' },
    { name: 'Neon', category: 'Databases', icon: 'CloudLightning' },
    { name: 'Prisma', category: 'Databases', icon: 'Boxes' },

    // DevOps / Cloud
    { name: 'Docker', category: 'DevOps & Cloud', icon: 'Container' },
    { name: 'Kubernetes', category: 'DevOps & Cloud', icon: 'Anchor' },
    { name: 'AWS', category: 'DevOps & Cloud', icon: 'Cloud' },
    { name: 'GCP', category: 'DevOps & Cloud', icon: 'CloudSun' },
    { name: 'Azure', category: 'DevOps & Cloud', icon: 'CloudFog' },
    { name: 'Redis', category: 'DevOps & Cloud', icon: 'Flame' },

    // AI / GenAI
    { name: 'LLM', category: 'AI & GenAI', icon: 'Brain' },
    { name: 'RAG', category: 'AI & GenAI', icon: 'Sparkles' },
    { name: 'Generative AI', category: 'AI & GenAI', icon: 'Bot' },
    { name: 'AI Agents', category: 'AI & GenAI', icon: 'Wand2' },
    { name: 'Prompt Engineering', category: 'AI & GenAI', icon: 'MessageSquareCode' },
    { name: 'AI APIs', category: 'AI & GenAI', icon: 'Radio' },
  ];

  const techMap = new Map<string, string>();
  for (const t of techData) {
    const tech = await prisma.technology.upsert({
      where: { name: t.name },
      update: { category: t.category, icon: t.icon },
      create: { name: t.name, category: t.category, icon: t.icon },
    });
    techMap.set(t.name, tech.id);
  }
  console.log(`✅ Seeded ${techData.length} technologies`);

  // 3. Seed Blog Categories
  const categories = [
    { name: 'AI & Generative AI', slug: 'ai-generative-ai', description: 'Deep dives into LLMs, RAG pipelines, autonomous agents and AI APIs.' },
    { name: 'Full Stack Development', slug: 'full-stack-dev', description: 'End-to-end web development with React, TypeScript, and modern tooling.' },
    { name: 'Backend & Architecture', slug: 'backend-architecture', description: 'Building resilient backend APIs, microservices, and database systems.' },
    { name: 'System Design & DevOps', slug: 'system-design-devops', description: 'Scaling distributed systems, Docker containers, caching, and cloud deployments.' },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const c = await prisma.blogCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: { name: cat.name, slug: cat.slug, description: cat.description },
    });
    categoryMap.set(cat.slug, c.id);
  }

  // 4. Seed Tags
  const tagList = ['AI', 'RAG', 'LLM', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Next.js', 'TypeScript', 'Prisma', 'Redis', 'Microservices', 'MongoDB'];
  const tagMap = new Map<string, string>();
  for (const t of tagList) {
    const slug = t.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const tag = await prisma.tag.upsert({
      where: { name: t },
      update: { slug },
      create: { name: t, slug },
    });
    tagMap.set(t, tag.id);
  }

  // 5. Seed Projects
  const projectsData = [
    {
      title: 'JobSeekers — AI-Powered Job Search & Recruitment Portal',
      slug: 'job-portal',
      shortDescription: 'Full-stack job search and recruitment management platform featuring AI resume builder, 95% ATS compatibility analyzer, dynamic multi-filter job search, and role-based Super Admin/Recruiter control panels.',
      description: 'JobSeekers is a modern recruitment and career acceleration platform connecting high-growth startups with elite candidates. Built with React, TypeScript, Node.js, and Express, it empowers job seekers with an AI-assisted resume builder and automated ATS scoring, while offering recruiters and administrators a centralized cockpit to post jobs, track applicants, and orchestrate interviews.',
      category: 'Full Stack',
      featured: true,
      published: true,
      order: 1,
      githubUrl: 'https://github.com/mrityunjay45108/job_portal',
      githubOwner: 'mrityunjay45108',
      githubRepository: 'job_portal',
      liveUrl: 'https://job-portal-psi-henna-74.vercel.app/',
      architectureImage: '/images/projects/jobseekers/jobseekers-architecture-diagram.svg',
      architectureDescription: 'Modern decoupled architecture featuring a responsive React/TypeScript frontend deployed on Vercel, Node.js/Express REST APIs, database models with indexing on search parameters, JWT authentication with role authorization (Admin/Recruiter/Candidate), and ATS scoring algorithm.',
      videoUrl: '',
      technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'Tailwind CSS'],
      features: [
        { title: 'AI Resume Builder & ATS Score Checker', description: 'Real-time 95% ATS compatibility analysis and intelligent suggestions tailored to target job specifications.' },
        { title: 'Dynamic Multi-Filter Job Search', description: 'Instant search by job title, required tech stack, work mode (Remote/On-site), location, and experience tier.' },
        { title: 'Super Admin & Recruiter Control Panel', description: 'Comprehensive dashboard managing candidates, recruiters, job postings, application lifecycles, and interview schedules.' },
        { title: 'Multi-Role Authentication & Security', description: 'Secure JWT role-based access control protecting Candidate, Recruiter, and Admin portals.' }
      ],
      images: [
        { url: '/images/projects/jobseekers/landing.png', altText: 'JobSeekers Landing Page with AI Resume Builder and ATS Score Checker', order: 1 },
        { url: '/images/projects/jobseekers/jobs-grid.png', altText: 'JobSeekers Interactive Job Search & Multi-Filter Board', order: 2 },
        { url: '/images/projects/jobseekers/admin-dashboard.png', altText: 'JobSeekers Admin Control Panel & Application Management Dashboard', order: 3 },
      ]
    },
    {
      title: 'AI Interview Copilot & Seekho English Learning App',
      slug: 'ai-interview-copilot',
      shortDescription: 'AI-powered mock interview and real-time candidate assessment platform with automated question synthesis, speech evaluation, and comprehensive performance analytics.',
      description: 'An intelligent AI-driven English learning & interview preparation platform designed to simulate realistic technical and behavioral interviews. Leverages retrieval-augmented generation (RAG), Emma AI prompt studio, and low-latency LLM evaluation pipelines to deliver actionable, contextual feedback to job seekers and learners.',
      category: 'AI / GenAI',
      featured: true,
      published: true,
      order: 2,
      githubUrl: 'https://github.com/mrityunjay45108/ai-english-learning-app',
      githubOwner: 'mrityunjay45108',
      githubRepository: 'ai-english-learning-app',
      liveUrl: 'https://interview-copilot.demo.mrityunjay.dev',
      architectureImage: '/images/projects/ai-interview-copilot/ai-copilot-architecture-diagram.svg',
      architectureDescription: 'High-throughput asynchronous architecture featuring Next.js frontend, Node.js/Express API orchestration, vector search indexing via PostgreSQL/pgvector, OpenAI Whisper ASR audio processing, and WebSocket streaming.',
      videoUrl: 'https://res.cloudinary.com/dpd6q8ex4/video/upload/v1788341518/ai_inter_video_xz7fya.mp4',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'RAG', 'LLM', 'Tailwind CSS'],
      features: [
        { title: 'Seekho English & Emma AI Prompt Studio', description: 'Centralized admin control center for publishing video modules, spoken phrases, and Hindi-English translations.' },
        { title: 'Dynamic Question Engine', description: 'Contextual interview prompt generation tailored to candidate resume, role, and experience level.' },
        { title: 'Real-Time Voice Analysis', description: 'Sub-second speech recognition and conversational response evaluation.' },
        { title: 'Multimodal Scorecard', description: 'Automated rubrics evaluating technical depth, communication clarity, problem-solving, and time efficiency.' },
        { title: 'Vectorized Topic Search', description: 'Retrieves relevant company-specific interview question patterns from a dense knowledge base.' }
      ],
      images: [
        { url: '/images/projects/ai-interview-copilot/seekho-english-dashboard.png', altText: 'Seekho English Admin Control Center & Emma AI Prompt Studio', order: 1 },
        { url: '/projects/ai-interview-copilot/screenshot-1.webp', altText: 'Interview session dashboard with real-time feedback indicator', order: 2 },
        { url: '/projects/ai-interview-copilot/screenshot-2.webp', altText: 'Detailed analytics scorecard and skill breakdown', order: 3 },
      ]
    },
    {
      title: 'Enterprise RAG Knowledge & Document Platform',
      slug: 'enterprise-rag-platform',
      shortDescription: 'Enterprise-grade Retrieval-Augmented Generation system allowing semantic document exploration, citation tracking, and hybrid keyword-vector retrieval over huge document corpuses.',
      description: 'Built for enterprise knowledge workers, this platform ingests complex PDFs, API documentation, and Markdown files, performs hierarchical chunking, vector embedding, and hybrid search (BM25 + Dense Vectors) to generate hallucinations-free responses with exact citations.',
      category: 'AI / GenAI',
      featured: true,
      published: true,
      order: 3,
      githubUrl: 'https://github.com/mrityunjay45108/enterprise-rag-platform',
      githubOwner: 'mrityunjay45108',
      githubRepository: 'enterprise-rag-platform',
      liveUrl: 'https://rag-platform.demo.mrityunjay.dev',
      architectureImage: '/images/projects/rag-platform/enterprise-rag-dashboard.svg',
      architectureDescription: 'Modular ingestion pipeline using LangChain, FastEmbed, PostgreSQL with pgvector, and Redis caching for recurrent query embedding lookups.',
      videoUrl: '',
      technologies: ['Python', 'Node.js', 'PostgreSQL', 'Redis', 'RAG', 'AI Agents', 'Docker', 'React'],
      features: [
        { title: 'Hybrid Retrieval Engine', description: 'Combines dense embeddings and BM25 sparse lexical search for 98% factual precision.' },
        { title: 'Citation Verification', description: 'Every generated claim links directly to the highlighted source paragraph in the original document.' },
        { title: 'Multi-Tenant Workspaces', description: 'Role-based access control ensuring enterprise data privacy across departments.' },
        { title: 'Asynchronous Document Ingestion', description: 'Background worker queues processing 100+ page documents with progress tracking.' }
      ],
      images: [
        { url: '/images/projects/rag-platform/enterprise-rag-dashboard.svg', altText: 'Enterprise RAG Studio Semantic Q&A Cockpit and Citation Inspector', order: 1 },
        { url: '/projects/rag-platform/screenshot-2.webp', altText: 'Workspace document manager and ingestion queue', order: 2 }
      ]
    },
    {
      title: 'Scalable Microservices E-Commerce Platform',
      slug: 'microservices-ecommerce',
      shortDescription: 'High-concurrency e-commerce backend and frontend ecosystem utilizing event-driven microservices, distributed transaction saga patterns, and Redis caching.',
      description: 'A cloud-native e-commerce infrastructure engineered for peak load events. Segregated services for Auth, Catalog, Cart, Order, Payment, and Notification communicating asynchronously via RabbitMQ and gRPC with distributed Redis caching.',
      category: 'Backend',
      featured: true,
      published: true,
      order: 4,
      githubUrl: 'https://github.com/mrityunjay45108/scalable-ecommerce-platform',
      githubOwner: 'mrityunjay45108',
      githubRepository: 'scalable-ecommerce-platform',
      liveUrl: 'https://ecommerce.demo.mrityunjay.dev',
      architectureImage: '/projects/ecommerce/architecture.webp',
      architectureDescription: 'Kubernetes-orchestrated microservices cluster with Kong API Gateway, Dockerized container instances, and PostgreSQL sharded databases.',
      videoUrl: '',
      technologies: ['Node.js', 'Express.js', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'React', 'Tailwind CSS'],
      features: [
        { title: 'Event-Driven Order Processing', description: 'Saga orchestrator coordinating inventory reservation, payment authorization, and fulfillment.' },
        { title: 'Sub-10ms Product Catalog Search', description: 'Multi-level Redis cache invalidation and database read-replicas.' },
        { title: 'Resilient Stripe Checkout', description: 'Idempotency key enforcement and robust webhook processing.' },
        { title: 'Admin Analytics Dashboard', description: 'Real-time sales telemetry, inventory threshold alerts, and revenue metrics.' }
      ],
      images: [
        { url: '/projects/ecommerce/screenshot-1.webp', altText: 'Product storefront with instant faceted search and filter', order: 1 },
        { url: '/projects/ecommerce/screenshot-2.webp', altText: 'Checkout workflow and order status tracker', order: 2 }
      ]
    },
    {
      title: 'Real-Time Collaborative Distributed Chat & Workspace',
      slug: 'distributed-chat-workspace',
      shortDescription: 'Full-featured real-time messaging, channel collaboration, and interactive workspace with WebSockets, WebRTC audio rooms, and end-to-end state sync.',
      description: 'A high-performance workspace tool offering instant team messaging, rich text formatting, file attachments, typing indicators, and presence tracking engineered on top of Socket.IO and Redis Pub/Sub clusters.',
      category: 'Full Stack',
      featured: false,
      published: true,
      order: 5,
      githubUrl: 'https://github.com/mrityunjay45108/distributed-chat-workspace',
      githubOwner: 'mrityunjay45108',
      githubRepository: 'distributed-chat-workspace',
      liveUrl: 'https://chat.demo.mrityunjay.dev',
      architectureImage: '/projects/chat/architecture.webp',
      architectureDescription: 'Horizontally scalable WebSocket cluster backed by Redis Pub/Sub adapter and persistent MongoDB storage.',
      videoUrl: '',
      technologies: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Redis', 'Tailwind CSS', 'Docker'],
      features: [
        { title: 'Low-Latency Message Delivery', description: 'Sub-20ms WebSocket pub/sub message propagation with optimistic UI updates.' },
        { title: 'Presence & Status Sync', description: 'Distributed heartbeat presence tracker with active channel indicators.' },
        { title: 'Media & File Preview', description: 'In-app multimedia player, PDF viewer, and image carousel.' }
      ],
      images: [
        { url: '/projects/chat/screenshot-1.webp', altText: 'Channel view with rich markdown code snippet rendering', order: 1 }
      ]
    }
  ];

  for (const p of projectsData) {
    const { technologies, features, images, ...pData } = p;
    
    // Check existing project
    let project = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (!project) {
      project = await prisma.project.create({
        data: {
          ...pData,
        },
      });
    } else {
      await prisma.project.update({
        where: { id: project.id },
        data: pData,
      });
    }

    // Connect technologies
    await prisma.projectTechnology.deleteMany({ where: { projectId: project.id } });
    for (const tName of technologies) {
      let tId = techMap.get(tName);
      if (!tId) {
        const newT = await prisma.technology.create({ data: { name: tName, category: 'General' } });
        tId = newT.id;
        techMap.set(tName, tId);
      }
      await prisma.projectTechnology.create({
        data: { projectId: project.id, technologyId: tId },
      });
    }

    // Connect features
    await prisma.projectFeature.deleteMany({ where: { projectId: project.id } });
    for (let i = 0; i < features.length; i++) {
      await prisma.projectFeature.create({
        data: {
          projectId: project.id,
          title: features[i].title,
          description: features[i].description,
          order: i,
        },
      });
    }

    // Connect images
    await prisma.projectImage.deleteMany({ where: { projectId: project.id } });
    for (const img of images) {
      await prisma.projectImage.create({
        data: {
          projectId: project.id,
          url: img.url,
          altText: img.altText,
          order: img.order,
        },
      });
    }
  }
  console.log(`✅ Seeded ${projectsData.length} projects`);

  // 6. Seed Case Studies
  const caseStudiesData = [
    {
      title: 'AI Interview Copilot: Architecting Real-Time Voice, RAG & LLM Assessment',
      slug: 'ai-interview-copilot-architecture',
      summary: 'A deep-dive technical case study on engineering sub-second speech evaluation, RAG retrieval pipelines, and rubrics grading for technical interviews.',
      problem: 'Traditional coding and behavioral interview prep tools either rely on static question banks with no personalized feedback or suffer from high latency (>4s) and hallucinations when using raw LLM prompts.',
      background: 'Job seekers across engineering disciplines struggle with receiving objective, immediate, and actionable feedback on both their technical depth and spoken communication.',
      goals: '1. Build an end-to-end mock interview platform with sub-second feedback latency.\n2. Prevent LLM hallucinations using structured RAG retrieval.\n3. Provide multi-dimensional grading (algorithms, architecture, behavioral alignment).',
      architecture: 'Asynchronous event-driven architecture using Next.js on the edge, Node.js orchestration backend, PostgreSQL with pgvector for contextual similarity search, and WebSocket duplex streaming.',
      architectureImage: '/images/architecture/ai-copilot-architecture.svg',
      implementation: 'Implemented custom chunking and semantic embeddings of 5,000+ real tech interview transcripts. Integrated streaming audio transcription via Whisper WebSockets and structured evaluation schema enforcement using Zod + OpenAI Function Calling.',
      challenges: 'Managing WebSocket audio backpressure during high-jitter network conditions and ensuring LLM evaluation consistency across multiple runs.',
      solutions: 'Created a client-side audio ring buffer with adaptive chunking and implemented temperature stabilization with strict JSON schema validation for deterministic scoring.',
      security: 'End-to-end token validation, audio stream encryption in transit (WSS), sanitization of all generated markdown prompts, and role-based data isolation.',
      performance: 'Average evaluation roundtrip latency decreased from 4.2s to 850ms. Reduced token consumption by 40% through intelligent prompt pruning.',
      results: 'Over 12,000 mock interview sessions conducted with 94% positive user satisfaction and 99.8% server uptime.',
      lessonsLearned: 'Strict output schema constraints and few-shot calibration are critical when using LLMs for objective evaluation.',
      featured: true,
      status: 'PUBLISHED' as const,
      order: 1,
      githubUrl: 'https://github.com/mrityunjay45108/ai-english-learning-app',
      liveUrl: 'https://interview-copilot.demo.mrityunjay.dev',
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'RAG', 'LLM', 'Docker'],
      sections: [
        {
          title: 'The Challenge of Real-Time Interview Evaluation',
          content: 'Evaluating spoken communication and coding depth simultaneously requires sub-second streaming audio parsing and instant semantic matching against ground-truth rubrics.',
          order: 1,
        },
        {
          title: 'Vector Knowledge Retrieval Pipeline',
          content: 'By storing interview rubrics and sample high-performing answers in PostgreSQL with pgvector, the system fetches relevant evaluation criteria in under 25ms.',
          order: 2,
        },
        {
          title: 'Benchmarking & Production Results',
          content: 'Stress testing showed that our Node.js WebSocket orchestration layer comfortably handled 1,500 concurrent live interview streams on a single 4-core container instance.',
          order: 3,
        }
      ]
    },
    {
      title: 'Scaling Microservices Backend: 10k RPS Architecture with Redis, Docker & Kafka',
      slug: 'scaling-microservices-10k-rps',
      summary: 'How we engineered a distributed e-commerce backend capable of sustaining 10,000 requests per second with 99.9th percentile latency under 45ms.',
      problem: 'Monolithic legacy systems suffered from cascading database lock contention during flash sales, resulting in 504 gateway timeouts.',
      background: 'High concurrency traffic spikes during promotional events exposed architectural bottlenecks in synchronous HTTP inter-service calls and unindexed relational joins.',
      goals: '1. Decouple transactional checkout from catalog browsing.\n2. Guarantee inventory consistency without distributed locking deadlocks.\n3. Achieve sub-50ms p99 latency under 10k RPS.',
      architecture: 'Distributed microservices architecture using Express.js/Node.js, Docker containers, Kubernetes deployment, Redis cache clusters, and Kafka message brokers.',
      architectureImage: '/images/architecture/microservices-10k-rps.svg',
      implementation: 'Decomposed services into independent Docker containers. Implemented Saga orchestration pattern for distributed order transactions and multi-layer caching with Redis.',
      challenges: 'Handling race conditions during concurrent inventory decrements when multiple users attempted to buy the last available item simultaneously.',
      solutions: 'Utilized Redis Lua scripts for atomic inventory checks and decrements prior to publishing order confirmation events to Kafka.',
      security: 'mTLS communication between internal microservices, JWT stateless auth with token revocation lists in Redis, and rate limiting at the API gateway.',
      performance: 'p99 response time reduced from 820ms to 38ms. Infrastructure costs reduced by 35% through horizontal auto-scaling pods.',
      results: 'Successfully processed 250,000 orders during a simulated peak load campaign with 0% data inconsistency.',
      lessonsLearned: 'Atomic Redis operations and asynchronous event messaging eliminate the need for complex distributed locking mechanisms in high-throughput workloads.',
      featured: true,
      status: 'PUBLISHED' as const,
      order: 2,
      githubUrl: 'https://github.com/mrityunjay45108/scalable-ecommerce-platform',
      liveUrl: 'https://ecommerce.demo.mrityunjay.dev',
      technologies: ['Node.js', 'Express.js', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis'],
      sections: [
        {
          title: 'Monolith Deconstruction & Domain Modeling',
          content: 'Domain-Driven Design (DDD) was employed to establish clean bounded contexts for Catalog, Order, Payment, and Notification services.',
          order: 1,
        },
        {
          title: 'Atomic Redis Lua Scripts for Inventory Control',
          content: 'Moving inventory decrement logic directly into Redis Lua scripts guaranteed serial execution in sub-millisecond timeframes without locking the primary database.',
          order: 2,
        }
      ]
    }
  ];

  for (const cs of caseStudiesData) {
    const { technologies, sections, ...csData } = cs;
    let caseStudy = await prisma.caseStudy.findUnique({ where: { slug: cs.slug } });
    if (!caseStudy) {
      caseStudy = await prisma.caseStudy.create({
        data: {
          ...csData,
          publishedAt: new Date(),
        },
      });
    } else {
      await prisma.caseStudy.update({
        where: { id: caseStudy.id },
        data: csData,
      });
    }

    // Connect technologies
    await prisma.caseStudyTechnology.deleteMany({ where: { caseStudyId: caseStudy.id } });
    for (const tName of technologies) {
      let tId = techMap.get(tName);
      if (!tId) {
        const newT = await prisma.technology.create({ data: { name: tName, category: 'General' } });
        tId = newT.id;
        techMap.set(tName, tId);
      }
      await prisma.caseStudyTechnology.create({
        data: { caseStudyId: caseStudy.id, technologyId: tId },
      });
    }

    // Connect sections
    await prisma.caseStudySection.deleteMany({ where: { caseStudyId: caseStudy.id } });
    for (const s of sections) {
      await prisma.caseStudySection.create({
        data: {
          caseStudyId: caseStudy.id,
          title: s.title,
          content: s.content,
          order: s.order,
        },
      });
    }
  }
  console.log(`✅ Seeded ${caseStudiesData.length} case studies`);

  // 7. Seed Blog Posts
  const blogPostsData = [
    {
      title: 'How I Built an AI Interview Copilot with RAG and Next.js',
      slug: 'how-i-built-ai-interview-copilot',
      excerpt: 'A comprehensive engineering guide on building a low-latency AI interview copilot with speech recognition, vector knowledge retrieval, and real-time performance analytics.',
      categorySlug: 'ai-generative-ai',
      tags: ['AI', 'RAG', 'LLM', 'React', 'Node.js', 'PostgreSQL'],
      status: 'PUBLISHED' as const,
      readingTime: 6,
      content: `## Introduction

Technical interviews are one of the highest-friction milestones for software engineers. While traditional mock interview platforms offer pre-recorded questions or text-only prompts, they fail to replicate the dynamic, conversational nature of real technical evaluations.

In this article, I will share the architectural decisions, challenges, and implementation details behind building **AI Interview Copilot** — an intelligent platform that simulates realistic technical interviews, evaluates spoken answers, and provides automated, rubric-based feedback in real time.

---

## Architecture Overview

The system consists of three core layers:
1. **Frontend**: Next.js with React 19, Tailwind CSS, and Web Audio API for microphone streaming.
2. **Backend Orchestrator**: Node.js & Express API with WebSocket duplex streams for sub-second communication.
3. **AI & Vector Pipeline**: PostgreSQL with \`pgvector\` for semantic rubric retrieval and an LLM evaluation service with strict schema validation.

\`\`\`typescript
// Example of structured evaluation schema using Zod
import { z } from 'zod';

export const EvaluationResultSchema = z.object({
  score: z.number().min(0).max(100),
  technicalAccuracy: z.number().min(0).max(10),
  communicationClarity: z.number().min(0).max(10),
  strengths: z.array(z.string()),
  improvementAreas: z.array(z.string()),
  suggestedAnswer: z.string(),
});
\`\`\`

---

## 1. Sub-Second Speech-to-Text with WebSockets

To make the interview feel natural, latency must remain under 1 second. Instead of recording full audio files and sending them via HTTP POST, we stream small PCM audio chunks over a WebSocket connection:

\`\`\`javascript
// Audio stream processor
const audioContext = new AudioContext({ sampleRate: 16000 });
const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
const source = audioContext.createMediaStreamSource(mediaStream);

const processor = audioContext.createScriptProcessor(4096, 1, 1);
processor.onaudioprocess = (e) => {
  const inputData = e.inputBuffer.getChannelData(0);
  socket.send(floatTo16BitPCM(inputData));
};
\`\`\`

---

## 2. Preventing Hallucinations with RAG

When evaluating technical answers (such as explaining B-Trees or distributed consensus), naive LLM prompts often hallucinate or grade inconsistently. 

We solve this using **Retrieval-Augmented Generation (RAG)**:
1. We index canonical computer science rubrics, time complexity proofs, and standard trade-offs into PostgreSQL using pgvector embeddings.
2. When the candidate speaks their answer, we extract key technical concepts and query the vector store for the exact grading criteria.
3. The retrieved criteria are injected into the prompt as hard evaluation constraints.

---

## 3. Results & Key Takeaways

By pairing structured schema validation with vector-grounded rubrics:
* **Evaluation latency** dropped to **850ms**.
* **Scoring consistency** achieved a **97.4% correlation** with human senior engineering interviewers.
* **Token usage** decreased by **40%** through selective context window retrieval.

Building AI applications in 2026 isn't just about calling API endpoints — it's about robust system design, low-latency streaming, and strict evaluation guardrails.
`,
    },
    {
      title: 'Architecting Scalable Microservices with Node.js, Prisma, and PostgreSQL',
      slug: 'architecting-scalable-microservices-nodejs-prisma',
      excerpt: 'Best practices for organizing multi-service architectures, handling distributed transactions with the Saga pattern, and optimizing database concurrency.',
      categorySlug: 'backend-architecture',
      tags: ['Node.js', 'PostgreSQL', 'Prisma', 'Docker', 'Microservices', 'Redis'],
      status: 'PUBLISHED' as const,
      readingTime: 7,
      content: `## The Evolution from Monolith to Microservices

As backend systems scale past thousands of concurrent users, monolithic databases often become the single point of failure due to locking contention and bloated connection pools.

In this guide, we explore how to design resilient microservices using **Node.js**, **Prisma ORM**, and **PostgreSQL**, with asynchronous messaging and multi-tier caching.

---

## 1. Domain Boundary Isolation

Each service must own its private database. Sharing a single database across multiple services tightly couples schemas and defeats the primary benefit of microservices.

\`\`\`text
[ Client Request ]
       │
       ▼
[ API Gateway (Kong / Express) ]
   ├───► Auth Service (PostgreSQL)
   ├───► Order Service (PostgreSQL + Prisma)
   └───► Inventory Service (Redis + PostgreSQL)
\`\`\`

---

## 2. High-Throughput Database Optimizations with Prisma

When using Prisma in microservices, connection pooling is critical. Default connection limits can quickly exhaust PostgreSQL pool limits during traffic surges:

\`\`\`prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
\`\`\`

Configuring connection pool parameters via connection string:
\`postgresql://user:pass@localhost:5432/db?connection_limit=20&pool_timeout=10\`

---

## 3. Distributed Transactions with the Saga Pattern

When an order is placed, three separate steps must succeed:
1. Deduct user wallet balance (Payment Service)
2. Decrement product stock (Inventory Service)
3. Create order record (Order Service)

Instead of distributed 2-phase commits (which block and degrade throughput), we use an **Event-Driven Choreographed Saga**:

\`\`\`typescript
// Order service publishes event
await messageBroker.publish('ORDER_CREATED', {
  orderId: order.id,
  userId: order.userId,
  amount: order.totalAmount,
  items: order.items,
});
\`\`\`

If any downstream service fails, a compensating transaction (e.g. \`REFUND_PAYMENT\` or \`RESTORE_STOCK\`) is triggered automatically.

---

## Conclusion

Microservices introduce operational complexity, but when combined with type-safe tools like Prisma, atomic caching with Redis, and message-driven sagas, you can build systems that scale effortlessly to tens of thousands of requests per second.
`,
    },
    {
      title: 'The Practical Guide to Building Multi-Agent AI Workflows in 2026',
      slug: 'practical-guide-multi-agent-ai-workflows',
      excerpt: 'How to design autonomous multi-agent AI systems with task delegation, state management, tool calling, and human-in-the-loop validation.',
      categorySlug: 'ai-generative-ai',
      tags: ['AI', 'LLM', 'TypeScript', 'Node.js'],
      status: 'PUBLISHED' as const,
      readingTime: 5,
      content: `## Why Single LLM Prompts Fail on Complex Tasks

Single-shot prompts break down when tasks require research, code generation, testing, and error recovery in sequence. Large language models struggle to maintain context when juggling conflicting instructions in a single prompt.

**Multi-agent architecture** solves this by dividing complex missions into specialized, autonomous personas (e.g., Planner, Researcher, Implementer, Code Reviewer) that communicate via structured messages.

---

## Agent Role Specialization

\`\`\`text
   [ User Goal ]
         │
         ▼
 ┌───────────────┐
 │ Planner Agent │
 └───────┬───────┘
         │ (Sub-tasks)
         ├──► ┌───────────────────┐
         │    │  Researcher Agent │
         │    └───────────────────┘
         │ (Context)
         ├──► ┌───────────────────┐
         │    │ Implementer Agent │
         │    └───────────────────┘
         │ (Diff)
         └──► ┌───────────────────┐
              │  Reviewer Agent   │
              └───────────────────┘
\`\`\`

---

## Implementing Agent Coordination in TypeScript

An agent requires three fundamentals:
1. **System Prompt**: Defining role boundaries and forbidden behaviors.
2. **Tool Group**: Exact typed tools the agent is permitted to invoke.
3. **Message State**: Contextual message history and structured output format.

\`\`\`typescript
interface Agent {
  name: string;
  role: string;
  tools: Tool[];
  executeTask(prompt: string, context: Record<string, any>): Promise<AgentResult>;
}
\`\`\`

---

## Guardrails & Error Recovery

Autonomous agents must never enter infinite recursion loops. Implement strict execution ceilings:
* Maximum tool calls per step (\`maxIterations: 10\`).
* Timeout barriers on external API calls.
* Human-in-the-loop checkpoints for destructive actions (e.g., database drops or credit card charges).

Multi-agent systems represent the future of software automation. Mastering state machines, schema validation, and tool routing is the most valuable skill for modern AI engineers.
`,
    }
  ];

  for (const bp of blogPostsData) {
    const { tags, categorySlug, ...bData } = bp;
    const catId = categoryMap.get(categorySlug) || null;

    let post = await prisma.blogPost.findUnique({ where: { slug: bp.slug } });
    if (!post) {
      post = await prisma.blogPost.create({
        data: {
          ...bData,
          authorId: admin.id,
          categoryId: catId,
          publishedAt: new Date(),
        },
      });
    } else {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          ...bData,
          categoryId: catId,
        },
      });
    }

    // Connect tags
    await prisma.postTag.deleteMany({ where: { postId: post.id } });
    for (const tagName of tags) {
      let tId = tagMap.get(tagName);
      if (!tId) {
        const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newTag = await prisma.tag.create({ data: { name: tagName, slug } });
        tId = newTag.id;
        tagMap.set(tagName, tId);
      }
      await prisma.postTag.create({
        data: { postId: post.id, tagId: tId },
      });
    }
  }
  console.log(`✅ Seeded ${blogPostsData.length} blog posts`);

  // 8. Seed GitHub Featured Repositories
  const githubRepos = [
    {
      owner: 'mrityunjay45108',
      name: 'job_portal',
      fullName: 'mrityunjay45108/job_portal',
      description: 'AI-Powered Job Search & Recruitment Portal with AI Resume Builder, 95% ATS Compatibility Analyzer, and Admin/Recruiter Dashboards.',
      url: 'https://github.com/mrityunjay45108/job_portal',
      language: 'TypeScript',
      stars: 38,
      forks: 9,
      topics: ['react', 'nextjs', 'mongodb', 'ats-checker', 'job-portal', 'tailwind-css', 'express'],
      featured: true,
      displayOrder: 1,
      customDescription: 'Next-Gen Talent Network and job search platform featuring AI Resume Builder, ATS Score Checker, and Multi-Role Admin Management.',
      projectSlug: 'job-portal',
    },
    {
      owner: 'mrityunjay45108',
      name: 'ai-english-learning-app',
      fullName: 'mrityunjay45108/ai-english-learning-app',
      description: 'AI-powered English learning platform & mock interview copilot with Emma AI prompt studio, real-time speech evaluation, and mobile app sync.',
      url: 'https://github.com/mrityunjay45108/ai-english-learning-app',
      language: 'TypeScript',
      stars: 48,
      forks: 12,
      topics: ['ai', 'rag', 'nextjs', 'react-native', 'llm', 'speech-to-text'],
      featured: true,
      displayOrder: 2,
      customDescription: 'Flagship open-source AI English learning and mock interview copilot utilizing Emma AI prompt studio and real-time voice streaming.',
      projectSlug: 'ai-interview-copilot',
    },
    {
      owner: 'mrityunjay45108',
      name: 'enterprise-rag-platform',
      fullName: 'mrityunjay45108/enterprise-rag-platform',
      description: 'Production-ready Retrieval-Augmented Generation (RAG) platform with hybrid vector search and exact citation tracking.',
      url: 'https://github.com/mrityunjay45108/enterprise-rag-platform',
      language: 'Python',
      stars: 35,
      forks: 8,
      topics: ['python', 'rag', 'pgvector', 'fastapi', 'langchain'],
      featured: true,
      displayOrder: 3,
      customDescription: 'Enterprise document intelligence platform supporting multi-tenant document collections and hybrid search.',
      projectSlug: 'enterprise-rag-platform',
    },
    {
      owner: 'mrityunjay45108',
      name: 'scalable-ecommerce-platform',
      fullName: 'mrityunjay45108/scalable-ecommerce-platform',
      description: 'Event-driven e-commerce backend with distributed Saga orchestration, Docker, and Redis caching.',
      url: 'https://github.com/mrityunjay45108/scalable-ecommerce-platform',
      language: 'TypeScript',
      stars: 29,
      forks: 5,
      topics: ['microservices', 'docker', 'kubernetes', 'redis', 'postgresql', 'nodejs'],
      featured: true,
      displayOrder: 4,
      customDescription: 'Distributed microservices architecture capable of sustaining 10,000 requests per second.',
      projectSlug: 'microservices-ecommerce',
    },
    {
      owner: 'mrityunjay45108',
      name: 'distributed-chat-workspace',
      fullName: 'mrityunjay45108/distributed-chat-workspace',
      description: 'Full-featured real-time messaging and collaborative workspace engine with WebSockets and Redis pub/sub.',
      url: 'https://github.com/mrityunjay45108/distributed-chat-workspace',
      language: 'TypeScript',
      stars: 22,
      forks: 4,
      topics: ['react', 'websockets', 'redis', 'tailwindcss', 'mongodb'],
      featured: true,
      displayOrder: 5,
      customDescription: 'High-throughput real-time collaboration workspace tool.',
      projectSlug: 'distributed-chat-workspace',
    },
  ];

  for (const repo of githubRepos) {
    const { projectSlug, ...repoData } = repo;
    const project = await prisma.project.findUnique({ where: { slug: projectSlug } });

    if (project) {
      await prisma.gitHubRepository.updateMany({
        where: {
          projectId: project.id,
          NOT: { fullName: repo.fullName },
        },
        data: { projectId: null },
      });
    }

    await prisma.gitHubRepository.upsert({
      where: { fullName: repo.fullName },
      update: {
        ...repoData,
        projectId: project ? project.id : null,
      },
      create: {
        ...repoData,
        projectId: project ? project.id : null,
      },
    });
  }
  console.log(`✅ Seeded ${githubRepos.length} GitHub repositories`);

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
