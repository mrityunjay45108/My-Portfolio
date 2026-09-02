import prisma from '../../database/prisma.js';

export interface RetrievedSource {
  title: string;
  url: string;
  type: 'project' | 'blog' | 'case-study' | 'github' | 'contact' | 'skills' | 'education';
}

export interface RetrievalResult {
  contextText: string;
  sources: RetrievedSource[];
  responseType: 'text' | 'project' | 'project-list' | 'blog' | 'case-study' | 'github' | 'contact';
  metadata?: any;
}

export class AiKnowledgeService {
  /**
   * Retrieves relevant portfolio facts for a visitor's question
   */
  async retrieveContext(query: string): Promise<RetrievalResult> {
    const q = query.toLowerCase().trim();
    const sources: RetrievedSource[] = [];
    const contextSections: string[] = [];
    let responseType: RetrievalResult['responseType'] = 'text';
    let metadata: any = null;

    // 1. Fetch public portfolio data concurrently
    const [
      projects,
      caseStudies,
      blogPosts,
      technologies,
      githubRepos,
    ] = await Promise.all([
      prisma.project.findMany({
        where: { published: true },
        include: {
          technologies: { include: { technology: true } },
          features: { orderBy: { order: 'asc' } },
          images: { orderBy: { order: 'asc' } },
        },
        orderBy: [{ featured: 'desc' }, { order: 'asc' }],
      }),
      prisma.caseStudy.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          technologies: { include: { technology: true } },
        },
        orderBy: [{ featured: 'desc' }, { order: 'asc' }],
      }),
      prisma.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
          tags: { include: { tag: true } },
        },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.technology.findMany({
        orderBy: { category: 'asc' },
      }),
      prisma.gitHubRepository.findMany({
        orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }],
      }),
    ]);

    // Public Profile Summary
    const profileSummary = `
Candidate Name: Mrityunjay Kumar
Title: Full Stack Developer & AI Engineer
Primary Email: kumarmrityunjay5210@gmail.com
LinkedIn Profile: https://www.linkedin.com/in/mrityunjay-kumar-8480842a5
GitHub Profile: https://github.com/mrityunjay45108
Resume PDF Link: https://res.cloudinary.com/dpd6q8ex4/image/upload/v1788340801/Mrityunjay_kumar_resume0._ydptl9.pdf
Education:
- B.Tech in Computer Science & Engineering, Katihar Engineering College (BEU), 2021-2025. Score: CGPA 8.2 / 10 (First Class). 250+ LeetCode problems solved.
- Diploma in Mechanical Engineering, Government Polytechnic Sheohar, 2018-2021. Score: 78.5% Distinction.
Location: Bihar / Bengaluru, India (Open to Worldwide Remote & Full-Time Onsite Roles).
`.trim();

    // 2. Intent & Keyword Routing

    // Check for Contact / Hire intent
    if (
      q.includes('contact') ||
      q.includes('email') ||
      q.includes('hire') ||
      q.includes('reach') ||
      q.includes('linkedin') ||
      q.includes('phone') ||
      q.includes('resume')
    ) {
      sources.push({ title: 'Contact Information', url: '/#contact', type: 'contact' });
      sources.push({ title: 'LinkedIn Profile', url: 'https://www.linkedin.com/in/mrityunjay-kumar-8480842a5', type: 'contact' });
      responseType = 'contact';
      metadata = {
        email: 'kumarmrityunjay5210@gmail.com',
        linkedin: 'https://www.linkedin.com/in/mrityunjay-kumar-8480842a5',
        github: 'https://github.com/mrityunjay45108',
        resumeUrl: 'https://res.cloudinary.com/dpd6q8ex4/image/upload/v1788340801/Mrityunjay_kumar_resume0._ydptl9.pdf',
      };
    }

    // Check for GitHub / Repo intent
    if (q.includes('github') || q.includes('repository') || q.includes('repo') || q.includes('open source') || q.includes('codebase')) {
      sources.push({ title: 'GitHub Profile', url: 'https://github.com/mrityunjay45108', type: 'github' });
      sources.push({ title: 'GitHub Activity Center', url: '/github', type: 'github' });
      if (responseType === 'text') responseType = 'github';

      const repoSummaries = githubRepos.map(
        (r: any) => `* **${r.name}** (${r.language || 'Code'} • ⭐ ${r.stars}): ${r.customDescription || r.description || ''} -> ${r.url}`
      ).join('\n');

      contextSections.push(`### PUBLIC GITHUB REPOSITORIES:\n${repoSummaries}`);
    }

    // Check for Specific Project Matches
    const matchingProjects = projects.filter((p: any) => {
      const titleLower = p.title.toLowerCase();
      const slugLower = p.slug.toLowerCase();
      const catLower = p.category.toLowerCase();
      const techNames = p.technologies.map((t: any) => t.technology.name.toLowerCase());

      return (
        titleLower.includes(q) ||
        slugLower.includes(q) ||
        q.includes(slugLower) ||
        q.split(' ').some((word: string) => word.length > 3 && (titleLower.includes(word) || techNames.includes(word))) ||
        (q.includes('ai') && (catLower.includes('ai') || p.slug.includes('ai') || p.slug.includes('rag'))) ||
        (q.includes('ecommerce') && p.slug.includes('ecommerce')) ||
        (q.includes('job') && (p.slug.includes('job') || p.title.toLowerCase().includes('job'))) ||
        (q.includes('postgres') && techNames.includes('postgresql')) ||
        (q.includes('react') && techNames.includes('react')) ||
        (q.includes('microservices') && (p.slug.includes('ecommerce') || p.description.toLowerCase().includes('microservices')))
      );
    });

    if (matchingProjects.length === 1) {
      const p: any = matchingProjects[0];
      responseType = 'project';
      metadata = {
        title: p.title,
        slug: p.slug,
        category: p.category,
        shortDescription: p.shortDescription,
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
        image: p.images?.[0]?.url || p.architectureImage,
        technologies: p.technologies.map((t: any) => t.technology.name),
      };
      sources.push({ title: p.title, url: `/projects/${p.slug}`, type: 'project' });
    } else if (matchingProjects.length > 1) {
      if (responseType === 'text') responseType = 'project-list';
      matchingProjects.forEach((p: any) => {
        sources.push({ title: p.title, url: `/projects/${p.slug}`, type: 'project' });
      });
    }

    // Format Project Details for Context
    const projectContext = (matchingProjects.length > 0 ? matchingProjects : projects.slice(0, 4))
      .map((p: any) => {
        const techs = p.technologies.map((t: any) => t.technology.name).join(', ');
        const features = p.features.map((f: any) => `- ${f.title}: ${f.description}`).join('\n');
        return `
PROJECT: ${p.title} (Slug: ${p.slug})
Category: ${p.category} | Featured: ${p.featured ? 'Yes' : 'No'}
Live Demo URL: ${p.liveUrl || 'N/A'}
GitHub Repository: ${p.githubUrl || 'N/A'}
Description: ${p.description}
Key Technologies: ${techs}
Architecture: ${p.architectureDescription || 'Modern cloud-native decoupled architecture'}
Features:
${features}
`.trim();
      })
      .join('\n\n---\n\n');

    contextSections.push(`### VERIFIED PROJECTS IN PORTFOLIO:\n${projectContext}`);

    // Case Studies Context
    const matchingCaseStudies = caseStudies.filter((cs: any) => {
      return (
        cs.title.toLowerCase().includes(q) ||
        cs.slug.toLowerCase().includes(q) ||
        q.includes(cs.slug.toLowerCase()) ||
        (q.includes('case study') || q.includes('architecture') || q.includes('benchmark'))
      );
    });

    if (matchingCaseStudies.length > 0) {
      const csContext = matchingCaseStudies.map((cs: any) => {
        sources.push({ title: cs.title, url: `/case-studies/${cs.slug}`, type: 'case-study' });
        return `
CASE STUDY: ${cs.title} (Slug: ${cs.slug})
Summary: ${cs.summary}
Problem: ${cs.problem}
Architecture: ${cs.architecture || 'N/A'}
Results & Metrics: ${cs.results || 'N/A'}
Technologies: ${cs.technologies.map((t: any) => t.technology.name).join(', ')}
`.trim();
      }).join('\n\n');
      contextSections.push(`### DETAILED ARCHITECTURAL CASE STUDIES:\n${csContext}`);
    }

    // Technologies Summary
    const techCategories: Record<string, string[]> = {};
    technologies.forEach((t: any) => {
      if (!techCategories[t.category]) techCategories[t.category] = [];
      techCategories[t.category].push(t.name);
    });

    const techSummary = Object.entries(techCategories)
      .map(([cat, list]) => `${cat}: ${list.join(', ')}`)
      .join('\n');

    contextSections.push(`### VERIFIED SKILLS & TECHNOLOGIES:\n${techSummary}`);

    // Blog Posts Summary if asked about articles or topics
    if (q.includes('blog') || q.includes('article') || q.includes('read') || q.includes('write')) {
      const blogSummary = blogPosts.map((b: any) => {
        sources.push({ title: b.title, url: `/blog/${b.slug}`, type: 'blog' });
        return `* [${b.title}](/blog/${b.slug}): ${b.excerpt} (${b.category?.name || 'Tech'}, ${b.readingTime} min read)`;
      }).join('\n');
      contextSections.push(`### PUBLISHED ARTICLES & BLOG POSTS:\n${blogSummary}`);
    }

    // Combine Profile and Dynamic Context
    const fullContext = `
${profileSummary}

${contextSections.join('\n\n')}
`.trim();

    // Deduplicate sources by URL
    const uniqueSources = Array.from(new Map(sources.map((s) => [s.url, s])).values());

    return {
      contextText: fullContext,
      sources: uniqueSources.slice(0, 5),
      responseType,
      metadata,
    };
  }
}
