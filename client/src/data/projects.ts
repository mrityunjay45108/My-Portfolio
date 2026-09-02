import { Project } from '../types';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'AI Interview Copilot & Mock Evaluator',
    slug: 'ai-interview-copilot',
    shortDescription: 'AI-powered mock interview and real-time candidate assessment platform with automated question synthesis, speech evaluation, and comprehensive performance analytics.',
    description: 'An intelligent AI-driven interview preparation platform designed to simulate realistic technical and behavioral interviews. Leverages retrieval-augmented generation (RAG) and low-latency LLM evaluation pipelines to deliver actionable, contextual feedback to job seekers and recruitment teams.',
    category: 'AI / GenAI',
    featured: true,
    published: true,
    order: 1,
    githubUrl: 'https://github.com/mrityunjay45108/ai-interview-copilot',
    liveUrl: 'https://interview-copilot.demo.mrityunjay.dev',
    architectureImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    architectureDescription: 'High-throughput asynchronous architecture featuring Next.js frontend, Node.js/Express API orchestration, vector search indexing via PostgreSQL/pgvector, and WebSocket audio streaming for real-time speech-to-text.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    viewCount: 1240,
    technologies: [
      { technology: { id: 't1', name: 'React', category: 'Frontend' } },
      { technology: { id: 't2', name: 'TypeScript', category: 'Languages' } },
      { technology: { id: 't3', name: 'Node.js', category: 'Backend' } },
      { technology: { id: 't4', name: 'PostgreSQL', category: 'Databases' } },
      { technology: { id: 't5', name: 'Prisma', category: 'Databases' } },
      { technology: { id: 't6', name: 'RAG', category: 'AI & GenAI' } },
      { technology: { id: 't7', name: 'LLM', category: 'AI & GenAI' } },
      { technology: { id: 't8', name: 'Tailwind CSS', category: 'Frontend' } },
    ],
    features: [
      { title: 'Dynamic Question Engine', description: 'Contextual interview prompt generation tailored to candidate resume, role, and experience level.' },
      { title: 'Real-Time Voice Analysis', description: 'Sub-second speech recognition and conversational response evaluation.' },
      { title: 'Multimodal Scorecard', description: 'Automated rubrics evaluating technical depth, communication clarity, problem-solving, and time efficiency.' },
      { title: 'Vectorized Topic Search', description: 'Retrieves relevant company-specific interview question patterns from a dense knowledge base.' }
    ],
    images: [
      { id: 'img-1', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', altText: 'AI Interview Copilot interactive cockpit dashboard', order: 1 },
      { id: 'img-2', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', altText: 'Real-time performance analytics scorecard', order: 2 },
      { id: 'img-3', url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80', altText: 'Asynchronous streaming architecture diagram', order: 3 },
    ]
  },
  {
    id: 'proj-2',
    title: 'Enterprise RAG Knowledge & Document Platform',
    slug: 'enterprise-rag-platform',
    shortDescription: 'Enterprise-grade Retrieval-Augmented Generation system allowing semantic document exploration, citation tracking, and hybrid keyword-vector retrieval over huge document corpuses.',
    description: 'Built for enterprise knowledge workers, this platform ingests complex PDFs, API documentation, and Markdown files, performs hierarchical chunking, vector embedding, and hybrid search (BM25 + Dense Vectors) to generate hallucinations-free responses with exact citations.',
    category: 'AI / GenAI',
    featured: true,
    published: true,
    order: 2,
    githubUrl: 'https://github.com/mrityunjay45108/enterprise-rag-platform',
    liveUrl: 'https://rag-platform.demo.mrityunjay.dev',
    architectureImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    architectureDescription: 'Modular ingestion pipeline using LangChain, FastEmbed, PostgreSQL with pgvector, and Redis caching for recurrent query embedding lookups.',
    viewCount: 890,
    technologies: [
      { technology: { id: 't9', name: 'Python', category: 'Languages' } },
      { technology: { id: 't3', name: 'Node.js', category: 'Backend' } },
      { technology: { id: 't4', name: 'PostgreSQL', category: 'Databases' } },
      { technology: { id: 't10', name: 'Redis', category: 'DevOps & Cloud' } },
      { technology: { id: 't6', name: 'RAG', category: 'AI & GenAI' } },
      { technology: { id: 't11', name: 'AI Agents', category: 'AI & GenAI' } },
      { technology: { id: 't12', name: 'Docker', category: 'DevOps & Cloud' } },
      { technology: { id: 't1', name: 'React', category: 'Frontend' } },
    ],
    features: [
      { title: 'Hybrid Retrieval Engine', description: 'Combines dense embeddings and BM25 sparse lexical search for 98% factual precision.' },
      { title: 'Citation Verification', description: 'Every generated claim links directly to the highlighted source paragraph in the original document.' },
      { title: 'Multi-Tenant Workspaces', description: 'Role-based access control ensuring enterprise data privacy across departments.' },
      { title: 'Asynchronous Document Ingestion', description: 'Background worker queues processing 100+ page documents with progress tracking.' }
    ],
    images: [
      { id: 'img-4', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80', altText: 'Document ingestion and semantic chat interface', order: 1 },
      { id: 'img-5', url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80', altText: 'Citation explorer with side-by-side PDF viewer', order: 2 },
    ]
  },
  {
    id: 'proj-3',
    title: 'Scalable Microservices E-Commerce Platform',
    slug: 'microservices-ecommerce',
    shortDescription: 'High-concurrency e-commerce backend and frontend ecosystem utilizing event-driven microservices, distributed transaction saga patterns, and Redis caching.',
    description: 'A cloud-native e-commerce infrastructure engineered for peak load events. Segregated services for Auth, Catalog, Cart, Order, Payment, and Notification communicating asynchronously via RabbitMQ and gRPC with distributed Redis caching.',
    category: 'Full Stack',
    featured: true,
    published: true,
    order: 3,
    githubUrl: 'https://github.com/mrityunjay45108/microservices-ecommerce',
    liveUrl: 'https://ecommerce.demo.mrityunjay.dev',
    architectureImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    architectureDescription: 'Kubernetes-orchestrated microservices cluster with Kong API Gateway, Dockerized container instances, and PostgreSQL sharded databases.',
    viewCount: 1050,
    technologies: [
      { technology: { id: 't3', name: 'Node.js', category: 'Backend' } },
      { technology: { id: 't13', name: 'Express.js', category: 'Backend' } },
      { technology: { id: 't12', name: 'Docker', category: 'DevOps & Cloud' } },
      { technology: { id: 't14', name: 'Kubernetes', category: 'DevOps & Cloud' } },
      { technology: { id: 't4', name: 'PostgreSQL', category: 'Databases' } },
      { technology: { id: 't10', name: 'Redis', category: 'DevOps & Cloud' } },
      { technology: { id: 't1', name: 'React', category: 'Frontend' } },
      { technology: { id: 't8', name: 'Tailwind CSS', category: 'Frontend' } },
    ],
    features: [
      { title: 'Event-Driven Order Processing', description: 'Saga orchestrator coordinating inventory reservation, payment authorization, and fulfillment.' },
      { title: 'Sub-10ms Product Catalog Search', description: 'Multi-level Redis cache invalidation and database read-replicas.' },
      { title: 'Resilient Stripe Checkout', description: 'Idempotency key enforcement and robust webhook processing.' },
      { title: 'Admin Analytics Dashboard', description: 'Real-time sales telemetry, inventory threshold alerts, and revenue metrics.' }
    ],
    images: [
      { id: 'img-6', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', altText: 'E-commerce storefront and live checkout flow', order: 1 },
      { id: 'img-7', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', altText: 'Microservices telemetry and operational metrics', order: 2 },
    ]
  },
  {
    id: 'proj-4',
    title: 'Real-Time Collaborative Distributed Chat & Workspace',
    slug: 'distributed-chat-workspace',
    shortDescription: 'Full-featured real-time messaging, channel collaboration, and interactive workspace with WebSockets, WebRTC audio rooms, and end-to-end state sync.',
    description: 'A high-performance workspace tool offering instant team messaging, rich text formatting, file attachments, typing indicators, and presence tracking engineered on top of Socket.IO and Redis Pub/Sub clusters.',
    category: 'Full Stack',
    featured: false,
    published: true,
    order: 4,
    githubUrl: 'https://github.com/mrityunjay45108/distributed-chat-workspace',
    liveUrl: 'https://chat.demo.mrityunjay.dev',
    viewCount: 620,
    technologies: [
      { technology: { id: 't1', name: 'React', category: 'Frontend' } },
      { technology: { id: 't2', name: 'TypeScript', category: 'Languages' } },
      { technology: { id: 't3', name: 'Node.js', category: 'Backend' } },
      { technology: { id: 't15', name: 'MongoDB', category: 'Databases' } },
      { technology: { id: 't10', name: 'Redis', category: 'DevOps & Cloud' } },
      { technology: { id: 't8', name: 'Tailwind CSS', category: 'Frontend' } },
      { technology: { id: 't12', name: 'Docker', category: 'DevOps & Cloud' } },
    ],
    features: [
      { title: 'Low-Latency Message Delivery', description: 'Sub-20ms WebSocket pub/sub message propagation with optimistic UI updates.' },
      { title: 'Presence & Status Sync', description: 'Distributed heartbeat presence tracker with active channel indicators.' },
      { title: 'Media & File Preview', description: 'In-app multimedia player, PDF viewer, and image carousel.' }
    ],
    images: [
      { id: 'img-8', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80', altText: 'Channel workspace with markdown code preview', order: 1 }
    ]
  }
];
