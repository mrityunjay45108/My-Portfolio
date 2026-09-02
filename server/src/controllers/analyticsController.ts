import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analyticsService.js';

export class AnalyticsController {
  static async track(req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      await AnalyticsService.recordEvent({
        ...req.body,
        ip,
        userAgent,
      });

      res.status(200).json({
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStats(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AnalyticsService.getDashboardStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
