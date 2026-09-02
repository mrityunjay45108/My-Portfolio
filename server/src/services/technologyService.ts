import prisma from '../database/prisma.js';

export class TechnologyService {
  static async getAllTechnologies(category?: string) {
    const where: any = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    return prisma.technology.findMany({
      where,
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
  }

  static async createTechnology(data: { name: string; icon?: string; category?: string }) {
    return prisma.technology.create({
      data: {
        name: data.name,
        icon: data.icon || null,
        category: data.category || 'General',
      },
    });
  }

  static async updateTechnology(id: string, data: { name?: string; icon?: string; category?: string }) {
    return prisma.technology.update({
      where: { id },
      data,
    });
  }

  static async deleteTechnology(id: string) {
    return prisma.technology.delete({
      where: { id },
    });
  }
}
