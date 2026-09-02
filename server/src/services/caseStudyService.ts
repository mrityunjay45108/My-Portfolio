import prisma from '../database/prisma.js';

export interface CaseStudyInput {
  title: string;
  slug: string;
  summary: string;
  problem: string;
  background?: string;
  goals?: string;
  architecture?: string;
  architectureImage?: string;
  implementation?: string;
  challenges?: string;
  solutions?: string;
  security?: string;
  performance?: string;
  results?: string;
  lessonsLearned?: string;
  videoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  status?: 'DRAFT' | 'PREVIEW' | 'PUBLISHED' | 'ARCHIVED';
  technologies?: string[];
  sections?: { title: string; content: string; order: number }[];
}

export class CaseStudyService {
  static async getCaseStudies(params?: {
    status?: 'DRAFT' | 'PREVIEW' | 'PUBLISHED' | 'ARCHIVED';
    featuredOnly?: boolean;
    isAdmin?: boolean;
    search?: string;
  }) {
    const where: any = {};

    if (!params?.isAdmin) {
      where.status = 'PUBLISHED';
    } else if (params?.status) {
      where.status = params.status;
    }

    if (params?.featuredOnly) {
      where.featured = true;
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { summary: { contains: params.search, mode: 'insensitive' } },
        { problem: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return prisma.caseStudy.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      include: {
        images: { orderBy: { order: 'asc' } },
        technologies: { include: { technology: true } },
        sections: { orderBy: { order: 'asc' } },
      },
    });
  }

  static async getCaseStudyBySlug(slug: string, isAdmin = false, incrementView = true) {
    const where: any = { slug };
    if (!isAdmin) {
      where.status = 'PUBLISHED';
    }

    const caseStudy = await prisma.caseStudy.findFirst({
      where,
      include: {
        images: { orderBy: { order: 'asc' } },
        technologies: { include: { technology: true } },
        sections: { orderBy: { order: 'asc' } },
      },
    });

    if (caseStudy && incrementView) {
      await prisma.caseStudy.update({
        where: { id: caseStudy.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return caseStudy;
  }

  static async createCaseStudy(data: CaseStudyInput) {
    const { technologies = [], sections = [], ...caseStudyData } = data;

    const caseStudy = await prisma.caseStudy.create({
      data: {
        ...caseStudyData,
        publishedAt: caseStudyData.status === 'PUBLISHED' ? new Date() : null,
        sections: {
          create: sections.map((s, idx) => ({
            title: s.title,
            content: s.content,
            order: s.order !== undefined ? s.order : idx,
          })),
        },
      },
    });

    if (technologies.length > 0) {
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
        await prisma.caseStudyTechnology.create({
          data: {
            caseStudyId: caseStudy.id,
            technologyId: tech.id,
          },
        });
      }
    }

    return this.getCaseStudyBySlug(caseStudy.slug, true, false);
  }

  static async updateCaseStudy(id: string, data: Partial<CaseStudyInput>) {
    const { technologies, sections, ...caseStudyData } = data;

    const existing = await prisma.caseStudy.findUnique({ where: { id } });
    if (!existing) throw new Error('Case study not found');

    let publishedAt = existing.publishedAt;
    if (caseStudyData.status === 'PUBLISHED' && !existing.publishedAt) {
      publishedAt = new Date();
    }

    await prisma.caseStudy.update({
      where: { id },
      data: {
        ...caseStudyData,
        publishedAt,
      },
    });

    if (sections !== undefined) {
      await prisma.caseStudySection.deleteMany({ where: { caseStudyId: id } });
      if (sections.length > 0) {
        await prisma.caseStudySection.createMany({
          data: sections.map((s, idx) => ({
            caseStudyId: id,
            title: s.title,
            content: s.content,
            order: s.order !== undefined ? s.order : idx,
          })),
        });
      }
    }

    if (technologies !== undefined) {
      await prisma.caseStudyTechnology.deleteMany({ where: { caseStudyId: id } });
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
        await prisma.caseStudyTechnology.create({
          data: {
            caseStudyId: id,
            technologyId: tech.id,
          },
        });
      }
    }

    return this.getCaseStudyBySlug(existing.slug, true, false);
  }

  static async deleteCaseStudy(id: string) {
    return prisma.caseStudy.delete({ where: { id } });
  }
}
