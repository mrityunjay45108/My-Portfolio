import prisma from '../database/prisma.js';

export interface ProjectCreateInput {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category?: string;
  featured?: boolean;
  published?: boolean;
  githubUrl?: string;
  liveUrl?: string;
  architectureImage?: string;
  architectureDescription?: string;
  videoUrl?: string;
  order?: number;
  technologies?: string[]; // Array of tech names or IDs
  features?: { title: string; description: string }[];
}

export class ProjectService {
  static async getAllProjects(params?: {
    publishedOnly?: boolean;
    featuredOnly?: boolean;
    category?: string;
    search?: string;
  }) {
    const where: any = {};

    if (params?.publishedOnly) {
      where.published = true;
    }

    if (params?.featuredOnly) {
      where.featured = true;
    }

    if (params?.category && params.category !== 'All') {
      where.category = params.category;
    }

    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { shortDescription: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    return prisma.project.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        features: {
          orderBy: { order: 'asc' },
        },
        technologies: {
          include: {
            technology: true,
          },
        },
      },
    });
  }

  static async getFeaturedProjects() {
    return prisma.project.findMany({
      where: {
        published: true,
        featured: true,
      },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      include: {
        images: { orderBy: { order: 'asc' } },
        features: { orderBy: { order: 'asc' } },
        technologies: { include: { technology: true } },
      },
    });
  }

  static async getProjectBySlugOrId(identifier: string, incrementView = false) {
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: identifier }, { slug: identifier }],
      },
      include: {
        images: { orderBy: { order: 'asc' } },
        features: { orderBy: { order: 'asc' } },
        technologies: { include: { technology: true } },
      },
    });

    if (project && incrementView) {
      await prisma.project.update({
        where: { id: project.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return project;
  }

  static async createProject(data: ProjectCreateInput) {
    const { technologies = [], features = [], ...projectData } = data;

    // Create the project
    const project = await prisma.project.create({
      data: {
        ...projectData,
        features: {
          create: features.map((f, idx) => ({
            title: f.title,
            description: f.description,
            order: idx,
          })),
        },
      },
    });

    // Attach technologies
    if (technologies.length > 0) {
      for (const techInput of technologies) {
        // Find existing technology by ID or Name
        let tech = await prisma.technology.findFirst({
          where: {
            OR: [{ id: techInput }, { name: { equals: techInput, mode: 'insensitive' } }],
          },
        });

        if (!tech) {
          // Auto-create tech if it doesn't exist
          tech = await prisma.technology.create({
            data: {
              name: techInput,
              category: 'General',
            },
          });
        }

        await prisma.projectTechnology.create({
          data: {
            projectId: project.id,
            technologyId: tech.id,
          },
        });
      }
    }

    return this.getProjectBySlugOrId(project.id);
  }

  static async updateProject(id: string, data: Partial<ProjectCreateInput>) {
    const { technologies, features, ...projectData } = data;

    // Update basic fields
    await prisma.project.update({
      where: { id },
      data: projectData,
    });

    // Update features if provided
    if (features !== undefined) {
      await prisma.projectFeature.deleteMany({ where: { projectId: id } });
      if (features.length > 0) {
        await prisma.projectFeature.createMany({
          data: features.map((f, idx) => ({
            projectId: id,
            title: f.title,
            description: f.description,
            order: idx,
          })),
        });
      }
    }

    // Update technologies if provided
    if (technologies !== undefined) {
      await prisma.projectTechnology.deleteMany({ where: { projectId: id } });

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

        await prisma.projectTechnology.create({
          data: {
            projectId: id,
            technologyId: tech.id,
          },
        });
      }
    }

    return this.getProjectBySlugOrId(id);
  }

  static async deleteProject(id: string) {
    return prisma.project.delete({
      where: { id },
    });
  }

  static async addImage(projectId: string, url: string, altText?: string, order = 0) {
    return prisma.projectImage.create({
      data: {
        projectId,
        url,
        altText,
        order,
      },
    });
  }

  static async deleteImage(imageId: string) {
    return prisma.projectImage.delete({
      where: { id: imageId },
    });
  }

  static async reorderImages(images: { id: string; order: number }[]) {
    return prisma.$transaction(
      images.map((img) =>
        prisma.projectImage.update({
          where: { id: img.id },
          data: { order: img.order },
        })
      )
    );
  }
}
