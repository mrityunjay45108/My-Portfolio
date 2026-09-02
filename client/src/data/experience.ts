import { ExperienceItem } from '../types';

export const experiences: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Full Stack & AI Engineer',
    company: 'Independent Software Engineer / Open Source',
    location: 'Remote, India',
    duration: '2023 - Present',
    type: 'Full-time & Research',
    description: [
      'Architected and delivered end-to-end full stack web applications with React, TypeScript, Node.js, and PostgreSQL.',
      'Engineered Retrieval-Augmented Generation (RAG) pipelines and integrated LLM APIs with streaming WebSocket responses and schema validation.',
      'Designed microservices architectures with Docker, Redis caching, and automated CI/CD deployment pipelines.',
      'Solved 250+ data structures and algorithmic problems on LeetCode with high ranking.'
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Express.js', 'PostgreSQL', 'Prisma', 'Docker', 'Redis', 'LLM', 'RAG']
  },
  {
    id: 'exp-2',
    role: 'Software Development Engineering Intern',
    company: 'Tech Solutions & Development Lab',
    location: 'India',
    duration: '2023 - 2024',
    type: 'Internship',
    description: [
      'Developed responsive frontend interfaces with React, Tailwind CSS, and component libraries.',
      'Built and maintained RESTful API endpoints using Node.js and Express with comprehensive validation.',
      'Assisted in relational database schema design, indexing, and Prisma ORM migrations.',
      'Participated in code reviews, bug fixes, and unit test implementations.'
    ],
    technologies: ['React', 'JavaScript', 'Node.js', 'Express.js', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Git']
  }
];
