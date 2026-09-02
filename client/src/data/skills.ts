export interface SkillCategory {
  title: string;
  description: string;
  skills: {
    name: string;
    level: string; // e.g. "Advanced", "Proficient", "Expert"
    iconName: string;
    featured?: boolean;
  }[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'AI / GenAI',
    description: 'Autonomous agents, RAG pipelines, LLM fine-tuning & prompt engineering',
    skills: [
      { name: 'LLM', level: 'Advanced', iconName: 'Brain', featured: true },
      { name: 'RAG', level: 'Advanced', iconName: 'Sparkles', featured: true },
      { name: 'Generative AI', level: 'Advanced', iconName: 'Bot', featured: true },
      { name: 'AI Agents', level: 'Proficient', iconName: 'Wand2', featured: true },
      { name: 'Prompt Engineering', level: 'Expert', iconName: 'MessageSquareCode', featured: true },
      { name: 'AI APIs', level: 'Expert', iconName: 'Radio', featured: true },
    ],
  },
  {
    title: 'Languages',
    description: 'Strong foundations in systems, scripting, and typed software development',
    skills: [
      { name: 'TypeScript', level: 'Advanced', iconName: 'Code', featured: true },
      { name: 'JavaScript', level: 'Expert', iconName: 'FileJson', featured: true },
      { name: 'Python', level: 'Advanced', iconName: 'Terminal', featured: true },
      { name: 'C++', level: 'Proficient', iconName: 'Code2', featured: false },
      { name: 'C', level: 'Proficient', iconName: 'FileCode', featured: false },
    ],
  },
  {
    title: 'Frontend',
    description: 'Modern, responsive, accessible, high-performance UI architectures',
    skills: [
      { name: 'React', level: 'Expert', iconName: 'Atom', featured: true },
      { name: 'Next.js', level: 'Advanced', iconName: 'Layers', featured: true },
      { name: 'Tailwind CSS', level: 'Expert', iconName: 'Palette', featured: true },
      { name: 'Vite', level: 'Advanced', iconName: 'Zap', featured: false },
      { name: 'Shadcn UI', level: 'Advanced', iconName: 'Layout', featured: true },
      { name: 'Mantine UI', level: 'Proficient', iconName: 'Box', featured: false },
    ],
  },
  {
    title: 'Backend',
    description: 'Scalable APIs, event-driven architectures, and microservices',
    skills: [
      { name: 'Node.js', level: 'Expert', iconName: 'Server', featured: true },
      { name: 'Express.js', level: 'Expert', iconName: 'Cpu', featured: true },
      { name: 'NestJS', level: 'Proficient', iconName: 'Network', featured: false },
    ],
  },
  {
    title: 'Databases',
    description: 'Relational, document, caching, and ORM abstractions',
    skills: [
      { name: 'PostgreSQL', level: 'Advanced', iconName: 'Database', featured: true },
      { name: 'MongoDB', level: 'Advanced', iconName: 'HardDrive', featured: true },
      { name: 'MySQL', level: 'Proficient', iconName: 'Database', featured: false },
      { name: 'Neon', level: 'Advanced', iconName: 'CloudLightning', featured: false },
      { name: 'Prisma', level: 'Expert', iconName: 'Boxes', featured: true },
    ],
  },
  {
    title: 'DevOps / Cloud',
    description: 'Containerization, orchestration, distributed caching, and deployments',
    skills: [
      { name: 'Docker', level: 'Advanced', iconName: 'Container', featured: true },
      { name: 'Kubernetes', level: 'Proficient', iconName: 'Anchor', featured: false },
      { name: 'Redis', level: 'Advanced', iconName: 'Flame', featured: true },
      { name: 'AWS', level: 'Proficient', iconName: 'Cloud', featured: true },
      { name: 'GCP', level: 'Proficient', iconName: 'CloudSun', featured: false },
      { name: 'Azure', level: 'Proficient', iconName: 'CloudFog', featured: false },
    ],
  },
];
