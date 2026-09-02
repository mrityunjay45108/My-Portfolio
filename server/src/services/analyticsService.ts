import prisma from '../database/prisma.js';

export const ALLOWED_EVENT_TYPES = [
  'PAGE_VIEW',
  'PROJECT_VIEW',
  'PROJECT_GITHUB_CLICK',
  'PROJECT_LIVE_DEMO_CLICK',
  'BLOG_VIEW',
  'CASE_STUDY_VIEW',
  'RESUME_DOWNLOAD',
  'CONTACT_FORM_OPEN',
  'CONTACT_FORM_SUBMIT',
  'GITHUB_PROFILE_CLICK',
  'LINKEDIN_CLICK',
  'AI_ASSISTANT_OPEN',
  'AI_QUESTION',
  'AI_SOURCE_CLICK',
  'EXTERNAL_LINK_CLICK',
] as const;

export type AnalyticsEventType = typeof ALLOWED_EVENT_TYPES[number];

export interface RecordEventPayload {
  eventType: string;
  sessionId: string;
  page?: string;
  resourceType?: string;
  resourceId?: string;
  referrer?: string;
  metadata?: any;
}

export class AnalyticsService {
  /**
   * Helper to compute start date based on time range
   */
  private getDateFilter(range: string): Date | undefined {
    const now = new Date();
    switch (range) {
      case 'today': {
        const start = new Date(now);
        start.setHours(0, 0, 0, 0);
        return start;
      }
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case 'all':
      default:
        return undefined;
    }
  }

  /**
   * Normalize referrer URL into a clean domain category
   */
  private cleanReferrer(referrer?: string): string {
    if (!referrer || referrer === 'direct' || referrer.trim() === '') return 'Direct';
    try {
      const url = new URL(referrer.startsWith('http') ? referrer : `https://${referrer}`);
      const host = url.hostname.toLowerCase();
      if (host.includes('google')) return 'Google Search';
      if (host.includes('linkedin')) return 'LinkedIn';
      if (host.includes('github')) return 'GitHub';
      if (host.includes('twitter') || host.includes('t.co') || host.includes('x.com')) return 'Twitter / X';
      if (host.includes('bing') || host.includes('duckduckgo') || host.includes('yahoo')) return 'Search Engine';
      return host.replace(/^www\./, '');
    } catch {
      return 'Referral';
    }
  }

  /**
   * Ingest a single analytics event safely
   */
  async recordEvent(payload: RecordEventPayload) {
    if (!payload.eventType || !ALLOWED_EVENT_TYPES.includes(payload.eventType as any)) {
      return { success: false, message: 'Ignored: Invalid event type' };
    }

    const sessionId = (payload.sessionId || 'anon_' + Math.random().toString(36).slice(2)).slice(0, 64);
    const cleanRef = this.cleanReferrer(payload.referrer);
    let meta = payload.metadata;
    if (meta && typeof meta === 'object') {
      try {
        const serialized = JSON.stringify(meta);
        if (serialized.length > 2048) {
          meta = { note: 'truncated' };
        }
      } catch {
        meta = null;
      }
    }

    // Save event
    const event = await prisma.analyticsEvent.create({
      data: {
        eventType: payload.eventType,
        sessionId,
        page: payload.page ? payload.page.slice(0, 200) : null,
        resourceType: payload.resourceType ? payload.resourceType.slice(0, 50) : null,
        resourceId: payload.resourceId ? payload.resourceId.slice(0, 100) : null,
        referrer: cleanRef,
        metadata: meta || undefined,
      },
    });

    // Fire-and-forget view count increment on relevant models
    if (payload.resourceId) {
      if (payload.eventType === 'PROJECT_VIEW') {
        prisma.project.updateMany({
          where: { slug: payload.resourceId },
          data: { viewCount: { increment: 1 } },
        }).catch(() => {});
      } else if (payload.eventType === 'BLOG_VIEW') {
        prisma.blogPost.updateMany({
          where: { slug: payload.resourceId },
          data: { viewCount: { increment: 1 } },
        }).catch(() => {});
      } else if (payload.eventType === 'CASE_STUDY_VIEW') {
        prisma.caseStudy.updateMany({
          where: { slug: payload.resourceId },
          data: { viewCount: { increment: 1 } },
        }).catch(() => {});
      }
    }

    return { success: true, eventId: event.id };
  }

