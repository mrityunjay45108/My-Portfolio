import { AIProvider, AIMessagePayload, AIOptions, AIProviderResponse } from '../ai-provider.interface.js';

export class LocalPortfolioEngine implements AIProvider {
  readonly name = 'local';

  async generateResponse(
    messages: AIMessagePayload[],
    systemPrompt: string,
    _options?: AIOptions
  ): Promise<AIProviderResponse> {
    const startTime = Date.now();
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const answer = this.synthesizeAnswer(lastUserMessage, systemPrompt);

    return {
      content: answer,
      model: 'portfolio-semantic-engine-v2',
      tokensUsed: Math.ceil(answer.length / 4),
      latencyMs: Date.now() - startTime,
    };
  }

  async generateStreamingResponse(
    messages: AIMessagePayload[],
    systemPrompt: string,
    onChunk: (chunk: string) => void,
    options?: AIOptions
  ): Promise<AIProviderResponse> {
    const startTime = Date.now();
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const answer = this.synthesizeAnswer(lastUserMessage, systemPrompt);

    // Stream in realistic conversational chunks
    const words = answer.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? '' : ' ') + words[i];
      onChunk(chunk);
      await new Promise((resolve) => setTimeout(resolve, 15));
    }

    return {
      content: answer,
      model: 'portfolio-semantic-engine-v2',
      tokensUsed: Math.ceil(answer.length / 4),
      latencyMs: Date.now() - startTime,
    };
  }

  private synthesizeAnswer(query: string, systemPrompt: string): string {
    const q = query.toLowerCase().trim();

    // 1. Check for greeting
    if (q === 'hi' || q === 'hello' || q === 'hey' || q.includes('who are you')) {
      return (
        `👋 **Hello! I'm Mrityunjay's AI Portfolio Assistant.**\n\n` +
        `I can answer questions about Mrityunjay's projects, technologies, case studies, GitHub activity, or help you connect with him directly.\n\n` +
        `What would you like to explore? (e.g., *"Show me his AI projects"*, *"What technologies does he know?"*, *"How can I contact him?"*)`
      );
    }

    // 2. Check for contact / hire
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('resume')) {
      return (
        `You can easily connect with **Mrityunjay Kumar** through the following official channels:\n\n` +
        `* 📧 **Primary Email:** [kumarmrityunjay5210@gmail.com](mailto:kumarmrityunjay5210@gmail.com)\n` +
        `* 💼 **LinkedIn:** [mrityunjay-kumar-8480842a5](https://www.linkedin.com/in/mrityunjay-kumar-8480842a5)\n` +
        `* 🐙 **GitHub:** [@mrityunjay45108](https://github.com/mrityunjay45108)\n` +
        `* 📄 **Resume PDF:** [Download Latest Resume](https://res.cloudinary.com/dpd6q8ex4/image/upload/v1788340801/Mrityunjay_kumar_resume0._ydptl9.pdf)\n\n` +
        `You can also leave a direct message via the [Contact Form](/#contact) on this portfolio!`
      );
    }

    // 3. Check for specific projects
    if (q.includes('copilot') || q.includes('interview') || q.includes('english')) {
      return (
        `**AI Interview Copilot & Seekho English Learning App** is one of Mrityunjay's flagship AI systems:\n\n` +
        `* 🎯 **Core Tech:** Next.js, React, Node.js, PostgreSQL (pgvector), WebSockets, Whisper ASR, OpenAI Function Calling.\n` +
        `* 🚀 **Key Capabilities:** Real-time conversational voice assessments (<850ms latency), dynamic RAG retrieval from 5,000+ interview transcripts, zero hallucinations, and multidimensional rubrics scoring.\n` +
        `* 🔗 [View Case Study](/case-studies/ai-interview-copilot-architecture) • [GitHub Repository](https://github.com/mrityunjay45108/ai-english-learning-app)`
      );
    }

    if (q.includes('job') || q.includes('jobseekers') || q.includes('portal')) {
      return (
        `**JobSeekers — AI-Powered Job Search & Recruitment Portal**:\n\n` +
        `* 🎯 **Core Tech:** React, TypeScript, Node.js, Express, PostgreSQL, Prisma, Tailwind CSS.\n` +
        `* 🚀 **Key Features:** Intelligent resume matching, multi-role applicant tracking system (ATS), employer analytics dashboard, and instant job search filters.\n` +
        `* 🔗 [View Project](/projects/job-portal) • [Live Demo](https://job-portal-psi-henna-74.vercel.app/) • [GitHub Repository](https://github.com/mrityunjay45108/job_portal)`
      );
    }

    if (q.includes('ecommerce') || q.includes('microservices') || q.includes('scalable')) {
      return (
        `**Scalable Microservices E-Commerce Platform**:\n\n` +
        `* 🎯 **Core Tech:** Node.js, Docker, Kubernetes, Redis, PostgreSQL, RabbitMQ, gRPC.\n` +
        `* 🚀 **Architecture:** Decoupled distributed microservices (Auth, Catalog, Cart, Order, Payment) capable of sustaining 10,000+ RPS with Saga compensation patterns and atomic Redis Lua rollback scripts.\n` +
        `* 🔗 [View Case Study](/case-studies/microservices-10k-rps-architecture) • [GitHub Repository](https://github.com/mrityunjay45108/scalable-ecommerce-platform)`
      );
    }

    if (q.includes('rag') || q.includes('document')) {
      return (
        `**Enterprise RAG Knowledge & Document Platform**:\n\n` +
        `* 🎯 **Core Tech:** Python, LangChain, PostgreSQL (pgvector), FastEmbed, Redis, React.\n` +
        `* 🚀 **Features:** Ingests complex PDFs & API documentation, performs hybrid dense + BM25 keyword search, and delivers verifiable factual answers with side-by-side highlighted citations.\n` +
        `* 🔗 [View Project](/projects/enterprise-rag-platform) • [GitHub Repository](https://github.com/mrityunjay45108/enterprise-rag-platform)`
      );
    }

    // 4. Default: Extract knowledge summary from system prompt
    return (
      `Mrityunjay Kumar is a **Full Stack Developer & AI Engineer**.\n\n` +
      `Here is a summary of his verified work and skills:\n\n` +
      `* 💻 **Primary Technologies:** React, TypeScript, Node.js, Next.js, Express, PostgreSQL, Prisma, Python, Redis, Docker, Kubernetes, Tailwind CSS.\n` +
      `* 🤖 **AI & GenAI Depth:** RAG architectures, pgvector semantic search, Whisper ASR audio streaming, AI agent tool calling, and prompt engineering.\n` +
      `* 🚀 **Key Projects:** [AI Interview Copilot](/projects/ai-interview-copilot), [JobSeekers Recruitment Portal](/projects/job-portal), [Microservices E-Commerce](/projects/microservices-ecommerce), and [Enterprise RAG Platform](/projects/enterprise-rag-platform).\n\n` +
      `You can also explore his [GitHub Profile](https://github.com/mrityunjay45108) or [Reach Out Directly](/#contact)!`
    );
  }
}
