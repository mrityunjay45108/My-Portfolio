import { Request, Response, NextFunction } from 'express';
import { SettingsService } from '../services/settingsService.js';

export class SettingsController {
  static async getResume(req: Request, res: Response, next: NextFunction) {
    try {
      const resumeUrl = await SettingsService.getResumeUrl();
      res.status(200).json({
        success: true,
        data: {
          resumeUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateResume(req: Request, res: Response, next: NextFunction) {
    try {
      const { resumeUrl } = req.body;
      if (!resumeUrl) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid resumeUrl (e.g. Cloudinary PDF URL)',
        });
      }

      const updatedUrl = await SettingsService.updateResumeUrl(resumeUrl);

      res.status(200).json({
        success: true,
        message: 'Resume URL updated successfully!',
        data: {
          resumeUrl: updatedUrl,
        },
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update resume URL',
      });
    }
  }

  static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const settings = await SettingsService.getAllSettings();
      res.status(200).json({
        success: true,
        data: settings,
      });
    } catch (error) {
      next(error);
    }
  }
}