  /**
   * Overview metrics aggregation
   */
  async getOverview(timeRange = '30d') {
    const startDate = this.getDateFilter(timeRange);
    const whereClause: any = startDate ? { createdAt: { gte: startDate } } : {};

    const [
      events,
      distinctSessions,
      contactCount,
    ] = await Promise.all([
      prisma.analyticsEvent.findMany({
        where: whereClause,
        select: {
          id: true,
          eventType: true,
          sessionId: true,
          createdAt: true,
        },
      }),
      prisma.analyticsEvent.groupBy({
        by: ['sessionId'],
        where: whereClause,
      }),
      prisma.contactMessage.count({
        where: startDate ? { createdAt: { gte: startDate } } : {},
      }),
    ]);

    const totalVisitors = distinctSessions.length;
    let pageViews = 0;
    let projectViews = 0;
    let blogViews = 0;
    let caseStudyViews = 0;
    let resumeDownloads = 0;
    let githubClicks = 0;
    let liveDemoClicks = 0;
    let contactFormOpens = 0;

    // Daily buckets aggregation
    const dailyMap: Record<string, { date: string; visitors: Set<string>; views: number; downloads: number; clicks: number; contacts: number }> = {};

    events.forEach((ev) => {
      const dayKey = ev.createdAt.toISOString().slice(0, 10);
      if (!dailyMap[dayKey]) {
        dailyMap[dayKey] = {
          date: dayKey,
          visitors: new Set(),
          views: 0,
          downloads: 0,
          clicks: 0,
          contacts: 0,
        };
      }

      dailyMap[dayKey].visitors.add(ev.sessionId);

      switch (ev.eventType) {
        case 'PAGE_VIEW':
          pageViews++;
          dailyMap[dayKey].views++;
          break;
        case 'PROJECT_VIEW':
          projectViews++;
          dailyMap[dayKey].views++;
          break;
        case 'BLOG_VIEW':
          blogViews++;
          dailyMap[dayKey].views++;
          break;
        case 'CASE_STUDY_VIEW':
          caseStudyViews++;
          dailyMap[dayKey].views++;
          break;
        case 'RESUME_DOWNLOAD':
          resumeDownloads++;
          dailyMap[dayKey].downloads++;
          break;
        case 'PROJECT_GITHUB_CLICK':
        case 'GITHUB_PROFILE_CLICK':
          githubClicks++;
          dailyMap[dayKey].clicks++;
          break;
        case 'PROJECT_LIVE_DEMO_CLICK':
          liveDemoClicks++;
          dailyMap[dayKey].clicks++;
          break;
        case 'CONTACT_FORM_OPEN':
          contactFormOpens++;
          break;
        case 'CONTACT_FORM_SUBMIT':
          dailyMap[dayKey].contacts++;
          break;
      }
    });

    const contactConversionRate = totalVisitors > 0 ? parseFloat(((contactCount / totalVisitors) * 100).toFixed(2)) : 0;
    const resumeConversionRate = totalVisitors > 0 ? parseFloat(((resumeDownloads / totalVisitors) * 100).toFixed(2)) : 0;

    // Sort daily trend array
    const dailyTrend = Object.values(dailyMap)
      .map((d) => ({
        date: d.date,
        visitors: d.visitors.size,
        views: d.views,
        downloads: d.downloads,
        clicks: d.clicks,
        contacts: d.contacts,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      timeRange,
      totalVisitors,
      pageViews,
      projectViews,
      blogViews,
      caseStudyViews,
      resumeDownloads,
      githubClicks,
      liveDemoClicks,
      contactFormOpens,
      contactSubmissions: contactCount,
      contactConversionRate,
      resumeConversionRate,
      dailyTrend,
    };
  }

  /**
   * Project conversion performance table
   */
  async getProjectAnalytics(timeRange = '30d') {
    const startDate = this.getDateFilter(timeRange);
    const whereClause: any = {
      eventType: {
        in: ['PROJECT_VIEW', 'PROJECT_GITHUB_CLICK', 'PROJECT_LIVE_DEMO_CLICK'],
      },
      ...(startDate ? { createdAt: { gte: startDate } } : {}),
    };

    const [events, projects] = await Promise.all([
      prisma.analyticsEvent.findMany({
        where: whereClause,
        select: {
          eventType: true,
          resourceId: true,
        },
      }),
      prisma.project.findMany({
        where: { published: true },
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          viewCount: true,
          githubUrl: true,
          liveUrl: true,
        },
      }),
    ]);

    const projMap: Record<string, { views: number; githubClicks: number; liveDemoClicks: number }> = {};

    events.forEach((ev) => {
      const slug = ev.resourceId || 'unknown';
      if (!projMap[slug]) {
        projMap[slug] = { views: 0, githubClicks: 0, liveDemoClicks: 0 };
      }
      if (ev.eventType === 'PROJECT_VIEW') projMap[slug].views++;
      if (ev.eventType === 'PROJECT_GITHUB_CLICK') projMap[slug].githubClicks++;
      if (ev.eventType === 'PROJECT_LIVE_DEMO_CLICK') projMap[slug].liveDemoClicks++;
    });

    const results = projects.map((p) => {
      const stats = projMap[p.slug] || { views: p.viewCount || 0, githubClicks: 0, liveDemoClicks: 0 };
      const views = Math.max(stats.views, p.viewCount || 0);
      const githubClicks = stats.githubClicks;
      const liveDemoClicks = stats.liveDemoClicks;
      const totalClicks = githubClicks + liveDemoClicks;

      const githubCtr = views > 0 ? parseFloat(((githubClicks / views) * 100).toFixed(1)) : 0;
      const liveDemoCtr = views > 0 ? parseFloat(((liveDemoClicks / views) * 100).toFixed(1)) : 0;
      const totalCtr = views > 0 ? parseFloat(((totalClicks / views) * 100).toFixed(1)) : 0;

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        category: p.category,
        views,
        githubClicks,
        liveDemoClicks,
        totalClicks,
        githubCtr,
        liveDemoCtr,
        totalCtr,
        hasGithub: !!p.githubUrl,
        hasLiveDemo: !!p.liveUrl,
      };
    });

    // Sort by views descending
    return results.sort((a, b) => b.views - a.views);
  }

