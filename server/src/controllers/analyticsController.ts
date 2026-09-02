import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService.js';

export const analyticsController = {
  /**
   * Ingest event from public visitor
   */
  async recordEvent(req: Request, res: Response) {
    try {
      const { eventType, sessionId, page, resourceType, resourceId, referrer, metadata } = req.body;
      const result = await analyticsService.recordEvent({
        eventType,
        sessionId,
        page,
        resourceType,
        resourceId,
        referrer: referrer || (req.headers.referer as string) || undefined,
        metadata,
      });

      return res.json(result);
    } catch (error: any) {
      // Non-blocking: return 200 with error log
      return res.status(200).json({ success: false, error: error.message });
    }
  },

  /**
   * Admin Overview
   */
  async getOverview(req: Request, res: Response) {
    try {
      const timeRange = (req.query.timeRange as string) || '30d';
      const data = await analyticsService.getOverview(timeRange);
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Admin Projects Performance
   */
  async getProjects(req: Request, res: Response) {
    try {
      const timeRange = (req.query.timeRange as string) || '30d';
      const data = await analyticsService.getProjectAnalytics(timeRange);
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Admin Funnel
   */
  async getFunnel(req: Request, res: Response) {
    try {
      const timeRange = (req.query.timeRange as string) || '30d';
      const data = await analyticsService.getFunnel(timeRange);
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Admin Sources
   */
  async getSources(req: Request, res: Response) {
    try {
      const timeRange = (req.query.timeRange as string) || '30d';
      const data = await analyticsService.getSources(timeRange);
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Admin Export CSV
   */
  async exportCsv(req: Request, res: Response) {
    try {
      const timeRange = (req.query.timeRange as string) || 'all';
      const csvData = await analyticsService.exportCsv(timeRange);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=portfolio_analytics_${Date.now()}.csv`);
      return res.send(csvData);
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * Admin Cleanup
   */
  async cleanup(req: Request, res: Response) {
    try {
      const days = parseInt(req.body.days) || 90;
      const result = await analyticsService.cleanupOldEvents(days);
      return res.json({ success: true, data: result });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};
