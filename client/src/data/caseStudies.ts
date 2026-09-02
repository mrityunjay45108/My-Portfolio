import { CaseStudy } from '../types';

export const initialCaseStudies: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'AI Interview Copilot: Architecting Real-Time Voice, RAG & LLM Assessment',
    slug: 'ai-interview-copilot-architecture',
    summary: 'A deep-dive technical case study on engineering sub-second speech evaluation, RAG retrieval pipelines, and rubrics grading for technical interviews.',
    problem: 'Traditional coding and behavioral interview prep tools either rely on static question banks with no personalized feedback or suffer from high latency (>4s) and hallucinations when using raw LLM prompts.',
    background: 'Job seekers across engineering disciplines struggle with receiving objective, immediate, and actionable feedback on both their technical depth and spoken communication.',
    goals: '1. Build an end-to-end mock interview platform with sub-second feedback latency.\n2. Prevent LLM hallucinations using structured RAG retrieval.\n3. Provide multi-dimensional grading (algorithms, architecture, behavioral alignment).',
    architecture: 'Asynchronous event-driven architecture using Next.js on the edge, Node.js orchestration backend, PostgreSQL with pgvector for contextual similarity search, and WebSocket duplex streaming.',
    architectureImage: '/images/projects/ai-interview-copilot/seekho-english-dashboard.png',
    implementation: 'Implemented custom chunking and semantic embeddings of 5,000+ real tech interview transcripts. Integrated streaming audio transcription via Whisper WebSockets and structured evaluation schema enforcement using Zod + OpenAI Function Calling.',
    challenges: 'Managing WebSocket audio backpressure during high-jitter network conditions and ensuring LLM evaluation consistency across multiple runs.',
    solutions: 'Created a client-side audio ring buffer with adaptive chunking and implemented temperature stabilization with strict JSON schema validation for deterministic scoring.',
    security: 'End-to-end token validation, audio stream encryption in transit (WSS), sanitization of all generated markdown prompts, and role-based data isolation.',
    performance: 'Average evaluation roundtrip latency decreased from 4.2s to 850ms. Reduced token consumption by 40% through intelligent prompt pruning.',
    results: 'Over 12,000 mock interview sessions conducted with 94% positive user satisfaction and 99.8% server uptime.',
    lessonsLearned: 'Strict output schema constraints and few-shot calibration are critical when using LLMs for objective evaluation.',
    featured: true,
    status: 'PUBLISHED',
    order: 1,
    viewCount: 1850,
    publishedAt: '2026-08-10T10:00:00.000Z',
    createdAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-08-10T10:00:00.000Z',
    githubUrl: 'https://github.com/mrityunjay45108/ai-english-learning-app',
    liveUrl: 'https://interview-copilot.demo.mrityunjay.dev',
    technologies: [
      { technology: { id: 't1', name: 'React', category: 'Frontend' } },
      { technology: { id: 't2', name: 'TypeScript', category: 'Languages' } },
      { technology: { id: 't3', name: 'Node.js', category: 'Backend' } },
      { technology: { id: 't4', name: 'PostgreSQL', category: 'Databases' } },
      { technology: { id: 't5', name: 'Prisma', category: 'Databases' } },
      { technology: { id: 't6', name: 'RAG', category: 'AI & GenAI' } },
      { technology: { id: 't7', name: 'LLM', category: 'AI & GenAI' } },
      { technology: { id: 't12', name: 'Docker', category: 'DevOps & Cloud' } },
    ],
    sections: [
      {
        id: 'sec-1',
        title: 'The Challenge of Real-Time Interview Evaluation',
        content: 'Evaluating spoken communication and coding depth simultaneously requires sub-second streaming audio parsing and instant semantic matching against ground-truth rubrics.',
        order: 1,
      },
      {
        id: 'sec-2',
        title: 'Vector Knowledge Retrieval Pipeline',
        content: 'By storing interview rubrics and sample high-performing answers in PostgreSQL with pgvector, the system fetches relevant evaluation criteria in under 25ms.',
        order: 2,
      },
      {
        id: 'sec-3',
        title: 'Benchmarking & Production Results',
        content: 'Stress testing showed that our Node.js WebSocket orchestration layer comfortably handled 1,500 concurrent live interview streams on a single 4-core container instance.',
        order: 3,
      }
    ],
    images: [
      { id: 'cs-img-1', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80', caption: 'Interactive mock evaluation interface', order: 1 },
      { id: 'cs-img-2', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', caption: 'Rubrics scorecard and performance benchmark charts', order: 2 }
    ]
  },
  {
    id: 'cs-2',
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
    status: 'PUBLISHED',
    order: 2,
    viewCount: 1490,
    publishedAt: '2026-08-22T10:00:00.000Z',
    createdAt: '2026-08-22T10:00:00.000Z',
    updatedAt: '2026-08-22T10:00:00.000Z',
    githubUrl: 'https://github.com/mrityunjay45108/scalable-ecommerce-platform',
    liveUrl: 'https://ecommerce.demo.mrityunjay.dev',
    technologies: [
      { technology: { id: 't3', name: 'Node.js', category: 'Backend' } },
      { technology: { id: 't13', name: 'Express.js', category: 'Backend' } },
      { technology: { id: 't12', name: 'Docker', category: 'DevOps & Cloud' } },
      { technology: { id: 't14', name: 'Kubernetes', category: 'DevOps & Cloud' } },
      { technology: { id: 't4', name: 'PostgreSQL', category: 'Databases' } },
      { technology: { id: 't10', name: 'Redis', category: 'DevOps & Cloud' } },
    ],
    sections: [
      {
        id: 'sec-4',
        title: 'Monolith Deconstruction & Domain Modeling',
        content: 'Domain-Driven Design (DDD) was employed to establish clean bounded contexts for Catalog, Order, Payment, and Notification services.',
        order: 1,
      },
      {
        id: 'sec-5',
        title: 'Atomic Redis Lua Scripts for Inventory Control',
        content: 'Moving inventory decrement logic directly into Redis Lua scripts guaranteed serial execution in sub-millisecond timeframes without locking the primary database.',
        order: 2,
      }
    ],
    images: [
      { id: 'cs-img-3', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80', caption: 'Load testing latency distribution graphs', order: 1 }
    ]
  }
];