  /**
   * Recruiter & Lead Conversion Funnel
   */
  async getFunnel(timeRange = '30d') {
    const startDate = this.getDateFilter(timeRange);
    const whereClause: any = startDate ? { createdAt: { gte: startDate } } : {};

    const [events, contactCount] = await Promise.all([
      prisma.analyticsEvent.findMany({
        where: whereClause,
        select: { eventType: true, sessionId: true },
      }),
      prisma.contactMessage.count({
        where: startDate ? { createdAt: { gte: startDate } } : {},
      }),
    ]);

    const visitorSessions = new Set<string>();
    const projectSessions = new Set<string>();
    const engagementSessions = new Set<string>();
    const resumeSessions = new Set<string>();
    const contactSessions = new Set<string>();

    events.forEach((ev) => {
      visitorSessions.add(ev.sessionId);
      if (ev.eventType === 'PROJECT_VIEW' || ev.eventType === 'CASE_STUDY_VIEW') {
        projectSessions.add(ev.sessionId);
      }
      if (
        ev.eventType === 'PROJECT_GITHUB_CLICK' ||
        ev.eventType === 'PROJECT_LIVE_DEMO_CLICK' ||
        ev.eventType === 'GITHUB_PROFILE_CLICK' ||
        ev.eventType === 'LINKEDIN_CLICK'
      ) {
        engagementSessions.add(ev.sessionId);
      }
      if (ev.eventType === 'RESUME_DOWNLOAD') {
        resumeSessions.add(ev.sessionId);
      }
      if (ev.eventType === 'CONTACT_FORM_SUBMIT') {
        contactSessions.add(ev.sessionId);
      }
    });

    const s1 = visitorSessions.size || 1;
    const s2 = projectSessions.size;
    const s3 = engagementSessions.size;
    const s4 = resumeSessions.size;
    const s5 = Math.max(contactSessions.size, contactCount);

    return [
      { step: '1. Portfolio Visitors', count: s1, conversionRate: 100, dropoffRate: 0 },
      { step: '2. Project Exploration', count: s2, conversionRate: parseFloat(((s2 / s1) * 100).toFixed(1)), dropoffRate: parseFloat((100 - (s2 / s1) * 100).toFixed(1)) },
      { step: '3. GitHub / Live Demo Click', count: s3, conversionRate: parseFloat(((s3 / s1) * 100).toFixed(1)), dropoffRate: parseFloat((100 - (s3 / s1) * 100).toFixed(1)) },
      { step: '4. Resume Downloaded', count: s4, conversionRate: parseFloat(((s4 / s1) * 100).toFixed(1)), dropoffRate: parseFloat((100 - (s4 / s1) * 100).toFixed(1)) },
      { step: '5. Recruiter / Client Lead', count: s5, conversionRate: parseFloat(((s5 / s1) * 100).toFixed(1)), dropoffRate: parseFloat((100 - (s5 / s1) * 100).toFixed(1)) },
    ];
  }

  /**
   * Traffic sources classification
   */
  async getSources(timeRange = '30d') {
    const startDate = this.getDateFilter(timeRange);
    const whereClause: any = startDate ? { createdAt: { gte: startDate } } : {};

    const sources = await prisma.analyticsEvent.groupBy({
      by: ['referrer'],
      where: whereClause,
      _count: {
        _all: true,
      },
    });

    const total = sources.reduce((acc, s) => acc + s._count._all, 0);

    return sources
      .map((s) => ({
        source: s.referrer || 'Direct',
        count: s._count._all,
        percentage: total > 0 ? parseFloat(((s._count._all / total) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * CSV export of aggregated analytics
   */
  async exportCsv(timeRange = 'all'): Promise<string> {
    const startDate = this.getDateFilter(timeRange);
    const whereClause: any = startDate ? { createdAt: { gte: startDate } } : {};

    const events = await prisma.analyticsEvent.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: 5000,
    });

    const headers = ['ID', 'Event Type', 'Page', 'Resource Type', 'Resource ID', 'Referrer Source', 'Created At'];
    const rows = events.map((ev) => [
      ev.id,
      ev.eventType,
      ev.page || '',
      ev.resourceType || '',
      ev.resourceId || '',
      ev.referrer || 'Direct',
      ev.createdAt.toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    return csvContent;
  }

  /**
   * Retention cleanup
   */
  async cleanupOldEvents(retentionDays = 90) {
    const cutoff = new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000);
    const deleted = await prisma.analyticsEvent.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });
    return { success: true, deletedCount: deleted.count, cutoffDate: cutoff.toISOString() };
  }
}

export const analyticsService = new AnalyticsService();
