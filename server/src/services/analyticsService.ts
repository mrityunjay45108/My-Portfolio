import prisma from '../database/prisma.js';
import crypto from 'crypto';

export class AnalyticsService {
  static async recordEvent(data: {
    path: string;
    type?: string;
    resourceId?: string;
    ip?: string;
    userAgent?: string;
    referrer?: string;
  }) {
    // Anonymize IP hash for privacy
    const ipHash = data.ip
      ? crypto.createHash('sha256').update(data.ip).digest('hex').substring(0, 16)
      : null;

    return prisma.visitorAnalytics.create({
      data: {
        path: data.path,
        type: data.type || 'PAGE_VIEW',
        resourceId: data.resourceId || null,
        ipHash,
        userAgent: data.userAgent?.substring(0, 255) || null,
        referrer: data.referrer?.substring(0, 255) || null,
      },
    });
  }

  static async getDashboardStats() {
    const [
      totalProjects,
      publishedProjects,
      featuredProjects,
      totalBlogs,
      publishedBlogs,
      totalCaseStudies,
      publishedCaseStudies,
      totalMessages,
      unreadMessages,
      totalPageViews,
      recentMessages,
      topProjects,
      topBlogs,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({ where: { published: true } }),
      prisma.project.count({ where: { featured: true } }),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.caseStudy.count(),
      prisma.caseStudy.count({ where: { status: 'PUBLISHED' } }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.visitorAnalytics.count({ where: { type: 'PAGE_VIEW' } }),
      prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.project.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        select: { id: true, title: true, slug: true, viewCount: true, category: true },
      }),
      prisma.blogPost.findMany({
        take: 5,
        orderBy: { viewCount: 'desc' },
        select: { id: true, title: true, slug: true, viewCount: true, status: true },
      }),
    ]);

    return {
      projects: {
        total: totalProjects,
        published: publishedProjects,
        featured: featuredProjects,
      },
      blogs: {
        total: totalBlogs,
        published: publishedBlogs,
      },
      caseStudies: {
        total: totalCaseStudies,
        published: publishedCaseStudies,
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
        recent: recentMessages,
      },
      views: {
        total: totalPageViews,
      },
      topContent: {
        projects: topProjects,
        blogs: topBlogs,
      },
    };
  }
}
