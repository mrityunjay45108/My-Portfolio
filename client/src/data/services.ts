import { ServiceItem } from '../types';

export const services: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Full Stack Web Development',
    description: 'End-to-end modern web applications built with React, TypeScript, Next.js, and Tailwind CSS with pixel-perfect responsiveness and fast performance.',
    icon: 'Layout',
    features: ['Responsive UI/UX', 'State Management', 'Server-Side Rendering', 'TypeScript Safety']
  },
  {
    id: 'srv-2',
    title: 'Backend & API Engineering',
    description: 'Robust REST and WebSocket APIs built on Node.js, Express, and NestJS, featuring structured validation, rate limiting, and secure authentication.',
    icon: 'Server',
    features: ['RESTful & GraphQL APIs', 'JWT & OAuth Authentication', 'WebSocket Real-Time', 'Clean Architecture']
  },
  {
    id: 'srv-3',
    title: 'AI / GenAI & RAG Solutions',
    description: 'Custom AI agent workflows, Retrieval-Augmented Generation over private documents, prompt engineering, and low-latency LLM API integration.',
    icon: 'Brain',
    features: ['Contextual RAG Pipelines', 'Autonomous AI Agents', 'Vector Database Search', 'Streaming Responses']
  },
  {
    id: 'srv-4',
    title: 'Microservices Architecture',
    description: 'Decoupled, event-driven backend services communicating via message brokers and gRPC, designed for high availability and zero single point of failure.',
    icon: 'Cpu',
    features: ['Event-Driven Design', 'Distributed Caching', 'Saga Pattern Workflows', 'API Gateways']
  },
  {
    id: 'srv-5',
    title: 'Database Design & Optimization',
    description: 'Relational and document schema modeling with PostgreSQL, MongoDB, and Prisma ORM, complete with index optimization and zero-downtime migrations.',
    icon: 'Database',
    features: ['Schema Normalization', 'Complex Query Tuning', 'Prisma ORM Migrations', 'Connection Pooling']
  },
  {
    id: 'srv-6',
    title: 'DevOps & Cloud Deployment',
    description: 'Containerizing applications with Docker, orchestrating with Kubernetes, and setting up automated CI/CD deployment pipelines on AWS/GCP/Vercel.',
    icon: 'Cloud',
    features: ['Docker Containerization', 'CI/CD Automation', 'Environment Hardening', 'Monitoring & Logs']
  }
];
