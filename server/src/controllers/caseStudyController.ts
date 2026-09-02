import { Request, Response, NextFunction } from 'express';
import { CaseStudyService } from '../services/caseStudyService.js';

export class CaseStudyController {
  static async getCaseStudies(req: Request, res: Response, next: NextFunction) {
    try {
      const { featured, status, search } = req.query;
      const isAdmin = req.user?.role === 'ADMIN';

      const caseStudies = await CaseStudyService.getCaseStudies({
        featuredOnly: featured === 'true',
        status: status as any,
        isAdmin,
        search: search as string,
      });

      res.status(200).json({
        success: true,
        data: caseStudies,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCaseStudy(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = (Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug) as string;
      const isAdmin = req.user?.role === 'ADMIN';

      const caseStudy = await CaseStudyService.getCaseStudyBySlug(slug, isAdmin, !isAdmin);

      if (!caseStudy) {
        return res.status(404).json({
          success: false,
          message: 'Case study not found',
        });
      }

      res.status(200).json({
        success: true,
        data: caseStudy,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createCaseStudy(req: Request, res: Response, next: NextFunction) {
    try {
      const caseStudy = await CaseStudyService.createCaseStudy(req.body);
      res.status(201).json({
        success: true,
        message: 'Case study created successfully',
        data: caseStudy,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCaseStudy(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      const caseStudy = await CaseStudyService.updateCaseStudy(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Case study updated successfully',
        data: caseStudy,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCaseStudy(req: Request, res: Response, next: NextFunction) {
    try {
      const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
      await CaseStudyService.deleteCaseStudy(id);
      res.status(200).json({
        success: true,
        message: 'Case study deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
