import { BlogPost } from '../types';

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'How I Built an AI Interview Copilot with RAG and Next.js',
    slug: 'how-i-built-ai-interview-copilot',
    excerpt: 'A comprehensive engineering guide on building a low-latency AI interview copilot with speech recognition, vector knowledge retrieval, and real-time performance analytics.',
    content: `## Introduction

Technical interviews are one of the highest-friction milestones for software engineers. While traditional mock interview platforms offer pre-recorded questions or text-only prompts, they fail to replicate the dynamic, conversational nature of real technical evaluations.

In this article, I will share the architectural decisions, challenges, and implementation details behind building **AI Interview Copilot** — an intelligent platform that simulates realistic technical interviews, evaluates spoken answers, and provides automated, rubric-based feedback in real time.

---

## Architecture Overview

The system consists of three core layers:
1. **Frontend**: Next.js with React, Tailwind CSS, and Web Audio API for microphone streaming.
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
    featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTime: 6,
    viewCount: 1420,
    publishedAt: '2026-08-15T10:00:00.000Z',
    createdAt: '2026-08-15T10:00:00.000Z',
    updatedAt: '2026-08-15T10:00:00.000Z',
    author: {
      id: 'admin-1',
      name: 'Mrityunjay Kumar',
      email: 'admin@mrityunjay.dev',
    },
    category: {
      id: 'cat-1',
      name: 'AI & Generative AI',
      slug: 'ai-generative-ai',
    },
    tags: [
      { tag: { id: 'tag-1', name: 'AI', slug: 'ai' } },
      { tag: { id: 'tag-2', name: 'RAG', slug: 'rag' } },
      { tag: { id: 'tag-3', name: 'LLM', slug: 'llm' } },
      { tag: { id: 'tag-4', name: 'React', slug: 'react' } },
      { tag: { id: 'tag-5', name: 'Node.js', slug: 'nodejs' } },
      { tag: { id: 'tag-6', name: 'PostgreSQL', slug: 'postgresql' } },
    ],
  },
  {
    id: 'blog-2',
    title: 'Architecting Scalable Microservices with Node.js, Prisma, and PostgreSQL',
    slug: 'architecting-scalable-microservices-nodejs-prisma',
    excerpt: 'Best practices for organizing multi-service architectures, handling distributed transactions with the Saga pattern, and optimizing database concurrency.',
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
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTime: 7,
    viewCount: 980,
    publishedAt: '2026-08-20T10:00:00.000Z',
    createdAt: '2026-08-20T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z',
    author: {
      id: 'admin-1',
      name: 'Mrityunjay Kumar',
      email: 'admin@mrityunjay.dev',
    },
    category: {
      id: 'cat-2',
      name: 'Backend & Architecture',
      slug: 'backend-architecture',
    },
    tags: [
      { tag: { id: 'tag-5', name: 'Node.js', slug: 'nodejs' } },
      { tag: { id: 'tag-6', name: 'PostgreSQL', slug: 'postgresql' } },
      { tag: { id: 'tag-7', name: 'Prisma', slug: 'prisma' } },
      { tag: { id: 'tag-8', name: 'Docker', slug: 'docker' } },
      { tag: { id: 'tag-9', name: 'Microservices', slug: 'microservices' } },
      { tag: { id: 'tag-10', name: 'Redis', slug: 'redis' } },
    ],
  },
  {
    id: 'blog-3',
    title: 'The Practical Guide to Building Multi-Agent AI Workflows in 2026',
    slug: 'practical-guide-multi-agent-ai-workflows',
    excerpt: 'How to design autonomous multi-agent AI systems with task delegation, state management, tool calling, and human-in-the-loop validation.',
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
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    status: 'PUBLISHED',
    readingTime: 5,
    viewCount: 1120,
    publishedAt: '2026-08-28T10:00:00.000Z',
    createdAt: '2026-08-28T10:00:00.000Z',
    updatedAt: '2026-08-28T10:00:00.000Z',
    author: {
      id: 'admin-1',
      name: 'Mrityunjay Kumar',
      email: 'admin@mrityunjay.dev',
    },
    category: {
      id: 'cat-1',
      name: 'AI & Generative AI',
      slug: 'ai-generative-ai',
    },
    tags: [
      { tag: { id: 'tag-1', name: 'AI', slug: 'ai' } },
      { tag: { id: 'tag-3', name: 'LLM', slug: 'llm' } },
      { tag: { id: 'tag-11', name: 'TypeScript', slug: 'typescript' } },
      { tag: { id: 'tag-5', name: 'Node.js', slug: 'nodejs' } },
    ],
  },
];
